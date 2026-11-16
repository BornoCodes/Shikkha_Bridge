from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.routers import gap_analysis, quiz_generation, plan_generation

app = FastAPI(
    title="ShikkhaBridge AI Service",
    description="Intelligent Learning Gap Recovery, Quiz, and Adaptive Study Plan Generation Engine",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register AI Routers
app.include_router(gap_analysis.router, prefix="/api/ai", tags=["Gap Analysis"])
app.include_router(quiz_generation.router, prefix="/api/ai", tags=["Quiz Generation"])
app.include_router(plan_generation.router, prefix="/api/ai", tags=["Plan Generation"])

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ShikkhaBridge AI Engine",
        "version": "1.0.0"
    }
