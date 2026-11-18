from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class PlanStatus(str, Enum):
    DRAFT = "draft"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class StepStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    SKIPPED = "skipped"


class ContentType(str, Enum):
    VIDEO = "video"
    NOTE = "note"
    EXERCISE = "exercise"
    ARTICLE = "article"
    QUIZ = "quiz"


class RecommendedResource(BaseModel):
    resource_id: Optional[str] = Field(
        None, description="ID of existing resource, if available"
    )
    title: str = Field(..., description="Resource title")
    content_type: ContentType = Field(..., description="Type of content resource")
    url: Optional[str] = Field(None, description="URL to the resource")
    description: str = Field(..., description="Brief description of the resource")
    estimated_minutes: int = Field(
        ..., description="Estimated time to consume in minutes"
    )


class PlanStep(BaseModel):
    step_id: str = Field(..., description="Unique step identifier")
    order: int = Field(..., description="Order in the learning sequence")
    topic_id: str = Field(..., description="Topic ID this step covers")
    topic_name: str = Field(..., description="Name of the topic")
    description: str = Field(..., description="Description of what to learn/do")
    estimated_hours: float = Field(
        ..., description="Estimated hours for this step"
    )
    status: StepStatus = Field(
        StepStatus.PENDING, description="Current status of this step"
    )
    is_prerequisite: bool = Field(
        False, description="Whether this is a prerequisite step"
    )
    recommended_resources: list[RecommendedResource] = Field(
        default_factory=list, description="Recommended resources for this step"
    )
    assessment_required: bool = Field(
        False,
        description="Whether an assessment is required after this step",
    )
    teacher_notes: Optional[str] = Field(
        None, description="Notes from the teacher"
    )


class PlanItem(BaseModel):
    topic_id: str = Field(..., description="Topic ID")
    topic_name: str = Field(..., description="Topic name")
    gap_severity: float = Field(
        ..., ge=0.0, le=1.0, description="Gap severity score"
    )
    assessment_score: Optional[float] = Field(
        None, ge=0.0, le=100.0, description="Assessment score for this topic"
    )


class AvailableContent(BaseModel):
    content_id: str = Field(..., description="Content identifier")
    title: str = Field(..., description="Content title")
    content_type: ContentType = Field(..., description="Type of content")
    topic_ids: list[str] = Field(
        ..., description="Topic IDs this content covers"
    )
    description: str = Field(..., description="Content description")
    duration_minutes: Optional[int] = Field(
        None, description="Duration in minutes"
    )


class PlanGenerationRequest(BaseModel):
    student_id: str = Field(..., description="Student identifier")
    student_name: Optional[str] = Field(None, description="Student name")
    subject: str = Field(..., description="Subject for the recovery plan")
    grade_level: Optional[str] = Field(None, description="Grade or class level")
    gaps: list[PlanItem] = Field(
        ..., description="Learning gaps with severity and assessment scores"
    )
    available_content: list[AvailableContent] = Field(
        default_factory=list,
        description="Available content resources to recommend",
    )
    target_completion_days: Optional[int] = Field(
        None, description="Target number of days to complete the plan"
    )
    daily_study_hours: float = Field(
        1.5, description="Available daily study hours"
    )
    language: str = Field("en", description="Language preference (en or bn)")


class PlanGenerationResponse(BaseModel):
    plan_id: str = Field(..., description="Generated plan identifier")
    student_id: str = Field(..., description="Student identifier")
    title: str = Field(..., description="Plan title")
    subject: str = Field(..., description="Subject name")
    status: PlanStatus = Field(
        PlanStatus.DRAFT, description="Current plan status"
    )
    total_steps: int = Field(..., description="Total number of steps")
    total_estimated_hours: float = Field(
        ..., description="Total estimated hours to complete"
    )
    estimated_completion_days: int = Field(
        ..., description="Estimated days to complete at given daily hours"
    )
    steps: list[PlanStep] = Field(
        ..., description="Ordered list of plan steps"
    )
    summary: str = Field(
        ..., description="Human-readable summary of the recovery plan"
    )
    ai_recommendations: str = Field(
        ...,
        description="AI-generated personalized recommendations for the student",
    )
