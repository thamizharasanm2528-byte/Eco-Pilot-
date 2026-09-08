from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.health import router as health_router
from backend.routes.sustainability import router as sustainability_router
from backend.routes.analytics import router as analytics_router
from backend.routes.rag import router as rag_router
from backend.routes.ai import router as ai_router
from backend.rag.ingestion import ingest_seed_documents
from backend.rag.vector_store import get_vector_index

app = FastAPI(
    title="EcoPilot API",
    description="FastAPI Backend Foundation for EcoPilot Sustainable Campus Platform",
    version="1.0.0"
)

# Configure CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register router endpoints
app.include_router(health_router, prefix="/api")
app.include_router(sustainability_router, prefix="/api/sustainability")
app.include_router(analytics_router, prefix="/api/analytics")
app.include_router(rag_router)
app.include_router(ai_router)


@app.on_event("startup")
def startup_event():
    """Auto-ingest seed documents on startup if index is empty."""
    index = get_vector_index()
    if not index.documents:
        print("[RAG] Initializing vector store with seed documents...")
        ingest_seed_documents()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

