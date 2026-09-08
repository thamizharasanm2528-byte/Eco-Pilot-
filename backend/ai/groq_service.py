import json
import logging
from typing import Dict, Any, Optional, List

from backend.ai.config import GROQ_API_KEY, GROQ_MODEL, is_groq_configured
from backend.ai.schemas import (
    AIStructuredAnalysisResponse,
    AIMonthlyReportResponse,
)
from backend.ai.prompts import (
    SYSTEM_SUSTAINABILITY_PROMPT,
    SYSTEM_MONTHLY_REPORT_PROMPT,
    build_user_analysis_prompt,
)
from backend.rag.context_builder import build_rag_context

logger = logging.getLogger("ecopilot.ai.groq_service")

class GroqAIService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GroqAIService, cls).__new__(cls)
            cls._instance.client = None
            cls._instance._init_client()
        return cls._instance

    def _init_client(self):
        if is_groq_configured():
            try:
                from groq import Groq
                self.client = Groq(api_key=GROQ_API_KEY)
                logger.info(f"Groq AI Client initialized with model '{GROQ_MODEL}'.")
            except Exception as e:
                logger.error(f"Failed to initialize Groq client: {e}")
                self.client = None
        else:
            logger.warning("Groq API key not configured or contains placeholder.")
            self.client = None

    def get_status(self) -> Dict[str, Any]:
        """Returns AI service health and provider configuration state."""
        configured = is_groq_configured()
        return {
            "status": "ok" if configured else "unconfigured",
            "provider": "groq",
            "configured": configured,
            "model": GROQ_MODEL,
            "message": "Groq LLM provider is active." if configured else "GROQ_API_KEY is missing or invalid in backend .env.",
        }

    def generate_analysis(
        self,
        category: str = "all",
        campus_data: Optional[Dict[str, Any]] = None,
        analytics_summary: Optional[Dict[str, Any]] = None,
        user_question: Optional[str] = None,
        assessments: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """
        Executes grounded AI analysis combining campus data + Phase 3 RAG context via Groq LLM.
        """
        if not is_groq_configured() or not self.client:
            return {
                "error": "AI service is unconfigured. Please add a valid GROQ_API_KEY in backend environment.",
                "configured": False,
            }

        rag_query = user_question or f"Campus sustainability standards for {category} management and efficiency"
        rag_context = build_rag_context(query=rag_query, top_k=4)

        user_prompt = build_user_analysis_prompt(
            category=category,
            campus_data=campus_data,
            analytics_summary=analytics_summary,
            rag_context=rag_context,
            user_question=user_question,
            assessments=assessments,
        )

        try:
            logger.info(f"Sending grounded request to Groq model '{GROQ_MODEL}'...")
            completion = self.client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_SUSTAINABILITY_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.2,
                max_tokens=950,
            )

            raw_text = completion.choices[0].message.content
            parsed_data = json.loads(raw_text)

            rag_sources = []
            for ctx in rag_context.get("contexts", []):
                rag_sources.append({
                    "title": ctx.get("title", "Sustainability Standard"),
                    "url": ctx.get("url", "#"),
                    "relevance": f"Evidence retrieved from {ctx.get('source', 'RAG Knowledge Base')}",
                })

            if not parsed_data.get("sources") or len(parsed_data.get("sources", [])) == 0:
                parsed_data["sources"] = rag_sources
            else:
                existing_titles = set(s.get("title") for s in parsed_data["sources"])
                for rs in rag_sources:
                    if rs["title"] not in existing_titles:
                        parsed_data["sources"].append(rs)

            parsed_data["model_used"] = f"Groq {GROQ_MODEL}"

            # Calculate score defaults if not returned by model
            if assessments and len(assessments) > 0:
                scores = [a.get("score") for a in assessments if a.get("score") is not None]
                if scores:
                    avg_score = int(sum(scores) / len(scores))
                    parsed_data["current_score"] = parsed_data.get("current_score") or avg_score
                    parsed_data["potential_score"] = parsed_data.get("potential_score") or min(100, avg_score + 10)
                    parsed_data["potential_improvement"] = parsed_data.get("potential_improvement") or f"+{parsed_data['potential_score'] - parsed_data['current_score']} points"

            validated = AIStructuredAnalysisResponse(**parsed_data)
            return validated.dict()

        except json.JSONDecodeError as err:
            logger.error(f"Failed to parse Groq response JSON: {err}")
            return {
                "error": "Failed to parse structured response from Groq AI model.",
                "details": str(err),
            }
        except Exception as err:
            logger.error(f"Error calling Groq API: {err}")
            return {
                "error": "AI analysis service is temporarily unavailable. Please verify your Groq API key or try again later.",
                "details": str(err),
            }

    def generate_monthly_report(
        self,
        period: Optional[str] = None,
        assessments: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """
        Generates a comprehensive Monthly AI Sustainability Report.
        """
        if not is_groq_configured() or not self.client:
            return {
                "error": "AI service is unconfigured. Please add a valid GROQ_API_KEY in backend environment.",
                "configured": False,
            }

        safe_period = period or "Latest Period"
        user_prompt = build_user_analysis_prompt(
            category="all",
            user_question=f"Generate a comprehensive Monthly AI Sustainability Report for period {safe_period}",
            assessments=assessments,
        )

        try:
            completion = self.client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_MONTHLY_REPORT_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.2,
                max_tokens=900,
            )

            raw_text = completion.choices[0].message.content
            parsed = json.loads(raw_text)
            parsed["period"] = parsed.get("period") or safe_period
            parsed["model_used"] = f"Groq {GROQ_MODEL}"

            if assessments and len(assessments) > 0:
                scores = [a.get("score") for a in assessments if a.get("score") is not None]
                if scores:
                    parsed["overall_score"] = int(sum(scores) / len(scores))

            validated = AIMonthlyReportResponse(**parsed)
            return validated.dict()

        except Exception as err:
            logger.error(f"Error generating Monthly Report: {err}")
            return {
                "error": "Unable to generate monthly report. Please check server logs.",
                "details": str(err),
            }

def get_groq_ai_service():
    return GroqAIService()
