"""
Prompt templates for Gemini LLM interactions in ShikkhaBridge.
Designed for precise structured JSON output adhering to Bengali curriculum contexts.
"""

QUIZ_GENERATION_PROMPT = """
You are an expert curriculum specialist and teacher for Bengali national curriculum education.
Generate a diagnostic assessment quiz for the topic: "{topic_name}".
Description: {topic_description}
Difficulty level: {difficulty}
Number of questions: {question_count}

Output strictly valid JSON with no markdown formatting or backticks around it:
{{
  "topic_name": "{topic_name}",
  "difficulty": "{difficulty}",
  "questions": [
    {{
      "id": 1,
      "question": "Clear, contextual multiple-choice question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option A",
      "explanation": "Why this answer is correct",
      "difficulty": "medium"
    }}
  ]
}}
"""

RECOVERY_PLAN_PROMPT = """
You are an empathetic, expert education recovery specialist for ShikkhaBridge.
A student was absent due to disruptions (e.g. floods, illness) and missed critical lessons.

Missed Topics & Gap Information:
{gaps_data}

Assessment Results (if available):
{assessment_data}

Generate a structured, compassionate, and realistic catch-up recovery plan that bridges knowledge gaps.
Prioritize foundational prerequisite concepts before advanced topics.

Output strictly valid JSON with no markdown formatting or backticks around it:
{{
  "title": "Custom Catch-Up Pathway for Student",
  "summary": "Brief encouraging overview explaining the bridge strategy",
  "total_estimated_hours": 12,
  "difficulty_level": "Adaptive",
  "steps": [
    {{
      "order": 1,
      "topic_id": "topic-uuid-or-id",
      "topic_name": "Topic Name",
      "estimated_hours": 2.5,
      "reasoning": "Why this topic is sequenced first",
      "action_items": [
        "Review foundational notes on X",
        "Watch introductory video on Y",
        "Complete practice exercises 1-5"
      ],
      "recommended_content_types": ["video", "note", "exercise"]
    }}
  ]
}}
"""
