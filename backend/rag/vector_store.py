import os
import json
import logging
import hashlib
import numpy as np
from backend.rag.config import VECTOR_INDEX_FILE, DEFAULT_RELEVANCE_THRESHOLD
from backend.rag.embeddings import get_embedding_service

logger = logging.getLogger("ecopilot.rag.vector_store")

class VectorIndex:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VectorIndex, cls).__new__(cls)
            cls._instance.documents = {}   # doc_id -> doc metadata
            cls._instance.chunks = []      # list of chunk dicts with embedding vectors
            cls._instance.last_updated = "Never"
            cls._instance.load_index()
        return cls._instance

    def save_index(self):
        """Persists the vector index metadata and embeddings to disk."""
        data = {
            "last_updated": self.last_updated,
            "documents": self.documents,
            "chunks": self.chunks,
        }
        try:
            with open(VECTOR_INDEX_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
            logger.info(f"Vector index saved to {VECTOR_INDEX_FILE} ({len(self.chunks)} chunks).")
        except Exception as e:
            logger.error(f"Error saving vector index: {e}")

    def load_index(self):
        """Loads the vector index from disk if present."""
        if not os.path.exists(VECTOR_INDEX_FILE):
            logger.info("No existing vector index file found. Initializing empty vector store.")
            self.documents = {}
            self.chunks = []
            return

        try:
            with open(VECTOR_INDEX_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
            self.documents = data.get("documents", {})
            self.chunks = data.get("chunks", [])
            self.last_updated = data.get("last_updated", "Loaded from disk")
            logger.info(f"Vector index loaded from disk ({len(self.documents)} docs, {len(self.chunks)} chunks).")
        except Exception as e:
            logger.error(f"Error loading vector index: {e}")
            self.documents = {}
            self.chunks = []

    def is_duplicate(self, doc_id: str, content: str) -> bool:
        """Checks if a document or identical content hash already exists in the vector store."""
        if doc_id in self.documents:
            return True
        content_hash = hashlib.md5(content.encode("utf-8")).hexdigest()
        for doc in self.documents.values():
            if doc.get("content_hash") == content_hash:
                return True
        return False

    def add_document(self, doc: dict, chunks: list):
        """Adds document metadata and encoded chunks to vector index."""
        doc_id = doc["id"]
        content_hash = hashlib.md5(doc.get("content", "").encode("utf-8")).hexdigest()

        # Save document metadata
        self.documents[doc_id] = {
            "id": doc_id,
            "title": doc.get("title", ""),
            "category": (doc.get("category") or "general").lower(),
            "topic": (doc.get("topic") or "general").lower(),
            "source": doc.get("source", {}),
            "content_hash": content_hash,
            "chunk_count": len(chunks),
        }

        # Encode chunks
        texts = [c["text"] for c in chunks]
        embed_service = get_embedding_service()
        embeddings = embed_service.encode(texts)

        for c, vec in zip(chunks, embeddings):
            c["vector"] = vec
            self.chunks.append(c)

        import datetime
        self.last_updated = datetime.datetime.utcnow().isoformat()
        self.save_index()

    def search_index(self, query: str, top_k: int = 5, category: str = None, topic: str = None, threshold: float = DEFAULT_RELEVANCE_THRESHOLD) -> list:
        """
        Executes cosine similarity search over chunk vectors with optional metadata filtering.
        """
        if not self.chunks or not query:
            return []

        embed_service = get_embedding_service()
        query_vec = np.array(embed_service.encode([query])[0])
        query_norm = np.linalg.norm(query_vec)
        if query_norm > 0:
            query_vec = query_vec / query_norm

        filtered_chunks = []
        for c in self.chunks:
            if category and (c.get("category") or "").lower() != category.lower():
                continue
            if topic and (c.get("topic") or "").lower() != topic.lower():
                continue
            filtered_chunks.append(c)

        if not filtered_chunks:
            return []

        # Calculate cosine similarities
        chunk_vecs = np.array([c["vector"] for c in filtered_chunks])
        chunk_norms = np.linalg.norm(chunk_vecs, axis=1, keepdims=True)
        chunk_norms[chunk_norms == 0] = 1.0
        normalized_chunk_vecs = chunk_vecs / chunk_norms

        similarities = np.dot(normalized_chunk_vecs, query_vec)

        # Rank results
        ranked_indices = np.argsort(similarities)[::-1]

        results = []
        rank = 1
        for idx in ranked_indices:
            score = float(similarities[idx])
            if score < threshold and len(results) > 0:
                continue

            c = filtered_chunks[idx]
            results.append({
                "rank": rank,
                "score": round(score, 4),
                "title": c.get("title", "Untitled"),
                "text": c.get("text", ""),
                "category": c.get("category", "general"),
                "topic": c.get("topic", "general"),
                "source": c.get("source_name", "Unknown Source"),
                "url": c.get("source_url", "#"),
                "document_id": c.get("document_id", ""),
                "chunk_id": c.get("chunk_id", ""),
            })
            rank += 1
            if len(results) >= top_k:
                break

        return results

    def clear_index(self):
        """Clears all stored documents and chunks from the vector index."""
        self.documents = {}
        self.chunks = []
        import datetime
        self.last_updated = datetime.datetime.utcnow().isoformat()
        self.save_index()

    def get_stats(self) -> dict:
        """Returns statistics about the vector store index."""
        categories = sorted(list(set([doc.get("category", "general") for doc in self.documents.values()])))
        embed_service = get_embedding_service()
        return {
            "total_documents": len(self.documents),
            "total_chunks": len(self.chunks),
            "categories": categories,
            "embedding_model": embed_service.model_name,
            "vector_store": "Local Persistent JSON Vector Index",
            "last_updated": self.last_updated,
        }

def get_vector_index():
    return VectorIndex()

