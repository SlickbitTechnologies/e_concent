from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .settings import settings
from .routers import chat, tts


app = FastAPI(title="E-Consent Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(tts.router, prefix="/api", tags=["tts"])      # optional duplicate
app.include_router(tts.router, prefix="/functions/v1", tags=["functions"])  # for frontend


