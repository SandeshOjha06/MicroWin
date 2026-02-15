from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GEMINI_API_KEY: str  # Update this name
    DATABASE_URL: str
    DB_ENCRYPTION_KEY: str 

model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore" # Prevents errors if there are extra variables in .env
    )

settings = Settings()