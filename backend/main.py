"""
Portfolio AI Chat Backend
FastAPI + LangChain + Groq (Free LLM)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Literal
import asyncio
import re
import yaml
import os
import logging
from dotenv import load_dotenv

# Fuzzy trigger matching for lazy-loading signature takes.
from rapidfuzz import fuzz

# LangChain imports
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

logger = logging.getLogger("portfolio_chat")

load_dotenv()

app = FastAPI(
    title="Ayaan's Portfolio Chat API",
    description="AI-powered chat for portfolio questions",
    version="1.0.0"
)

DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://ayaanizhar.com",
    "https://www.ayaanizhar.com",
    "https://megpt-eta.vercel.app",
]

extra_allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]

allowed_origins = DEFAULT_ALLOWED_ORIGINS + extra_allowed_origins

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    # Allow Vercel preview and production domains such as *.vercel.app.
    allow_origin_regex=r"https://.*\.vercel\.app",
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

SECRET_CODE = KNOWLEDGE.get("SecretCode", {})

# LLM clients are lazy-initialized on first use rather than at module import.
# Rationale: ChatGroq's constructor validates GROQ_API_KEY immediately, so an
# eager init at import-time means a missing key crashes the whole FastAPI app
# before any route can serve — including /api/health and /api/suggestions, which
# don't need the LLM at all. Lazy init lets the service stay up and surfaces the
# missing-key error only on /api/chat, where it belongs and where the exception
# handler can return a clean 500 + log the cause server-side.
#
# Tests monkey-patch `llm` / `normalizer_llm` directly with a RunnableLambda;
# the getter checks `is not None` first, so a patched value short-circuits the
# real ChatGroq construction.
llm: Optional[ChatGroq] = None
normalizer_llm: Optional[ChatGroq] = None


def _get_llm() -> ChatGroq:
    """Main 70B model for answers. Temperature 0.85 keeps phrasing varied across
    repeat questions; max_tokens=300 caps worst-case Groq spend per call."""
    global llm
    if llm is None:
        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.85,
            max_tokens=300,
        )
    return llm


def _get_normalizer_llm() -> ChatGroq:
    """8B model used only by _normalize_via_llm for fixing typos. Faster than the
    70B and has its own (much larger) Groq daily token cap, so a rescue call
    doesn't drain the main budget. Low temperature for deterministic output."""
    global normalizer_llm
    if normalizer_llm is None:
        normalizer_llm = ChatGroq(
            model="llama-3.1-8b-instant",
            temperature=0.0,
            max_tokens=120,
        )
    return normalizer_llm


# Fuzzy trigger matching (lazy-load signature takes by user intent)

# Above-threshold means "this trigger is in the message." Tuned to catch
# single-character typos without false-positiving short words.
FUZZY_PARTIAL_THRESHOLD = 82
FUZZY_TOKEN_SET_THRESHOLD = 78

# When fuzzy + normalizer both fail, ship these broad takes so the user gets a
# strong on-brand answer rather than a generic LLM response. Topics here MUST
# match the `topic:` field in knowledge.yaml signature_takes exactly.
FALLBACK_TAKE_TOPICS = [
    "projects",
    "professional experience at Experian",
    "strongest programming language",
    "hobbies and how Ayaan spends time",
]

# Min characters before fuzzy comparison — single-letter "triggers" like "r"
# would otherwise match everything. Triggers shorter than this fall back to
# strict substring check.
MIN_FUZZY_TRIGGER_LEN = 4


def _squash(s: str) -> str:
    """Collapse repeated characters: 'spoorss' -> 'spors', 'plyss' -> 'plys'.

    Knocks out the most common typo class (held-down key) before fuzzy match,
    pushing those queries into the free Path A instead of the +120-token Path B.
    """
    return re.sub(r"(.)\1+", r"\1", s.lower())


