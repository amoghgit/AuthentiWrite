from fastapi import APIRouter, HTTPException, status
from models.schemas import AnalyzeRequest, AnalyzeResponse
from services.analysis_service import AnalysisService

router = APIRouter(tags=["Analysis"])
analysis_service = AnalysisService()


@router.post("/analyze", response_model=AnalyzeResponse, status_code=status.HTTP_200_OK)
async def analyze_essay(payload: AnalyzeRequest):
    """
    Analyze an essay for writing authenticity and AI indicators.
    Returns explainable JSON breakdown including metrics and sentence-level evidence.
    """
    if not payload.text or not payload.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Essay text cannot be empty.",
        )

    try:
        response = analysis_service.analyze_essay(payload.text)
        return response
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during analysis: {str(exc)}",
        )
