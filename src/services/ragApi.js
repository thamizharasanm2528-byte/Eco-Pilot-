const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.PROD ? "" : "http://localhost:8000");

/**
 * Fetch helper with fallback and detailed error reporting
 */
const fetchRAG = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `HTTP Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`RAG API request to ${endpoint} failed:`, error.message);
    throw error;
  }
};

/**
 * Health check endpoint for RAG system
 */
export const getRAGHealth = async () => {
  return await fetchRAG("/api/rag/health");
};

/**
 * Stats endpoint for RAG knowledge base
 */
export const getRAGStats = async () => {
  return await fetchRAG("/api/rag/stats");
};

/**
 * List all ingested knowledge base documents
 */
export const getKnowledgeDocuments = async () => {
  return await fetchRAG("/api/rag/documents");
};

/**
 * Get details and chunks for a single document
 */
export const getKnowledgeDocumentDetails = async (docId) => {
  return await fetchRAG(`/api/rag/documents/${encodeURIComponent(docId)}`);
};

/**
 * Search the knowledge base using semantic vector retrieval
 * @param {Object} params - { query, top_k, category, topic, threshold }
 */
export const searchKnowledge = async ({
  query,
  top_k = 5,
  category = null,
  topic = null,
  threshold = 0.1,
}) => {
  return await fetchRAG("/api/rag/search", {
    method: "POST",
    body: JSON.stringify({
      query,
      top_k,
      category,
      topic,
      threshold,
    }),
  });
};

/**
 * Build RAG context block for grounding
 * @param {Object} params - { query, hotspots, top_k }
 */
export const buildRAGContext = async ({ query = "", hotspots = [], top_k = 3 }) => {
  return await fetchRAG("/api/rag/context", {
    method: "POST",
    body: JSON.stringify({
      query,
      hotspots,
      top_k,
    }),
  });
};

/**
 * Trigger seed document ingestion or single document ingestion
 */
export const triggerIngestion = async (docData = null) => {
  const options = { method: "POST" };
  if (docData) {
    options.body = JSON.stringify({ document: docData });
  }
  return await fetchRAG("/api/rag/ingest", options);
};

/**
 * Reset vector index
 */
export const resetVectorIndex = async () => {
  return await fetchRAG("/api/rag/reset", { method: "POST" });
};
