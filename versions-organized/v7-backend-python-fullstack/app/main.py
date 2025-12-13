"""
DragNDrop Backend API
FastAPI application for managing HTML editor projects
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn
from typing import List, Optional
import os
from dotenv import load_dotenv

from app.database import engine, Base
from app.routers import projects, templates, components, auth, users
from app.core.config import settings

# Load environment variables
load_dotenv()

# Database initialization
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    pass

# FastAPI app instance
app = FastAPI(
    title="DragNDrop HTML Editor API",
    description="Backend API for the visual HTML editor with drag & drop functionality",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(templates.router, prefix="/api/v1/templates", tags=["templates"])
app.include_router(components.router, prefix="/api/v1/components", tags=["components"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "DragNDrop HTML Editor API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )