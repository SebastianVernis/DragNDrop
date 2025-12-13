"""
FastAPI main application for DragNDrop HTML Editor
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import uvicorn
import os

from app.core.config import settings
from app.database import engine, Base
from app.routers import auth, users, projects, templates, components

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="DragNDrop HTML Editor API",
    description="Backend API for the visual HTML editor",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(templates.router, prefix="/api/v1/templates", tags=["Templates"])
app.include_router(components.router, prefix="/api/v1/components", tags=["Components"])

# Health check endpoint
@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }

# Serve static files (frontend)
if os.path.exists("../frontend/dist"):
    app.mount("/static", StaticFiles(directory="../frontend/dist"), name="static")
    
    @app.get("/", response_class=HTMLResponse)
    async def serve_frontend():
        """Serve the frontend application"""
        try:
            with open("../frontend/dist/index.html", "r", encoding="utf-8") as f:
                return HTMLResponse(content=f.read())
        except FileNotFoundError:
            return HTMLResponse(
                content="<h1>Frontend not built</h1><p>Run 'npm run build' in the frontend directory</p>",
                status_code=404
            )

# Serve original HTML editor for development
elif os.path.exists("../index.html"):
    app.mount("/static", StaticFiles(directory="../"), name="static")
    
    @app.get("/", response_class=HTMLResponse)
    async def serve_original():
        """Serve the original HTML editor"""
        try:
            with open("../index.html", "r", encoding="utf-8") as f:
                return HTMLResponse(content=f.read())
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Frontend not found")

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {"error": "Not found", "detail": str(exc)}

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return {"error": "Internal server error", "detail": str(exc)}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info" if settings.DEBUG else "warning"
    )