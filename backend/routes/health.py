from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def get_health():
    """
    Health check endpoint for EcoPilot FastAPI service.
    """
    return {
        "status": "ok",
        "service": "EcoPilot API"
    }
