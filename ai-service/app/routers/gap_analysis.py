from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.services.gap_analyzer import gap_analyzer

router = APIRouter()

@router.post("/analyze-gaps")
async def analyze_gaps(payload: Dict[str, Any]):
    """
    Accepts student absence records and curriculum syllabus topics,
    returns calculated learning gaps with priority scores.
    """
    try:
        absences = payload.get("absences", [])
        syllabus = payload.get("syllabus", [])
        result = gap_analyzer.analyze(absences, syllabus)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
