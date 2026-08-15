from fastapi import APIRouter, status
from models.schemas import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
async def health_check():
    """
    Health check endpoint for AuthentiWrite AI Microservice.
    Returns status 200 OK with service operational metrics.
    """
    return HealthResponse(
        status="healthy",
        service="AuthentiWrite AI Microservice",
        version="1.0.0",
        model_loaded=True,
    )
