from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    MIXED = "mixed"


class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"


class QuizOption(BaseModel):
    option_id: str = Field(..., description="Option identifier (A, B, C, D)")
    text: str = Field(..., description="Option text")
    is_correct: bool = Field(..., description="Whether this is the correct option")
    explanation: Optional[str] = Field(
        None, description="Explanation for why this option is correct/incorrect"
    )


class QuizQuestion(BaseModel):
    question_id: str = Field(..., description="Unique question identifier")
    question_text: str = Field(..., description="The question text")
    question_type: QuestionType = Field(
        QuestionType.MULTIPLE_CHOICE, description="Type of question"
    )
    topic_id: str = Field(..., description="Topic this question covers")
    topic_name: str = Field(..., description="Name of the topic")
    difficulty: DifficultyLevel = Field(..., description="Difficulty level")
    options: list[QuizOption] = Field(
        default_factory=list, description="Answer options for multiple choice"
    )
    correct_answer: str = Field(
        ..., description="The correct answer (option_id or text)"
    )
    explanation: str = Field(
        ..., description="Detailed explanation of the correct answer"
    )
    points: int = Field(1, description="Points awarded for correct answer")


class QuizGenerationRequest(BaseModel):
    topic_ids: list[str] = Field(
        ..., description="Topic IDs to generate questions for"
    )
    topic_names: list[str] = Field(
        ..., description="Topic names for context"
    )
    subject: str = Field(..., description="Subject name")
    grade_level: Optional[str] = Field(None, description="Grade or class level")
    difficulty: DifficultyLevel = Field(
        DifficultyLevel.MIXED, description="Desired difficulty level"
    )
    num_questions: int = Field(
        10, ge=1, le=50, description="Number of questions to generate"
    )
    language: str = Field(
        "en", description="Language for questions (en or bn)"
    )
    include_explanations: bool = Field(
        True, description="Whether to include answer explanations"
    )


class QuizGenerationResponse(BaseModel):
    quiz_id: str = Field(..., description="Generated quiz identifier")
    title: str = Field(..., description="Quiz title")
    subject: str = Field(..., description="Subject name")
    difficulty: DifficultyLevel = Field(..., description="Overall difficulty")
    total_questions: int = Field(..., description="Total number of questions")
    total_points: int = Field(..., description="Total possible points")
    estimated_duration_minutes: int = Field(
        ..., description="Estimated time to complete in minutes"
    )
    questions: list[QuizQuestion] = Field(
        ..., description="List of generated quiz questions"
    )
    topics_covered: list[str] = Field(
        ..., description="List of topics covered in the quiz"
    )
