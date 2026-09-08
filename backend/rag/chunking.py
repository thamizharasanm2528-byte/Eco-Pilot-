import re
from backend.rag.config import CHUNK_SIZE, CHUNK_OVERLAP

def normalize_text(text: str) -> str:
    """Cleans and normalizes text whitespace."""
    if not text:
        return ""
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def chunk_document(doc: dict, chunk_size: int = CHUNK_SIZE, chunk_overlap: int = CHUNK_OVERLAP) -> list:
    """
    Splits a knowledge document into overlapping text chunks with full metadata retention.
    """
    content = normalize_text(doc.get("content", ""))
    if not content:
        return []

    words = content.split(" ")
    total_words = len(words)

    # If document is shorter than target chunk size, return single chunk
    if total_words <= chunk_size:
        chunk_obj = {
            "chunk_id": f"{doc['id']}-chunk-0",
            "document_id": doc["id"],
            "chunk_index": 0,
            "text": content,
            "category": (doc.get("category") or "general").lower(),
            "topic": (doc.get("topic") or "general").lower(),
            "title": doc.get("title") or "Untitled Document",
            "source_name": doc.get("source", {}).get("name", "Unknown Source"),
            "source_url": doc.get("source", {}).get("url", "#"),
        }
        return [chunk_obj]

    chunks = []
    start = 0
    chunk_idx = 0

    while start < total_words:
        end = min(start + chunk_size, total_words)
        chunk_words = words[start:end]
        chunk_text = " ".join(chunk_words)

        chunk_obj = {
            "chunk_id": f"{doc['id']}-chunk-{chunk_idx}",
            "document_id": doc["id"],
            "chunk_index": chunk_idx,
            "text": chunk_text,
            "category": (doc.get("category") or "general").lower(),
            "topic": (doc.get("topic") or "general").lower(),
            "title": doc.get("title") or "Untitled Document",
            "source_name": doc.get("source", {}).get("name", "Unknown Source"),
            "source_url": doc.get("source", {}).get("url", "#"),
        }
        chunks.append(chunk_obj)

        chunk_idx += 1
        start += (chunk_size - chunk_overlap)

    return chunks
