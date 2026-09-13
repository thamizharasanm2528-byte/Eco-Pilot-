const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.PROD ? "" : "http://localhost:8000");

/**
 * Fetch wrapper for AI endpoints
 */
const fetchAI = async (endpoint, options = {}) => {
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
    console.warn(`AI API request to ${endpoint} failed:`, error.message);
    throw error;
  }
};

/**
 * Check AI service provider status and configuration check
 */
export const getAIHealth = async () => {
  return await fetchAI("/api/ai/health");
};

/**
 * Execute grounded AI sustainability analysis
 */
export const generateAIAnalysis = async ({
  category = "all",
  campus_data = null,
  user_question = null,
  assessments = null,
}) => {
  return await fetchAI("/api/ai/analyze", {
    method: "POST",
    body: JSON.stringify({
      category,
      campus_data,
      user_question,
      assessments,
    }),
  });
};

/**
 * Get category-specific AI analysis (ENERGY, WATER, WASTE, TRANSPORTATION, FOOD)
 */
export const getCategoryAIAnalysis = async ({ category, assessments = null }) => {
  return await fetchAI("/api/ai/category-analysis", {
    method: "POST",
    body: JSON.stringify({
      category,
      assessments,
    }),
  });
};

/**
 * Generate Monthly AI Sustainability Report
 */
export const generateAIMonthlyReport = async ({ period = null, assessments = null }) => {
  return await fetchAI("/api/ai/monthly-report", {
    method: "POST",
    body: JSON.stringify({
      period,
      assessments,
    }),
  });
};

/**
 * Ask a specific question (Legacy compatibility)
 */
export const askAIQuestion = async ({ question, category = "all", assessments = null }) => {
  return await fetchAI("/api/ai/ask", {
    method: "POST",
    body: JSON.stringify({
      question,
      category,
      assessments,
    }),
  });
};