def _trigger_hits_message(trigger: str, user_message: str, squashed_message: str) -> bool:
    """Return True if `trigger` is present in `user_message` after light fuzzing.

    Pipeline: strict substring (cheap) -> [≤2-word triggers only] partial_ratio
    + token_set_ratio. Long triggers (>2 words) only match on strict substring
    because fuzzy-matching multi-word triggers picks up shared lexical filler
    like "tell me about" or "what does he do" and false-positives on unrelated
    queries. Short triggers (<MIN_FUZZY_TRIGGER_LEN chars) also fall back to
    strict substring to avoid matching common letter clusters.
    """
    trigger = trigger.lower().strip()
    if not trigger:
        return False

    msg = user_message.lower()

    # Strict substring on the raw message is the cheapest hit.
    if trigger in msg:
        return True

    # Short triggers and long multi-word triggers do not enter the fuzzy path.
    if len(trigger) < MIN_FUZZY_TRIGGER_LEN or len(trigger.split()) > 2:
        return False

    # Strict substring on the squashed message catches double-letter typos
    # ("spoorss" -> "spors" still doesn't contain "sport" — that's what
    # partial_ratio handles next).
    squashed_trigger = _squash(trigger)
    if squashed_trigger in squashed_message:
        return True

    # rapidfuzz: partial_ratio finds the best matching window of the trigger
    # inside the message; token_set_ratio handles word reorder + extra noise.
    if fuzz.partial_ratio(squashed_trigger, squashed_message) >= FUZZY_PARTIAL_THRESHOLD:
        return True
    if fuzz.token_set_ratio(squashed_trigger, squashed_message) >= FUZZY_TOKEN_SET_THRESHOLD:
        return True

    return False


def _match_takes(user_message: str) -> list[dict]:
    """Scan all signature_takes and return the ones whose triggers match the message.

    Pure Python, no API call, runs in microseconds for the take counts we have.
    """
    takes = KNOWLEDGE.get("signature_takes", []) or []
    squashed_message = _squash(user_message)
    matched: list[dict] = []
    for t in takes:
        for trigger in t.get("triggers", []) or []:
            if _trigger_hits_message(trigger, user_message, squashed_message):
                matched.append(t)
                break
    return matched


def _fallback_takes() -> list[dict]:
    """Broad take set for when nothing matches — keeps the answer high-quality
    instead of falling back to a generic LLM reply."""
    takes = KNOWLEDGE.get("signature_takes", []) or []
    topic_to_take = {t.get("topic"): t for t in takes}
    return [topic_to_take[topic] for topic in FALLBACK_TAKE_TOPICS if topic in topic_to_take]


def _normalize_via_llm(user_message: str) -> Optional[str]:
    """Use the 8B model to fix typos. Returns cleaned text or None on failure.

    Wrapped so a normalizer failure (rate-limit, network) drops cleanly to the
    fallback path instead of bubbling a 500 to the user.
    """
    try:
        prompt = ChatPromptTemplate.from_messages([
            (
                "system",
                "You are a query normalizer. Fix typos and minor grammar in the user's "
                "message. Return ONLY the cleaned text — no explanation, no quotes, no "
                "preamble. If the message is already clean, return it unchanged.",
            ),
            ("human", "{input}"),
        ])
        result = (prompt | _get_normalizer_llm()).invoke({"input": user_message})
        cleaned = (result.content or "").strip().strip('"').strip("'")
        return cleaned or None
    except Exception as e:
        logger.warning("normalizer call failed: %s", e)
        return None


def _select_takes(user_message: str) -> tuple[list[dict], str]:
    """Decide which takes to ship for this turn.

    Returns (takes, path_label) where path_label is one of:
      - "fuzzy"      : matched on the raw message
      - "normalized" : matched only after the LLM normalized typos
      - "fallback"   : nothing matched, broad default set
    """
    # Step 1-3: fuzzy with squash + partial_ratio + token_set_ratio.
    matched = _match_takes(user_message)
    if matched:
        return matched, "fuzzy"

    # Step 4-5: small LLM fixes typos, retry fuzzy.
    cleaned = _normalize_via_llm(user_message)
    if cleaned and cleaned.lower() != user_message.lower():
        matched = _match_takes(cleaned)
        if matched:
            return matched, "normalized"

    # Step 7: broad fallback so the user gets a quality answer instead of nothing.
    return _fallback_takes(), "fallback"


# System prompt builder — static parts cached at boot; takes selected per request

