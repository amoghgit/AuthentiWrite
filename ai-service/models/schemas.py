from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    text: str = Field(..., description="The essay text to be analyzed", min_length=1)
    title: Optional[str] = Field(None, description="Optional title of the essay")


class MetricsModel(BaseModel):
    readability: int = Field(..., ge=0, le=100, description="Readability score (0-100)")
    vocabulary: int = Field(..., ge=0, le=100, description="Vocabulary diversity score (0-100)")
    complexity: int = Field(..., ge=0, le=100, description="Syntactic complexity score (0-100)")
    grammar: int = Field(..., ge=0, le=100, description="Grammar and mechanics score (0-100)")
    originality: int = Field(..., ge=0, le=100, description="Originality / human voice score (0-100)")


class EssaySegmentModel(BaseModel):
    text: str = Field(..., description="Individual sentence or segment text")
    classification: str = Field(
        ...,
        description="Classification label e.g., 'Likely Human', 'Possibly AI-Assisted', 'Likely AI-Generated'",
    )
    confidence: Literal["Low", "Moderate", "High"] = Field(
        ..., description="Confidence level: Low, Moderate, or High"
    )
    reason: str = Field(..., description="Explainable primary rationale for sentence classification")
    evidence: List[str] = Field(
        default_factory=list,
        description="Supporting evidence points explaining WHY",
    )


class AnalyzeResponse(BaseModel):
    overallAssessment: str = Field(
        ..., description="Overall qualitative assessment summary of essay authenticity"
    )
    confidence: Literal["Low", "Moderate", "High"] = Field(
        ..., description="Overall confidence level (Low, Moderate, or High)"
    )
    overallScore: int = Field(
        ..., ge=0, le=100, description="Overall authenticity score (0-100)"
    )
    metrics: MetricsModel = Field(..., description="Detailed metrics breakdown")
    essay: List[EssaySegmentModel] = Field(
        ..., description="Sentence-level analysis with evidence and explanations"
    )


class HealthResponse(BaseModel):
    status: str = Field("healthy", description="Status of microservice")
    service: str = Field("AuthentiWrite AI Microservice", description="Service name")
    version: str = Field("1.0.0", description="Microservice version")
    model_loaded: bool = Field(True, description="NLP model loading state")
