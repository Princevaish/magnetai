# AI Lead Magnet Builder

An AI-powered SaaS tool that generates high-converting marketing lead magnets using LLaMA3 via the Groq API.

---

## Project Structure

```
leadmagnet-ai/
├── backend/
│   ├── app/
│   │   ├── main.py         # FastAPI app init & CORS
│   │   ├── routes.py       # API endpoints
│   │   ├── ai_service.py   # Groq API + prompt logic
│   │   ├── schemas.py      # Pydantic request/response models
│   │   └── config.py       # Environment variable loading
│   ├── requirements.txt
│   └── start.sh            # Render deployment startup script
├── frontend/               # (coming soon)
├── .env.example
└── README.md
```

---

## Backend Setup (Windows PowerShell)

### 1. Install uv
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 2. Navigate to backend directory
```powershell
cd leadmagnet-ai/backend
```

### 3. Create virtual environment
```powershell
uv venv
```

### 4. Activate virtual environment
```powershell
.venv\Scripts\Activate.ps1
```

### 5. Install dependencies
```powershell
uv pip install -r requirements.txt
```

### 6. Set up environment variables
```powershell
Copy-Item ..\.env.example ..\.env
# Then edit .env and add your GROQ_API_KEY
notepad ..\.env
```

### 7. Run the FastAPI server
```powershell
uvicorn app.main:app --reload --port 8000
```

---

## API Endpoints

### `GET /health`
Returns server status.

**Response:**
```json
{ "status": "ok" }
```

---

### `POST /generate`
Generates a complete lead magnet package.

**Request body:**
```json
{
  "business": "Online fitness coaching for busy professionals",
  "industry": "Health & Wellness",
  "audience": "Working professionals aged 25-45",
  "goal": "Collect email leads",
  "tone": "Motivational and professional"
}
```

**Response:**
```json
{
  "lead_magnet": "...",
  "headline": "...",
  "description": "...",
  "cta": "...",
  "email_template": "...",
  "content_outline": "..."
}
```

---

## Deployment

### Backend → Render
- **Build command:** `pip install -r requirements.txt`
- **Start command:** `bash start.sh`
- **Environment variable:** Add `GROQ_API_KEY` in Render's dashboard

### Frontend → Vercel
_(Frontend setup coming in next phase)_

---

## Tech Stack
- **Backend:** Python, FastAPI, Uvicorn
- **AI:** Groq API (LLaMA3-70b-8192)
- **Config:** python-dotenv
- **Validation:** Pydantic v2
- **Package manager:** uv