def _render_takes(takes: list[dict]) -> str:
    """Render a list of take dicts as the BACKGROUND KNOWLEDGE section.

    NOTE: TRIGGERS are deliberately NOT included in the rendered prompt — they
    were originally just hints to the LLM, and now Python does the trigger
    matching. Dropping them saves ~150 tokens per loaded take.
    """
    if not takes:
        return ""
    header = (
        "BACKGROUND KNOWLEDGE — facts and perspectives you have internalized about Ayaan.\n"
        "These are CONTENT SOURCES, NOT SCRIPTS. Convey the substance but vary your opening,\n"
        "sentence structure, and ordering every single time. NEVER copy the wording. NEVER\n"
        "start two consecutive answers with the same phrase. Pick only the facts that fit the\n"
        "user's actual question — don't dump every bullet."
    )
    rendered = [header]
    for t in takes:
        rendered.append(f"\n- TOPIC: {t.get('topic', '')}")
        rendered.append(f"  NOTES:\n{t.get('take', '').strip()}")
    return "\n".join(rendered)


def _build_static_parts(mode: str = "default") -> str:
    """The always-on portion of the system prompt — built once at boot per mode.

    Does NOT include the BACKGROUND KNOWLEDGE block; that's appended per request.
    """
    kb = KNOWLEDGE
    rules = kb.get("assistant_rules", {})

    if mode == "unlocked":
        private_block = (
            "UNLOCKED PRIVATE CONTEXT (the user just supplied the code phrase — this turn only):\n"
            "- You MAY now discuss Ayaan's love life, but only using the source material below.\n"
            "- Source material (REPHRASE warmly in your own voice, do not recite verbatim):\n"
            f"  \"{SECRET_CODE.get('answer', '')}\"\n"
            "- Stay 3–5 sentences. Do not invent details beyond the source.\n"
            "- After answering, gently invite the user back to portfolio topics."
        )
    else:
        private_block = (
            "PRIVATE TOPICS (DO NOT DISCUSS):\n"
            "- Ayaan's personal life, relationships, love life, dating, marriage status, partners.\n"
            "- Anyone named Wuavee, Wuava, or Umama.\n"
            "- If asked about any of these, reply exactly: \"I am not allowed to share his personal life unless you can give me the code words.\" and nothing more.\n"
            "- Do not speculate, hint, or paraphrase. Do not acknowledge that a secret exists."
        )

    return f"""You are a helpful AI assistant for {kb['personal']['name']}'s portfolio website.

ABOUT {kb['personal']['name'].upper()}:
- Title: {kb['personal']['title']}
- Tagline: {kb['personal']['tagline']}
- Bio: {kb['personal']['bio']}

SKILLS:
- Best Skills: {', '.join(kb['skills'].get('best_skills', []))}
- Languages: {', '.join([s['name'] for s in kb['skills'].get('languages', [])])}
- Frameworks: {', '.join([s['name'] for s in kb['skills'].get('frameworks', [])])}

TECHNICAL INTERESTS (use only when the user asks specifically about technical/engineering interests — NOT for general "hobbies / free time / what do you like" questions, those have a dedicated signature take):
{', '.join(kb.get('hobbies', []))}

{private_block}

CONTACT:
{yaml.dump(kb.get('contact', {}), default_flow_style=False)}

RESPONSE GUIDELINES:
- Personality: {', '.join(rules.get('personality', []))}
- Style: {chr(10).join(['  • ' + s for s in rules.get('response_style', [])])}

GUARDRAILS (STRICT):
{chr(10).join(['- ' + g for g in rules.get('guardrails', [])])}

OFF-TOPIC RESPONSE:
{rules.get('off_topic_response', 'I can only answer questions about the portfolio.')}

SUGGESTED TOPICS (guide users here if they seem lost):
{', '.join(rules.get('suggested_topics', []))}

Remember: speak as if Ayaan trained you personally. Sound natural, not templated. Vary your
openings — never start two answers in the same conversation with the same phrase. Reframe a
question only when it's genuinely vague, and even then do it conversationally. Density over
length: 3–6 sentences unless the question genuinely needs more.
"""


# Built once at boot — the static parts of the prompt never depend on the user's message.
STATIC_PROMPT_DEFAULT = _build_static_parts("default")
STATIC_PROMPT_UNLOCKED = _build_static_parts("unlocked")


