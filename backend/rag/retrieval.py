import logging
from backend.rag.vector_store import get_vector_index
from backend.rag.config import DEFAULT_TOP_K, DEFAULT_RELEVANCE_THRESHOLD

logger = logging.getLogger("ecopilot.rag.retrieval")

def search_knowledge(
    query: str,
    top_k: int = DEFAULT_TOP_K,
    category: str = None,
    topic: str = None,
    threshold: float = DEFAULT_RELEVANCE_THRESHOLD,
) -> dict:
    """
    Performs semantic search over the vector index and returns ranked evidence.
    """
    if not query or not query.strip():
        return {
            "query": "",
            "results": [],
            "message": "Query string cannot be empty.",
        }

    # Bound top_k between 1 and 10
    safe_top_k = max(1, min(int(top_k or 5), 10))

    index = get_vector_index()
    results = index.search_index(
        query=query.strip(),
        top_k=safe_top_k,
        category=category,
        topic=topic,
        threshold=threshold,
    )

    if not results:
        return {
            "query": query,
            "results": [],
            "message": "No sufficiently relevant sustainability knowledge was found.",
        }

    return {
        "query": query,
        "results": results,
        "result_count": len(results),
    }
