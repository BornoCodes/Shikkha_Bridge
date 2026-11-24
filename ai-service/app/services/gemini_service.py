import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[3] / ".env")
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
                self.model = genai.GenerativeModel("gemini-3.5-flash-lite")
                self.client_available = True
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini Client: {e}")

    async def generate_quiz(
        self,
        topic_name: str,
        topic_description: str,
        segment_title: str = "",
        learning_content: str = "",
        difficulty: str = "medium",
        question_count: int = 5,
    ) -> Dict[str, Any]:

        if not self.client_available:
            raise RuntimeError(
                "Gemini is not configured. Quiz generation requires an available AI service."
            )

        source_content = learning_content.strip() or topic_description.strip()

        if not source_content:
            raise ValueError("Learning content is required to generate quiz questions.")

        prompt = f"""
You are an expert school-level educational assessment designer.

Create exactly {question_count} meaningful multiple-choice questions.

SUBJECT/TOPIC: {topic_name}
SEGMENT: {segment_title or topic_name}
DIFFICULTY: {difficulty}

AUTHORITATIVE LEARNING MATERIAL:
{source_content}

STRICT REQUIREMENTS:
1. Base every question on the supplied learning material.
2. Do not invent facts or test information absent from the material.
3. Write clear, complete questions that test understanding and application.
4. Make questions meaningfully different from one another.
5. Provide exactly four distinct, plausible answer options per question.
6. Only one option must be correct.
7. The correct_answer value must exactly match one of the four options.
8. Avoid generic questions, repeated questions, and placeholder options.
9. Include a short explanation grounded in the learning material.
10. Match the requested difficulty.

Return ONLY valid JSON in this exact structure:
{{
  "topic_name": "{topic_name}",
  "difficulty": "{difficulty}",
  "questions": [
    {{
      "id": 1,
      "question": "A complete question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option A",
      "explanation": "Explanation based on the supplied material.",
      "difficulty": "{difficulty}"
    }}
  ]
}}
"""

        try:
            response = self.model.generate_content(prompt)

            response_text = "".join(
                part.text
                for part in response.parts
                if getattr(part, "text", None)
            )

            if not response_text.strip():
                raise ValueError("Gemini returned an empty response.")

            clean_text = (
                response_text.strip()
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

            quiz = json.loads(clean_text)
            questions = quiz.get("questions")

            if not isinstance(questions, list) or len(questions) != question_count:
                raise ValueError("Gemini returned an incorrect number of questions.")

            for question in questions:
                options = question.get("options", [])
                correct_answer = question.get("correct_answer", "")

                if (
                    not isinstance(question.get("question"), str)
                    or not question["question"].strip()
                    or not isinstance(options, list)
                    or len(options) != 4
                    or any(not isinstance(option, str) or not option.strip() for option in options)
                    or len(set(option.strip() for option in options)) != 4
                    or not isinstance(correct_answer, str)
                    or correct_answer.strip() not in [option.strip() for option in options]
                ):
                    raise ValueError("Gemini returned an invalid question or answer.")

            return quiz

        except Exception as e:
            logger.error("Quiz generation failed: %s", e)
            raise RuntimeError(
                "Could not generate valid questions from the supplied learning content. Please try again."
            ) from e
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
                t_name = gap.get("topic_name") or gap.get("topicName") or f"Curriculum Module {idx+1}"
                t_id = gap.get("topic_id") or gap.get("topicId") or f"t-{idx+1}"
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