def build_system_prompt_for(user_message: str, mode: str = "default") -> tuple[str, str]:
    """Compose the per-request system prompt: static parts + lazily selected takes.

    Returns (prompt_text, path_label) — path_label is "fuzzy" / "normalized" /
    "fallback" / "unlocked" for observability.
    """
    static = STATIC_PROMPT_UNLOCKED if mode == "unlocked" else STATIC_PROMPT_DEFAULT
    if mode == "unlocked":
        # On unlock, ship the projects + experience takes so the LLM has something
        # to steer back to after answering. No selection cost here.
        takes = _fallback_takes()
        path = "unlocked"
    else:
        takes, path = _select_takes(user_message)
    takes_block = _render_takes(takes)
    return f"{static}\n{takes_block}\n", path

# Request/Response models
# Limits chosen to bound worst-case Groq token spend and protect against payload
# bombs: a 2 kB message ≈ 500 tokens; history items can be longer because they
# include past assistant replies; history is hard-capped at 20 entries (the
# handler also slices to the last 10 for context).
class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1, max_length=4000)

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: List[ChatMessage] = Field(default_factory=list, max_length=20)

class ChatResponse(BaseModel):
    response: str
    suggested_questions: Optional[List[str]] = None

# Chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        user_lower = request.message.lower()

        # Build message history once — used by both the unlocked and default branches.
        history_msgs = []
        for msg in request.history[-10:]:
            if msg.role == "user":
                history_msgs.append(HumanMessage(content=msg.content))
            else:
                history_msgs.append(AIMessage(content=msg.content))

        # 1) Code phrase unlocks the private context. Route through the LLM with
        #    the unlocked system prompt so the answer is rephrased naturally rather
        #    than returned verbatim. Unlock path does not call the normalizer, so
        #    the prompt build is a fast pure-Python call — no thread offload needed.
        code_phrase = SECRET_CODE.get("Question", "").lower().strip()
        if code_phrase and code_phrase in user_lower:
            system_text, path = build_system_prompt_for(request.message, mode="unlocked")
            unlocked_prompt = ChatPromptTemplate.from_messages([
                ("system", system_text),
                MessagesPlaceholder(variable_name="history"),
                ("human", "{input}"),
            ])
            unlocked_response = await (unlocked_prompt | _get_llm()).ainvoke({
                "history": history_msgs,
                "input": request.message,
            })
            logger.info("chat path=%s", path)
            return ChatResponse(
                response=unlocked_response.content,
                suggested_questions=[
                    "Tell me about Ayaan's projects",
                    "What are Ayaan's best skills?",
                    "How can I contact Ayaan?",
                ],
            )

        # 2) Personal-life questions WITHOUT the code phrase are gated server-side
        #    so the LLM never sees the topic and can't be coaxed into leaking it.
        gatekeeper = SECRET_CODE.get(
            "gatekeeper_response",
            "I am not allowed to share his personal life unless you can give me the code words.",
        )
        personal_keywords = SECRET_CODE.get("personal_keywords", [])
        if any(k.lower() in user_lower for k in personal_keywords):
            logger.info("chat path=gated")
            return ChatResponse(
                response=gatekeeper,
                suggested_questions=[
                    "What are Ayaan's best skills?",
                    "Tell me about Ayaan's projects",
                    "What's Ayaan's tech stack?",
                ],
            )

        # 3) Normal flow — lazily select signature takes for this turn so we only
        #    ship the LLM the context that's actually relevant.
        #
        #    build_system_prompt_for() in default mode may invoke the sync normalizer
        #    LLM (rare — only when fuzzy matching fails). Run it in a thread so the
        #    asyncio event loop stays free for other concurrent requests. Fast paths
        #    (fuzzy match, fallback) finish in microseconds; the thread-pool hop is
        #    negligible there and pays off when the normalizer actually fires.
        system_text, path = await asyncio.to_thread(
            build_system_prompt_for, request.message, "default"
        )
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_text),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
        ])
        response = await (prompt | _get_llm()).ainvoke({
            "history": history_msgs,
            "input": request.message,
        })

        suggested = get_suggested_questions(request.message)

        logger.info("chat path=%s", path)
        return ChatResponse(
            response=response.content,
            suggested_questions=suggested,
        )

    except Exception as e:
        # Log full details server-side, return a generic message to the client so
        # we don't leak Groq error payloads / org IDs to the browser.
        logger.exception("chat error: %s", e)
        raise HTTPException(
            status_code=500,
            detail="The assistant is temporarily unavailable. Please try again in a moment.",
        )

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
