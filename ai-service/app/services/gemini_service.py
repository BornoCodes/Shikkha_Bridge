import os
import json
import logging
from typing import Dict, Any, Optional
import google.generativeai as genai
from app.utils.prompts import QUIZ_GENERATION_PROMPT, RECOVERY_PLAN_PROMPT

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.client_available = False
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel("gemini-1.5-flash")
                self.client_available = True
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini Client: {e}")

    async def generate_quiz(self, topic_name: str, topic_description: str, difficulty: str = "medium", question_count: int = 5) -> Dict[str, Any]:
        prompt = QUIZ_GENERATION_PROMPT.format(
            topic_name=topic_name,
            topic_description=topic_description or topic_name,
            difficulty=difficulty,
            question_count=question_count
        )

        if self.client_available:
            try:
                response = self.model.generate_content(prompt)
                clean_text = response.text.strip().replace("```json", "").replace("```", "").strip()
                return json.loads(clean_text)
            except Exception as e:
                logger.error(f"Gemini API call failed, falling back to mock: {e}")

        # Deterministic intelligent fallback when API key is not yet set
        return {
            "topic_name": topic_name,
            "difficulty": difficulty,
            "questions": [
                {
                    "id": i + 1,
                    "question": f"Key concept diagnostic {i+1} regarding {topic_name}: What is the primary foundational rule?",
                    "options": [
                        f"Fundamental principle A of {topic_name}",
                        f"Alternate hypothesis B regarding {topic_name}",
                        f"Empirical variation C in practice",
                        f"Contradictory state D"
                    ],
                    "correct_answer": f"Fundamental principle A of {topic_name}",
                    "explanation": f"Core definition and prerequisite knowledge of {topic_name}.",
                    "difficulty": difficulty
                }
                for i in range(question_count)
            ]
        }

    async def generate_recovery_plan(self, gaps_data: Any, assessment_data: Any) -> Dict[str, Any]:
        prompt = RECOVERY_PLAN_PROMPT.format(
            gaps_data=json.dumps(gaps_data, default=str),
            assessment_data=json.dumps(assessment_data, default=str)
        )

        if self.client_available:
            try:
                response = self.model.generate_content(prompt)
                clean_text = response.text.strip().replace("```json", "").replace("```", "").strip()
                return json.loads(clean_text)
            except Exception as e:
                logger.error(f"Gemini plan generation error, falling back: {e}")

        # Intelligent structured fallback
        steps = []
        if isinstance(gaps_data, list):
            for idx, gap in enumerate(gaps_data):
                t_name = gap.get("topic_name", f"Curriculum Module {idx+1}")
                t_id = gap.get("topic_id", f"t-{idx+1}")
                steps.append({
                    "order": idx + 1,
                    "topic_id": t_id,
                    "topic_name": t_name,
                    "estimated_hours": 2.0,
                    "reasoning": f"Foundational understanding of {t_name} is needed to bridge missed classroom discussions.",
                    "action_items": [
                        f"Read topic summaries for {t_name}",
                        f"Solve core concept diagnostic exercises",
                        "Consult peer notes and teacher shared summaries"
                    ],
                    "recommended_content_types": ["note", "video", "exercise"]
                })

        return {
            "title": "Personalized ShikkhaBridge Catch-Up Path",
            "summary": "Tailored recovery plan designed to bridge disrupted study periods and restore academic momentum.",
            "total_estimated_hours": len(steps) * 2,
            "difficulty_level": "Adaptive",
            "steps": steps
        }

gemini_service = GeminiService()
