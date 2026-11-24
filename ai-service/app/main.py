from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="ShikkhaBridge AI Service",
    description="AI service for ShikkhaBridge (features are added by each team member)",
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

# Register AI routers here. Teammates: add your feature's router in app/routers/
# and include it, e.g.
#   from app.routers import quiz_generation
#   app.include_router(quiz_generation.router, prefix="/api/ai", tags=["Quiz Generation"])

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ShikkhaBridge AI Engine",
        "version": "1.0.0"
    }
