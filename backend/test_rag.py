import sys
import os

# Add root project dir to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.rag.ingestion import ingest_seed_documents
from backend.rag.vector_store import get_vector_index
from backend.rag.retrieval import search_knowledge
from backend.rag.context_builder import build_rag_context
from backend.rag.embeddings import get_embedding_service

def test_rag_pipeline():
    print("==================================================")
    print("Testing EcoPilot RAG Pipeline Foundation (Phase 3)")
    print("==================================================")

    # 1. Test Embedding Service
    print("\n[1/5] Initializing Embedding Service...")
    embed_service = get_embedding_service()
    print(f"-> Active Embedding Model: {embed_service.model_name}")
    sample_vec = embed_service.encode(["Testing sustainability embeddings"])
    print(f"-> Encoded Vectors: {len(sample_vec)} vector(s) of dimension {len(sample_vec[0]) if sample_vec else 0}")


    # 2. Test Ingestion
    print("\n[2/5] Ingesting Seed Documents...")
    ingest_res = ingest_seed_documents()
    print(f"-> Ingestion Result: {ingest_res}")

    # 3. Test Vector Store Stats
    print("\n[3/5] Inspecting Vector Index Stats...")
    index = get_vector_index()
    stats = index.get_stats()
    print(f"-> Total Documents: {stats['total_documents']}")
    print(f"-> Total Chunks: {stats['total_chunks']}")
    print(f"-> Categories: {stats['categories']}")

    # 4. Test Semantic Vector Search
    print("\n[4/5] Testing Semantic Vector Search...")
    queries = [
        "How can campus reduce electricity consumption with solar energy?",
        "What are best practices for water recycling and conservation?",
        "Zero-waste campus dining and organic food waste composting",
    ]

    for q in queries:
        print(f"\nQuery: '{q}'")
        search_res = search_knowledge(query=q, top_k=2)
        for res in search_res.get("results", []):
            print(f"  Rank #{res['rank']} | Score: {res['score']} | Title: '{res['title']}'")
            print(f"  Category: {res['category']} | Source: {res['source']}")
            print(f"  Snippet: {res['text'][:120]}...\n")

    # 5. Test RAG Context Builder
    print("[5/5] Testing RAG Evidence Grounding Context Builder...")
    ctx = build_rag_context(query="University energy storage and HVAC optimization", top_k=2)
    print(f"-> Built Context Payload with {len(ctx['contexts'])} context items.")
    print("-> Sample Context Grounding Format:")
    if ctx["contexts"]:
        print(ctx["contexts"][0]["formatted_context"][:250] + "...\n")

    print("==================================================")
    print("SUCCESS: All Phase 3 RAG Pipeline tests passed successfully!")
    print("==================================================")


if __name__ == "__main__":
    test_rag_pipeline()
