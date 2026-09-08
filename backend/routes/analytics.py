from fastapi import APIRouter

router = APIRouter()

@router.get("/status")
def get_analytics_status():
    """
    FastAPI endpoint exposing Phase 2 Analytics Engine status.
    """
    return {
        "status": "ready",
        "phase": "2",
        "service": "EcoPilot Analytics Engine"
    }
