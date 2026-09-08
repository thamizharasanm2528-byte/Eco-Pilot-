# EcoPilot Phase 4 Setup Guide — Groq AI Sustainability Intelligence

This guide documents the setup, configuration, architecture, and operation of **Phase 4** of the **EcoPilot** platform: the **Groq AI Sustainability Intelligence Layer**.

---

## 1. Overview of Phase 4

Phase 4 integrates the **Groq API** (using model `llama-3.3-70b-versatile`) as the sole LLM provider to transform campus sustainability data, Phase 2 analytics metrics, and Phase 3 RAG retrieved knowledge evidence into grounded, structured sustainability intelligence.

### Key Capabilities:
- **Evidence-Grounded AI Analysis**: Generates executive summaries, key findings with severity levels, prioritized recommendations, and step-by-step action plans.
- **Strict RAG Source Citations**: Transparently cites real standards documents from the Phase 3 vector store without hallucinating URLs or numbers.
- **Interactive Campus Q&A**: Answers custom user sustainability questions grounded in RAG evidence.
- **Firestore History**: Automatically stores AI analyses in Firestore collection `ai_analyses/{userId}`.
- **Backend Key Isolation**: `GROQ_API_KEY` is kept strictly server-side in FastAPI backend `.env` and never exposed to React clients.

---

## 2. Groq Account Setup & API Key Creation

1. Visit [https://console.groq.com](https://console.groq.com) and sign up for a free Groq account.
2. Navigate to **API Keys** in the Groq Console sidebar.
3. Click **Create API Key**.
4. Copy your generated API key (it will look like `gsk_...`).

---

## 3. Environment Configuration

### Backend Environment (`.env`)

Add your Groq API key and model selection to the project root `.env` file:

```env
# Groq AI Configuration (Backend Only)
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

> [!CAUTION]
> Never put a real API key in `.env.example` or commit `.env` to Git repository tracking.

### Reference Template (`.env.example`)

```env
# Groq AI Configuration (Backend Only - Never expose GROQ_API_KEY to frontend)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

---

## 4. Starting the Application

### Option A: Single Command Startup (Frontend + Backend)
```bash
python start.py
# OR
npm start
```

### Option B: Manual Startup

1. **Start FastAPI Backend (Port 8000)**:
   ```bash
   python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
   ```

2. **Start Vite React Frontend (Port 3000)**:
   ```bash
   npm run dev
   ```

---

## 5. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/ai/health` | Checks Groq provider configuration & health status. |
| `POST` | `/api/ai/analyze` | Generates grounded AI analysis combining campus data + analytics + RAG documents. |
| `POST` | `/api/ai/ask` | Answers specific user campus sustainability questions. |

---

## 6. RAG → Groq Architecture Flow

```
[User Campus Assessment Data]
         ↓
[Phase 2 Analytics Engine] ─── (Calculates scores & hotspots)
         ↓
[Phase 3 RAG Retriever]    ─── (Retrieves top-4 vector evidence chunks)
         ↓
[Grounded Prompt Builder]  ─── (Assembles context + strict system prompt)
         ↓
[Groq LLM API]             ─── (Generates structured JSON via Llama 3.3 70B)
         ↓
[JSON Schema Validation]   ─── (Pydantic validation)
         ↓
[React AI Intelligence UI] ─── (Displays summary, findings, action plan & citations)
```

---

## 7. Security Considerations

- **Server-Side API Keys**: `GROQ_API_KEY` is loaded strictly inside `backend/ai/config.py`.
- **Zero Secrets Exposure**: The health check endpoint (`/api/ai/health`) returns boolean configuration status without revealing any part of the API key string.
- **Anti-Prompt-Injection**: Low temperature (`0.2`) and strict system prompts enforce compliance to provided data only.

---

## 8. Troubleshooting

- **"Groq API Key Unconfigured" Banner**: Ensure `GROQ_API_KEY` in `.env` is populated with a valid key starting with `gsk_` and restart FastAPI backend.
- **Rate Limits / 429**: Groq free tier provides high rate limits (30 requests/min). If hit, wait 60 seconds before retrying.
- **Backend Service Connection Error**: Verify FastAPI is running on `http://127.0.0.1:8000`.
