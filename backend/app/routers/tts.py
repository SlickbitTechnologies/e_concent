from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
import httpx

from ..settings import settings


class TTSRequest(BaseModel):
    text: str


router = APIRouter()


@router.post("/text-to-speech")
async def text_to_speech(req: TTSRequest):
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="Text is required")
    if not settings.elevenlabs_api_key:
        raise HTTPException(status_code=503, detail="TTS not configured")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{settings.elevenlabs_voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": settings.elevenlabs_api_key,
    }
    body = {
        "text": req.text,
        "model_id": "eleven_turbo_v2",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.5},
    }

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(url, headers=headers, json=body)
        if resp.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to generate audio")
        return Response(content=resp.content, media_type="audio/mpeg")


