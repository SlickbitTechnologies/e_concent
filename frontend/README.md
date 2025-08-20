# E‑Consent Frontend (React + Vite)

A patient-facing React application for clinical trial e‑consent. It includes trial info pages, an interactive consent form, and an AI chatbot that explains content and assists with conversational form filling.

## Tech Stack
- React 18 + Vite
- Tailwind CSS + shadcn/ui
- React Router DOM
- TanStack React Query
- Lucide React icons

## Prerequisites
- Node.js 18+ and npm
- Backend running at http://localhost:8000 (see backend/README.md)

## Quick Start
```bash
# From the project root
cd frontend
npm install
npm run dev
# Open http://localhost:8081
```

### Build & Preview
```bash
npm run build
npm run preview
# Open the printed URL
```

## Dev Server Proxy
The dev server proxies API calls to the backend.

File: `frontend/vite.config.ts`
```ts
export default defineConfig({
  server: {
    host: "::",
    port: 8081,
    proxy: {
      "/api": "http://localhost:8000",
      "/functions/v1": "http://localhost:8000",
    },
  },
  // ...
});
```
Make sure the backend is listening on port 8000.

## App Structure
- `src/pages/TrialInfo.jsx`: Trial information page with the AI assistant
- `src/pages/ConsentForm.jsx`: Consent form with chatbot-driven explanations and auto-fill
- `src/pages/Auth.jsx`: Login/Register (stubbed for now)
- `src/components/Chatbot.jsx`: Chat UI and voice in/out, integrates with backend
- `src/components/ui/*`: Reusable UI components

## Chatbot Integration
The chatbot talks to the backend for all responses and TTS.

- Send messages to: `POST /api/chat/text`
- Text-to-speech: `POST /functions/v1/text-to-speech`

Example request payload sent by the chatbot:
```json
{
  "message": "Explain risks",
  "context": "trial", // or "form"
  "infoText": "Optional page content to ground the answer",
  "fields": [
    { "key": "firstName", "label": "First Name", "help": "Your given name." }
  ]
}
```

When the backend returns `fieldsPatch`, the form is auto‑updated:
```json
{
  "reply": "Updated fields: firstName",
  "fieldsPatch": { "firstName": "John" }
}
```

## Troubleshooting
- Chatbot not responding: ensure the backend is running and reachable at `http://localhost:8000`
- 404 on `/api/chat/text`: make sure backend exposes that path (see backend README)
- TTS 503/500: missing or invalid ElevenLabs API key; the UI will fall back to browser SpeechSynthesis
- CORS errors: confirm `CORS_ORIGINS` in backend `.env` includes `http://localhost:8081`
