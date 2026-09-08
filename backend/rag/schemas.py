from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SourceMetadata(BaseModel):
    name: str
    url: str
    publicationDate: Optional[str] = "N/A"
    accessedDate: Optional[str] = "2026-08-08"

class KnowledgeDocument(BaseModel):
    id: str
    title: str
    category: str
    topic: str
    content: str
    source: SourceMetadata
    tags: Optional[List[str]] = []

class DocumentChunk(BaseModel):
    chunk_id: str
    document_id: str
    chunk_index: int
    text: str
    category: str
    topic: str
    title: str
    source_name: str
    source_url: str

class SearchQuery(BaseModel):
    query: str
    top_k: Optional[int] = 5
    category: Optional[str] = None
    topic: Optional[str] = None
    threshold: Optional[float] = 0.15

class SearchResult(BaseModel):
    rank: int
    score: float
    title: str
    text: str
    category: str
    topic: str
    source: str
    url: str
    document_id: str
    chunk_id: str

class RAGHealthResponse(BaseModel):
    status: str
    service: str
    embedding_model: str
    vector_store: str
    documents: int
    chunks: int

class RAGStatsResponse(BaseModel):
    total_documents: int
    total_chunks: int
    categories: List[str]
    embedding_model: str
    vector_store: str
    last_updated: str

class RAGContextResponse(BaseModel):
    query: str
    contexts: List[Dict[str, Any]]
