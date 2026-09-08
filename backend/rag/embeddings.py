import logging
import numpy as np
from backend.rag.config import EMBEDDING_MODEL_NAME

logger = logging.getLogger("ecopilot.rag.embeddings")

class EmbeddingService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
            cls._instance._model = None
            cls._instance._use_fallback = False
            cls._instance._initialize_model()
        return cls._instance

    def _initialize_model(self):
        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading embedding model: {EMBEDDING_MODEL_NAME}")
            self._model = SentenceTransformer(EMBEDDING_MODEL_NAME)
            logger.info("SentenceTransformer model loaded successfully.")
        except Exception as e:
            logger.warning(f"SentenceTransformer load warning ({e}); utilizing Tfidf fallback vectorizer.")
            self._use_fallback = True
            from sklearn.feature_extraction.text import TfidfVectorizer
            self._tfidf = TfidfVectorizer(stop_words="english")

    @property
    def model_name(self) -> str:
        if not self._use_fallback and self._model is not None:
            return EMBEDDING_MODEL_NAME
        return "TF-IDF Vectorizer (Fallback)"


    def encode(self, texts):
        if not texts:
            return []

        if isinstance(texts, str):
            texts = [texts]

        if not self._use_fallback and self._model is not None:
            try:
                embeddings = self._model.encode(texts, normalize_embeddings=True)
                return embeddings.tolist()
            except Exception as e:
                logger.error(f"SentenceTransformer encoding error: {e}")

        # Fallback dense HashingVectorizer
        try:
            from sklearn.feature_extraction.text import HashingVectorizer
            hasher = HashingVectorizer(n_features=384, stop_words="english", alternate_sign=False)
            matrix = hasher.transform(texts).toarray()
            # Normalize vectors
            norms = np.linalg.norm(matrix, axis=1, keepdims=True)
            norms[norms == 0] = 1.0
            normalized = matrix / norms
            return normalized.tolist()
        except Exception as err:
            logger.error(f"Fallback encoding error: {err}")
            # Dummy 384-dim uniform vector fallback
            return [[1.0 / np.sqrt(384)] * 384 for _ in texts]


# Global singleton helper
def get_embedding_service():
    return EmbeddingService()
