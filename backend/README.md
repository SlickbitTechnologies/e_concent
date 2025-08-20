# E‑Consent Backend (FastAPI)

A FastAPI backend that powers the e‑consent chatbot and text‑to‑speech. It provides:
- Chat endpoints backed by Google Gemini LLM
- ElevenLabs Text‑to‑Speech (TTS)
- CORS configured for the React dev server

## Tech Stack
- FastAPI
- Uvicorn (ASGI server)
- google‑generativeai (Gemini)
- httpx (for TTS calls)
- pydantic‑settings (env config)

## Prerequisites
- Python 3.11+
- Google Gemini API key
- (Optional) ElevenLabs API key for server‑side TTS

## Setup
```bash
# From the project root
cd backend
python -m venv .venv
# Windows PowerShell
. .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```env
# Required
GEMINI_API_KEY=your_gemini_api_key
# Optional (enables server TTS)
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=9BWtsMINqrJLrRacOk9x

# Frontend origin(s), comma‑separated
CORS_ORIGINS=http://localhost:8081
```

Run the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check:
```bash
curl http://localhost:8000/api/health
```

## Configuration
File: `app/settings.py`
```python
class Settings(BaseSettings):
    cors_origins: str = "http://localhost:8081"
    gemini_api_key: str | None = None
    elevenlabs_api_key: str | None = None
    elevenlabs_voice_id: str = "9BWtsMINqrJLrRacOk9x"

    class Config:
        env_file = ".env"
```

## API Endpoints
- `GET /api/health` — Server status
- `POST /api/chat` and `POST /api/chat/text` — Chat with the assistant
  - Request body:
    ```json
    {
      "message": "Explain risks",
      "context": "trial", // or "form"
      "infoText": "Optional page content to ground the answer",
      "fields": [ { "key": "firstName", "label": "First Name", "help": "Your given name." } ]
    }
    ```
  - Response body:
    ```json
    { "reply": "...", "fieldsPatch": { "firstName": "John" } }
    ```
- `POST /functions/v1/text-to-speech` and `POST /api/text-to-speech` — ElevenLabs TTS
  - Request body:
    ```json
    { "text": "Hello there" }
    ```
  - Returns: `audio/mpeg`

## Behavior Notes
- The chat router uses Gemini for all responses. If the key is missing or Gemini fails, it falls back to minimal safe answers.
- In `context="form"`, user utterances like "fill first name as John" produce a `fieldsPatch` that the frontend applies to the form.
- Explanations for specific fields leverage provided `fields` metadata.

## Troubleshooting
- Empty/short answers: ensure `GEMINI_API_KEY` is set in `.env` and restart the server
- TTS 503/500: ensure `ELEVENLABS_API_KEY` is set; the frontend will fall back to browser TTS if missing
- CORS errors: confirm `CORS_ORIGINS` includes `http://localhost:8081`
- Dev proxy: the frontend proxies `/api` and `/functions/v1` to `http://localhost:8000`
