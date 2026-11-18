from typing import List, Dict, Any
from app.services.gemini_service import gemini_service

class PlanBuilder:
    @staticmethod
    async def build(
        student_id: str,
        gaps: List[Dict[str, Any]],
        assessments: List[Dict[str, Any]],
        available_content: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Orchestrates AI recovery plan generation and links available study resources.
        """
        ai_plan = await gemini_service.generate_recovery_plan(gaps, assessments)

        # Match content library items to each recovery step
        steps = ai_plan.get("steps", [])
        content_by_topic = {}
        for item in available_content:
            tid = item.get("topic_id")
            if tid not in content_by_topic:
                content_by_topic[tid] = []
            content_by_topic[tid].append(item)

        for step in steps:
            tid = step.get("topic_id")
            step["recommended_resources"] = content_by_topic.get(tid, [])

        return {
            "student_id": student_id,
            "title": ai_plan.get("title", "ShikkhaBridge Recovery Plan"),
            "summary": ai_plan.get("summary", ""),
            "total_estimated_hours": ai_plan.get("total_estimated_hours", 0),
            "status": "pending_approval",
            "steps": steps
        }

plan_builder = PlanBuilder()
