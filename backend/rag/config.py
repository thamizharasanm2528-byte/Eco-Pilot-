import os

# Base paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAG_DIR = os.path.join(BASE_DIR, "backend", "rag")
INDEX_DIR = os.path.join(RAG_DIR, "index")
DOCUMENTS_DIR = os.path.join(RAG_DIR, "documents")

# Ensure directories exist
os.makedirs(INDEX_DIR, exist_ok=True)
os.makedirs(DOCUMENTS_DIR, exist_ok=True)

# Model & Chunking Configuration
EMBEDDING_MODEL_NAME = os.getenv("RAG_EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
DEFAULT_TOP_K = int(os.getenv("RAG_TOP_K", "5"))
DEFAULT_RELEVANCE_THRESHOLD = float(os.getenv("RAG_RELEVANCE_THRESHOLD", "0.15"))

CHUNK_SIZE = 600       # Target word count per chunk
CHUNK_OVERLAP = 80     # Word overlap between consecutive chunks

# File paths
VECTOR_INDEX_FILE = os.path.join(INDEX_DIR, "vector_index.json")
SEED_DOCUMENTS_FILE = os.path.join(DOCUMENTS_DIR, "seed_documents.json")
