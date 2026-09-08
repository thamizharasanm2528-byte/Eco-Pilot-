import logging
from backend.rag.chunking import chunk_document
from backend.rag.vector_store import get_vector_index

logger = logging.getLogger("ecopilot.rag.ingestion")

def validate_document(doc: dict) -> tuple:
    """Validates document structure and required fields."""
    if not isinstance(doc, dict):
        return False, "Document must be a JSON object."

    required = ["id", "title", "category", "topic", "content", "source"]
    for req in required:
        if req not in doc or not doc[req]:
            return False, f"Missing required document field: '{req}'."

    source = doc.get("source")
    if not isinstance(source, dict) or not source.get("name") or not source.get("url"):
        return False, "Document source must be an object with 'name' and 'url'."

    content = str(doc.get("content", "")).strip()
    if len(content) < 50:
        return False, "Document content is too short (minimum 50 characters required)."

    return True, "Valid"

def ingest_document(doc: dict) -> dict:
    """
    Ingests a knowledge document into the vector store pipeline:
    Validate -> Clean -> Chunk -> Embed -> Index -> Save.
    """
    valid, msg = validate_document(doc)
    if not valid:
        logger.warning(f"Document validation failed: {msg}")
        return {"status": "error", "message": msg, "document_id": doc.get("id")}

    index = get_vector_index()
    if index.is_duplicate(doc["id"], doc["content"]):
        return {
            "status": "duplicate",
            "message": f"Document ID '{doc['id']}' or identical content already exists.",
            "document_id": doc["id"],
        }

    chunks = chunk_document(doc)
    if not chunks:
        return {"status": "error", "message": "Failed to generate text chunks.", "document_id": doc["id"]}

    index.add_document(doc, chunks)

    logger.info(f"Ingested document '{doc['id']}' ({len(chunks)} chunks).")
    return {
        "status": "success",
        "message": f"Successfully ingested document '{doc['id']}' into vector store.",
        "document_id": doc["id"],
        "chunks_created": len(chunks),
    }

def ingest_seed_documents(seed_file_path: str = None) -> dict:
    """Ingests all documents from the seed documents JSON file."""
    import os
    import json
    from backend.rag.config import SEED_DOCUMENTS_FILE

    target_path = seed_file_path or SEED_DOCUMENTS_FILE
    if not os.path.exists(target_path):
        return {"status": "error", "message": f"Seed documents file not found at {target_path}."}

    try:
        with open(target_path, "r", encoding="utf-8") as f:
            docs = json.load(f)

        if not isinstance(docs, list):
            return {"status": "error", "message": "Seed document file must contain a JSON list."}

        ingested = 0
        skipped = 0
        errors = 0

        for d in docs:
            res = ingest_document(d)
            if res["status"] == "success":
                ingested += 1
            elif res["status"] == "duplicate":
                skipped += 1
            else:
                errors += 1

        return {
            "status": "success",
            "message": f"Seed ingestion complete: {ingested} ingested, {skipped} skipped, {errors} errors.",
            "ingested_count": ingested,
            "skipped_count": skipped,
            "error_count": errors,
        }
    except Exception as e:
        logger.error(f"Error during seed document ingestion: {e}")
        return {"status": "error", "message": str(e)}
