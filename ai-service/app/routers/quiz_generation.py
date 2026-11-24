from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.services.gemini_service import gemini_service

router = APIRouter()


@router.post("/generate-quiz")
async def generate_quiz(payload: Dict[str, Any]):
    """
    Generates multiple-choice questions grounded in supplied learning content.
    """
    try:
        topic_name = payload.get("topic_name", "Curriculum Topic")
        topic_description = payload.get("topic_description", "")
        segment_title = payload.get("segment_title", "")
        learning_content = payload.get("learning_content", "")
        difficulty = payload.get("difficulty", "medium")
        question_count = payload.get("question_count", 5)

        if not isinstance(question_count, int) or not 1 <= question_count <= 20:
            raise HTTPException(
                status_code=400,
                detail="Question count must be between 1 and 20",
            )

        if segment_title and (
            not isinstance(learning_content, str)
            or not learning_content.strip()
        ):
            raise HTTPException(
                status_code=400,
                detail="Learning content is required for a video segment quiz",
            )

        if not isinstance(learning_content, str):
            raise HTTPException(
                status_code=400,
                detail="Learning content must be text",
            )

        quiz = await gemini_service.generate_quiz(
            topic_name=topic_name,
            topic_description=topic_description,
            segment_title=segment_title,
            learning_content=learning_content,
            difficulty=difficulty,
            question_count=question_count,
        )

        return {"success": True, "data": quiz}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Quiz generation unavailable: {str(e)}",
        )
