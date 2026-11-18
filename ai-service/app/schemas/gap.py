from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class GapSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TopicInfo(BaseModel):
    topic_id: str = Field(..., description="Unique identifier for the topic")
    topic_name: str = Field(..., description="Name of the topic")
    subject: str = Field(..., description="Subject the topic belongs to")
    chapter: Optional[str] = Field(None, description="Chapter or unit name")
    prerequisite_topic_ids: list[str] = Field(
        default_factory=list,
        description="IDs of prerequisite topics",
    )
    estimated_hours: float = Field(
        1.0, description="Estimated hours to cover this topic"
    )


class AbsenceRecord(BaseModel):
    date: str = Field(..., description="Date of absence (ISO format)")
    reason: str = Field(..., description="Reason for absence")
    affected_subjects: list[str] = Field(
        ..., description="Subjects affected by the absence"
    )


class LearningGap(BaseModel):
    topic_id: str = Field(..., description="ID of the missed topic")
    topic_name: str = Field(..., description="Name of the missed topic")
    subject: str = Field(..., description="Subject of the missed topic")
    severity: GapSeverity = Field(..., description="Severity level of the gap")
    severity_score: float = Field(
        ..., ge=0.0, le=1.0, description="Numeric severity score (0-1)"
    )
    days_missed: int = Field(..., description="Number of class days missed for this topic")
    dependent_topics: list[str] = Field(
        default_factory=list,
        description="Topics that depend on this gap being filled",
    )
    prerequisite_gaps: list[str] = Field(
        default_factory=list,
        description="Prerequisite topics that are also gaps",
    )
    estimated_catch_up_hours: float = Field(
        ..., description="Estimated hours needed to catch up"
    )


class GapAnalysisRequest(BaseModel):
    student_id: str = Field(..., description="Student identifier")
    absences: list[AbsenceRecord] = Field(
        ..., description="List of student absence records"
    )
    curriculum_topics: list[TopicInfo] = Field(
        ..., description="Curriculum topics covered during the period"
    )
    topics_per_day: dict[str, list[str]] = Field(
        default_factory=dict,
        description="Mapping of date to topic IDs covered that day",
    )


class GapAnalysisResponse(BaseModel):
    student_id: str
    total_gaps: int = Field(..., description="Total number of learning gaps identified")
    critical_gaps: int = Field(..., description="Number of critical gaps")
    gaps: list[LearningGap] = Field(..., description="List of identified learning gaps")
    total_catch_up_hours: float = Field(
        ..., description="Total estimated hours to catch up"
    )
    priority_order: list[str] = Field(
        ...,
        description="Topic IDs ordered by priority (prerequisites first)",
    )
    summary: str = Field(
        ..., description="Human-readable summary of the gap analysis"
    )
