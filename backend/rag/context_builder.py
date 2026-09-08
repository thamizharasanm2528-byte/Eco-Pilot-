from backend.rag.retrieval import search_knowledge

def build_rag_context(query: str = None, results: list = None, hotspots: list = None, top_k: int = 3) -> dict:
    """
    Formats semantic search results into clean, structured evidence contexts
    ready for future Phase 4 IBM Granite prompt injection.
    """
    if results is None:
        if query:
            search_res = search_knowledge(query=query, top_k=top_k)
            results = search_res.get("results", [])
        elif hotspots and isinstance(hotspots, list):
            hotspot_queries = [f"{h.get('category', '')} {h.get('reason', '')}" for h in hotspots]
            combined_query = " ".join(hotspot_queries)
            search_res = search_knowledge(query=combined_query, top_k=top_k)
            results = search_res.get("results", [])
        else:
            results = []

    if not results or not isinstance(results, list):
        return {
            "query": query or "N/A",
            "formatted_context": "NO RELEVANT KNOWLEDGE SOURCES FOUND.",
            "sources_count": 0,
            "contexts": [],
        }

    formatted_blocks = []
    contexts = []

    for idx, item in enumerate(results, start=1):
        block = (
            f"SOURCE {idx}:\n"
            f"Title: {item.get('title', 'N/A')}\n"
            f"Organization: {item.get('source', 'Unknown Source')}\n"
            f"URL: {item.get('url', '#')}\n"
            f"Category: {item.get('category', 'general')}\n\n"
            f"Content:\n{item.get('text', '')}\n"
        )
        formatted_blocks.append(block)

        contexts.append({
            "rank": idx,
            "title": item.get("title"),
            "source": item.get("source"),
            "url": item.get("url"),
            "category": item.get("category"),
            "text": item.get("text"),
            "score": item.get("score"),
            "formatted_context": block,
        })

    return {
        "query": query or "N/A",
        "formatted_context": "\n========================================\n".join(formatted_blocks),
        "sources_count": len(contexts),
        "contexts": contexts,
    }

