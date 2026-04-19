"""
Portfolio AI Chat Backend
FastAPI + LangChain + Groq (Free LLM)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import yaml
import os
from dotenv import load_dotenv

# LangChain imports
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

load_dotenv()

app = FastAPI(
    title="Ayaan's Portfolio Chat API",
    description="AI-powered chat for portfolio questions",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ayaanizhar.com",  # Update with your domain
        "https://www.ayaanizhar.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load knowledge base
def load_knowledge_base():
    knowledge_path = os.path.join(os.path.dirname(__file__), "knowledge.yaml")
    with open(knowledge_path, "r") as f:
        return yaml.safe_load(f)

KNOWLEDGE = load_knowledge_base()

# Initialize LLM (Groq - Free tier)
llm = ChatGroq(
    model="llama-3.3-70b-versatile",  # Free, fast, smart
    temperature=0.7,
    max_tokens=500,
)

# Create system prompt from knowledge base
def create_system_prompt():
    kb = KNOWLEDGE
    rules = kb.get("assistant_rules", {})
    
    return f"""You are a helpful AI assistant for {kb['personal']['name']}'s portfolio website.

ABOUT {kb['personal']['name'].upper()}:
- Title: {kb['personal']['title']}
- Tagline: {kb['personal']['tagline']}
- Bio: {kb['personal']['bio']}

SKILLS:
- Best Skills: {', '.join(kb['skills'].get('best_skills', []))}
- Languages: {', '.join([s['name'] for s in kb['skills'].get('languages', [])])}
- Frameworks: {', '.join([s['name'] for s in kb['skills'].get('frameworks', [])])}
- Tools: {', '.join(kb['skills'].get('tools', []))}

PROJECTS:
{yaml.dump(kb.get('projects', {}), default_flow_style=False)}

EXPERIENCE:
{yaml.dump(kb.get('experience', {}), default_flow_style=False)}

HOBBIES:
{', '.join(kb.get('hobbies', []))}

CONTACT:
{yaml.dump(kb.get('contact', {}), default_flow_style=False)}

RESPONSE GUIDELINES:
- Personality: {', '.join(rules.get('personality', []))}
- Style: {', '.join(rules.get('response_style', []))}

GUARDRAILS (STRICT):
{chr(10).join(['- ' + g for g in rules.get('guardrails', [])])}

OFF-TOPIC RESPONSE:
{rules.get('off_topic_response', 'I can only answer questions about the portfolio.')}

SUGGESTED TOPICS (guide users here if they seem lost):
{', '.join(rules.get('suggested_topics', []))}

Remember: Be friendly, helpful, and stay focused on {kb['personal']['name']}'s portfolio. 
If you don't have information about something, say so and suggest they contact {kb['personal']['name']} directly.
Keep responses concise but informative (2-4 sentences typically, more for detailed questions).
"""

SYSTEM_PROMPT = create_system_prompt()

# Request/Response models
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    response: str
    suggested_questions: Optional[List[str]] = None

# Chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Build message history
        messages = []
        for msg in request.history[-10:]:  # Keep last 10 messages for context
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.content))
            else:
                messages.append(AIMessage(content=msg.content))
        
        # Add current message
        messages.append(HumanMessage(content=request.message))
        
        # Create prompt template
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}")
        ])
        
        # Create chain
        chain = prompt | llm
        
        # Get response
        response = chain.invoke({
            "history": messages[:-1],  # All but the last message
            "input": request.message
        })
        
        # Generate suggested follow-up questions based on context
        suggested = get_suggested_questions(request.message)
        
        return ChatResponse(
            response=response.content,
            suggested_questions=suggested
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

def get_suggested_questions(user_message: str) -> List[str]:
    """Generate contextual follow-up questions"""
    user_lower = user_message.lower()
    
    if any(word in user_lower for word in ["skill", "good at", "best"]):
        return [
            "What projects showcase these skills?",
            "What tech stack do you prefer?",
            "Are you available for freelance work?"
        ]
    elif any(word in user_lower for word in ["project", "portfolio", "work"]):
        return [
            "What challenges did you face in this project?",
            "What technologies were used?",
            "Do you have more projects like this?"
        ]
    elif any(word in user_lower for word in ["contact", "hire", "available"]):
        return [
            "What's the best way to reach you?",
            "What type of projects interest you?",
            "What's your preferred work style?"
        ]
    else:
        return [
            "What are your best skills?",
            "Tell me about your projects",
            "What's your tech stack?"
        ]

# Health check
@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "portfolio-chat"}

# Get suggested starter questions
@app.get("/api/suggestions")
async def get_suggestions():
    return {
        "questions": [
            "What are your best skills?",
            "Tell me about your projects",
            "What tech stack do you work with?",
            "Are you available for opportunities?",
            "What makes you unique as a developer?"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
