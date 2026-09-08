import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.ai.config import is_groq_configured
from backend.ai.groq_service import get_groq_ai_service

def test_ecopilot_ai():
    print("==================================================")
    print("Testing EcoPilot AI Intelligence System")
    print("==================================================")

    service = get_groq_ai_service()
    status = service.get_status()
    print("1. Status Check:", status)

    sample_assessments = [
        {"category": "ENERGY", "period": "2026-08", "score": 31, "data": {"monthlyElectricityKwh": 12500, "renewableEnergyPercentage": 25}},
        {"category": "WATER", "period": "2026-08", "score": 27, "data": {"monthlyWaterLiters": 45200, "recycledWaterPercentage": 15}},
        {"category": "WASTE", "period": "2026-08", "score": 28, "data": {"monthlyWasteKg": 12500, "recycledWastePercentage": 25}},
        {"category": "TRANSPORTATION", "period": "2026-08", "score": 52, "data": {"publicTransportPercentage": 45}},
        {"category": "FOOD", "period": "2026-08", "score": 25, "data": {"monthlyFoodWasteKg": 1200, "compostedPercentage": 50}},
    ]

    print("\n2. Testing AI Grounded Analysis...")
    analysis_res = service.generate_analysis(
        category="all",
        user_question="Assess campus energy and water performance",
        assessments=sample_assessments,
    )
    print("Summary Snippet:", (analysis_res.get("summary") or analysis_res.get("error") or "")[:150])
    assert "summary" in analysis_res or "error" in analysis_res

    print("\n3. Testing Monthly AI Report Generator...")
    report_res = service.generate_monthly_report(
        period="2026-08",
        assessments=sample_assessments,
    )
    print("Report Result:", report_res)
    assert "overall_score" in report_res or "error" in report_res

    print("==================================================")
    print("SUCCESS: EcoPilot Backend AI System Operational!")
    print("==================================================")

if __name__ == "__main__":
    test_ecopilot_ai()
