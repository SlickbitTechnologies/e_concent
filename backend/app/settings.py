from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    cors_origins: str = "http://localhost:8081"
    gemini_api_key: str | None = None
    elevenlabs_api_key: str | None = None
    elevenlabs_voice_id: str = "9BWtsMINqrJLrRacOk9x"

    class Config:
        env_file = ".env"


settings = Settings()

