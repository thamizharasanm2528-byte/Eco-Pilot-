import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, Body

from backend.rag.schemas import (
    SearchQuery,
    SearchResult,
    RAGHealthResponse,
    RAGStatsResponse,
    RAGContextResponse,
    KnowledgeDocument,
)
from backend.rag.vector_store import get_vector_index
from backend.rag.ingestion import ingest_document, ingest_seed_documents
from backend.rag.retrieval import search_knowledge
from backend.rag.context_builder import build_rag_context
from backend.rag.embeddings import get_embedding_service

logger = logging.getLogger("ecopilot.rag.router")

router = APIRouter(prefix="/api/rag", tags=["RAG Knowledge Base"])


@router.get("/health", response_model=RAGHealthResponse)
def get_rag_health():
    """Returns operational status of the RAG system components."""
    index = get_vector_index()
    embed_service = get_embedding_service()
    
    return RAGHealthResponse(
        status="healthy",
        service="EcoPilot RAG Pipeline",
        embedding_model=embed_service.model_name,
        vector_store="Local Persistent JSON Vector Index",
        documents=len(index.documents),
        chunks=len(index.chunks),
    )


@router.get("/stats", response_model=RAGStatsResponse)
def get_rag_stats():
    """Returns vector store collection stats."""
    index = get_vector_index()
    stats = index.get_stats()
    return RAGStatsResponse(**stats)


@router.get("/documents")
def list_documents():
    """Lists all metadata of ingested sustainability documents."""
    index = get_vector_index()
    docs = list(index.documents.values())
    return {
        "count": len(docs),
        "documents": docs,
    }


@router.get("/documents/{doc_id}")
def get_document(doc_id: str):
    """Retrieves document details and all associated vector chunks."""
    index = get_vector_index()
    if doc_id not in index.documents:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found.")
    
    doc = index.documents[doc_id]
    doc_chunks = [c for c in index.chunks if c.get("document_id") == doc_id]
    
    return {
        "document": doc,
        "chunks": doc_chunks,
        "chunk_count": len(doc_chunks),
    }


@router.post("/ingest")
def ingest_documents_endpoint(payload: Optional[Dict[str, Any]] = Body(None)):
    """
    Ingests document(s) or runs seed document ingestion if payload is empty.
    """
    if payload and "document" in payload:
        res = ingest_document(payload["document"])
        if res["status"] == "error":
            raise HTTPException(status_code=400, detail=res["message"])
        return res
    
    # Run seed documents ingestion
    res = ingest_seed_documents()
    return res


@router.post("/search")
def search_knowledge_endpoint(query: SearchQuery):
    """
    Executes semantic search against the sustainability knowledge base.
    Returns ranked evidence items with similarity scores.
    """
    res = search_knowledge(
        query=query.query,
        top_k=query.top_k or 5,
        category=query.category,
        topic=query.topic,
        threshold=query.threshold or 0.1,
    )
    return res


@router.post("/context", response_model=RAGContextResponse)
def build_context_endpoint(payload: Dict[str, Any] = Body(...)):
    """
    Constructs formatted RAG context given a query or list of hotspots.
    Used for evidence grounding.
    """
    query = payload.get("query", "")
    hotspots = payload.get("hotspots", [])
    top_k = payload.get("top_k", 3)
    
    context_data = build_rag_context(query=query, hotspots=hotspots, top_k=top_k)
    return RAGContextResponse(**context_data)


@router.post("/reset")
def reset_vector_index():
    """Resets and clears the vector index."""
    index = get_vector_index()
    index.clear_index()
    return {"status": "success", "message": "Vector index reset successfully."}
