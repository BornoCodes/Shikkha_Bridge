from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.services.plan_builder import plan_builder

router = APIRouter()

@router.post("/generate-plan")
async def generate_plan(payload: Dict[str, Any]):
    """
    Generates a sequenced recovery learning pathway for a student.
    """
    try:
        student_id = payload.get("student_id", "student-001")
        gaps = payload.get("gaps", [])
        assessments = payload.get("assessments", [])
        available_content = payload.get("available_content", [])

        plan = await plan_builder.build(
            student_id=student_id,
            gaps=gaps,
            assessments=assessments,
            available_content=available_content
        )
        return {"success": True, "data": plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
