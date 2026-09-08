import os
from dotenv import load_dotenv

# Ensure environment variables from .env are loaded
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
DEFAULT_GROQ_MODEL = "qwen/qwen3.8-27b"
GROQ_MODEL = os.getenv("GROQ_MODEL", DEFAULT_GROQ_MODEL).strip() or DEFAULT_GROQ_MODEL

UNCONFIGURED_PLACEHOLDERS = [
    "",
    "your_groq_api_key_here",
    "your_groq_api_key",
    "xxx",
    "placeholder",
]

def is_groq_configured() -> bool:
    """Checks whether a valid non-placeholder Groq API key is present in backend configuration."""
    if not GROQ_API_KEY:
        return False
    if GROQ_API_KEY.lower() in UNCONFIGURED_PLACEHOLDERS:
        return False
    return True
