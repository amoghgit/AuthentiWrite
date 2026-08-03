import sys
from pathlib import Path

# Ensure ai-service root directory is in Python path for clean module imports
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import health_router, analyze_router

app = FastAPI(
    title="AuthentiWrite AI Microservice",
    description="Transparent AI Writing Analysis for College Admission Essays - AI Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health_router)
app.include_router(analyze_router)


@app.get("/")
async def root():
    return {
        "name": "AuthentiWrite AI Microservice",
        "status": "operational",
        "docs": "/docs",
        "health": "/health",
        "analyze": "/analyze",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
