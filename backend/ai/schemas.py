from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class OverallAssessmentSchema(BaseModel):
    status: str = Field(..., description="Overall campus status: good, moderate, needs_attention, or critical")
    priority: str = Field(..., description="Action priority: low, medium, high, or critical")

class KeyFindingSchema(BaseModel):
    title: str
    description: str
    severity: str = Field("medium", description="low, medium, or high")

class PriorityIssueSchema(BaseModel):
    title: str
    impact: str = Field("HIGH", description="HIGH, MEDIUM, or LOW")
    category: str
    description: str

class RecommendationSchema(BaseModel):
    title: str
    category: Optional[str] = "GENERAL"
    problem: Optional[str] = ""
    action: str
    reason: Optional[str] = ""
    priority: str = Field("HIGH", description="HIGH, MEDIUM, or LOW")
    expectedImpact: Optional[str] = "HIGH"
    estimatedImprovement: Optional[str] = "5-8 points"
    timeframe: Optional[str] = "short-term"

class ActionPlanStepSchema(BaseModel):
    step: int
    action: str
    timeframe: str = Field("0-30 days", description="e.g. 0-30 days, 30-90 days, 90-180 days")

class WeeklyActionPlanSchema(BaseModel):
    week: str = Field(..., description="e.g. Week 1, Week 2, Week 3, Week 4")
    actions: List[str] = []

class SourceCitationSchema(BaseModel):
    title: str
    url: Optional[str] = "#"
    relevance: Optional[str] = "Evidence grounding from knowledge base"

class ScoreExplanationSchema(BaseModel):
    category: str
    score: int
    reasons: List[str] = []
    improvements: List[str] = []

class AIStructuredAnalysisResponse(BaseModel):
    summary: str
    overall_assessment: OverallAssessmentSchema
    current_score: Optional[int] = 0
    potential_score: Optional[int] = 0
    potential_improvement: Optional[str] = "+0 points"
    priority_issues: List[PriorityIssueSchema] = []
    key_findings: List[KeyFindingSchema] = []
    recommendations: List[RecommendationSchema] = []
    action_plan: List[ActionPlanStepSchema] = []
    score_explanations: List[ScoreExplanationSchema] = []
    expected_impact: List[str] = []
    sources: List[SourceCitationSchema] = []
    model_used: Optional[str] = "Groq Llama 3.3 70B"

class AIAnalyzeRequest(BaseModel):
    category: Optional[str] = "all"
    campus_data: Optional[Dict[str, Any]] = None
    user_question: Optional[str] = None
    assessments: Optional[List[Dict[str, Any]]] = None

class AIAskRequest(BaseModel):
    question: str
    category: Optional[str] = "all"
    assessments: Optional[List[Dict[str, Any]]] = None

class AICategoryAnalysisRequest(BaseModel):
    category: str
    assessments: Optional[List[Dict[str, Any]]] = []

class AIMonthlyReportRequest(BaseModel):
    period: Optional[str] = None
    assessments: Optional[List[Dict[str, Any]]] = []

class AIMonthlyReportResponse(BaseModel):
    period: str
    overall_score: int
    summary: str
    top_improvements: List[str] = []
    areas_requiring_attention: List[str] = []
    recommendations: List[RecommendationSchema] = []
    action_plan_weeks: List[WeeklyActionPlanSchema] = []
    model_used: Optional[str] = "Groq Llama 3.3 70B"

class AIHealthResponse(BaseModel):
    status: str
    provider: str = "groq"
    configured: bool
    model: str
    message: str
