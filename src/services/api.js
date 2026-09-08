const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Helper fetch wrapper with user-friendly error handling
 */
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`API request to ${endpoint} failed:`, error.message);
    throw new Error("Unable to connect to EcoPilot backend service. Please check connection.");
  }
};

/**
 * Health check endpoint: GET /api/health
 */
export const checkBackendHealth = async () => {
  return await fetchAPI("/api/health");
};

/**
 * Sustainability status endpoint: GET /api/sustainability/status
 */
export const getSustainabilityStatus = async () => {
  return await fetchAPI("/api/sustainability/status");
};
