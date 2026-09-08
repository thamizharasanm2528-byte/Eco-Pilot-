import logging
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, Body

from backend.ai.schemas import (
    AIAnalyzeRequest,
    AIAskRequest,
    AICategoryAnalysisRequest,
    AIMonthlyReportRequest,
    AIMonthlyReportResponse,
    AIHealthResponse,
)

from backend.ai.groq_service import get_groq_ai_service

logger = logging.getLogger("ecopilot.ai.router")

router = APIRouter(prefix="/api/ai", tags=["AI Sustainability Intelligence (Groq)"])

@router.get("/health", response_model=AIHealthResponse)
def get_ai_health():
    """Returns AI service provider operational status and configuration check."""
    service = get_groq_ai_service()
    status_info = service.get_status()
    return AIHealthResponse(**status_info)

@router.post("/analyze")
def analyze_sustainability_endpoint(payload: AIAnalyzeRequest):
    """
    Generates grounded AI sustainability analysis using Groq LLM + Phase 3 RAG evidence.
    """
    service = get_groq_ai_service()
    
    result = service.generate_analysis(
        category=payload.category or "all",
        campus_data=payload.campus_data,
        user_question=payload.user_question,
        assessments=payload.assessments,
    )
    
    if "error" in result:
        raise HTTPException(status_code=400 if not result.get("configured", True) else 503, detail=result["error"])
        
    return result

@router.post("/category-analysis")
def category_analysis_endpoint(payload: AICategoryAnalysisRequest):
    """
    Generates category-specific AI analysis (ENERGY, WATER, WASTE, TRANSPORTATION, FOOD).
    """
    service = get_groq_ai_service()
    
    result = service.generate_analysis(
        category=payload.category,
        user_question=f"Provide in-depth AI analysis for category {payload.category}",
        assessments=payload.assessments,
    )
    
    if "error" in result:
        raise HTTPException(status_code=400 if not result.get("configured", True) else 503, detail=result["error"])
        
    return result

@router.post("/monthly-report", response_model=AIMonthlyReportResponse)
def monthly_report_endpoint(payload: AIMonthlyReportRequest):
    """
    Generates structured Monthly AI Sustainability Report for a campus.
    """
    service = get_groq_ai_service()
    
    result = service.generate_monthly_report(
        period=payload.period,
        assessments=payload.assessments,
    )
    
    if "error" in result:
        raise HTTPException(status_code=503, detail=result["error"])
        
    return result

@router.post("/ask")
def ask_ai_question_endpoint(payload: AIAskRequest):
    """
    Answers specific campus sustainability questions using RAG retrieval + Groq LLM.
    """
    if not payload.question or not payload.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    service = get_groq_ai_service()
    
    result = service.generate_analysis(
        category=payload.category or "all",
        user_question=payload.question.strip(),
        assessments=payload.assessments,
    )
    
    if "error" in result:
        raise HTTPException(status_code=400 if not result.get("configured", True) else 503, detail=result["error"])
        
    return result
