from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.services.gemini_service import gemini_service

router = APIRouter()

@router.post("/generate-quiz")
async def generate_quiz(payload: Dict[str, Any]):
    """
    Generates diagnostic multiple choice questions targeted to a missed topic.
    """
    try:
        topic_name = payload.get("topic_name", "Curriculum Topic")
        topic_description = payload.get("topic_description", "")
        difficulty = payload.get("difficulty", "medium")
        question_count = payload.get("question_count", 5)

        quiz = await gemini_service.generate_quiz(
            topic_name=topic_name,
            topic_description=topic_description,
            difficulty=difficulty,
            question_count=question_count
        )
        return {"success": True, "data": quiz}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
