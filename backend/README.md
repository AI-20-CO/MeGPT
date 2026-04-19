# Portfolio Chat Backend

AI-powered chat assistant for the portfolio using FastAPI + LangChain + Groq.

## Quick Start

### 1. Get Groq API Key (Free)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (free)
3. Go to API Keys → Create new key
4. Copy the key

### 2. Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

### 3. Run

```bash
# Development
uvicorn main:app --reload --port 8000

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 4. Test

Visit http://localhost:8000/docs for interactive API documentation.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send a message and get AI response |
| GET | `/api/health` | Health check |
| GET | `/api/suggestions` | Get starter questions |

## Customization

Edit `knowledge.yaml` to update:
- Personal information
- Skills and projects
- Experience
- Hobbies
- AI behavior rules and guardrails

## Deployment Options

### Render (Free)
1. Push to GitHub
2. Connect to Render
3. Add GROQ_API_KEY as environment variable

### Railway (Free tier available)
1. `railway init`
2. `railway up`
3. Add environment variables

### Vercel Serverless (with adapter)
Convert to serverless function for Vercel deployment.
