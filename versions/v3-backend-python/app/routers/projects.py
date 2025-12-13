"""
Project management API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from app.database import get_db
from app.models.project import Project, ProjectVersion
from app.schemas.project import (
    ProjectCreate, ProjectUpdate, ProjectResponse, 
    ProjectDetail, ProjectExport, ProjectVersionCreate, ProjectVersionResponse
)
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[ProjectResponse])
async def get_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[str] = None,
    is_public: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's projects with optional filtering"""
    query = db.query(Project).filter(Project.user_id == current_user.id)
    
    if category:
        query = query.filter(Project.category == category)
    if is_public is not None:
        query = query.filter(Project.is_public == is_public)
    
    projects = query.offset(skip).limit(limit).all()
    return projects

@router.get("/public", response_model=List[ProjectResponse])
async def get_public_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get public projects"""
    query = db.query(Project).filter(Project.is_public == True)
    
    if category:
        query = query.filter(Project.category == category)
    
    projects = query.offset(skip).limit(limit).all()
    return projects

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new project"""
    db_project = Project(
        **project.dict(),
        user_id=current_user.id
    )
    
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    return db_project

@router.get("/{project_id}", response_model=ProjectDetail)
async def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Update fields
    update_data = project_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
    
    db.commit()
    db.refresh(project)
    
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    db.delete(project)
    db.commit()

@router.post("/{project_id}/duplicate", response_model=ProjectResponse)
async def duplicate_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Duplicate a project"""
    original_project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not original_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Create duplicate
    duplicate_project = Project(
        name=f"{original_project.name} (Copy)",
        description=original_project.description,
        html_content=original_project.html_content,
        css_content=original_project.css_content,
        js_content=original_project.js_content,
        elements_tree=original_project.elements_tree,
        canvas_settings=original_project.canvas_settings,
        category=original_project.category,
        tags=original_project.tags,
        user_id=current_user.id
    )
    
    db.add(duplicate_project)
    db.commit()
    db.refresh(duplicate_project)
    
    return duplicate_project

@router.post("/{project_id}/versions", response_model=ProjectVersionResponse)
async def create_project_version(
    project_id: int,
    version_data: ProjectVersionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new version of a project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Get next version number
    last_version = db.query(ProjectVersion).filter(
        ProjectVersion.project_id == project_id
    ).order_by(ProjectVersion.version_number.desc()).first()
    
    next_version = (last_version.version_number + 1) if last_version else 1
    
    # Create version
    version = ProjectVersion(
        project_id=project_id,
        version_number=next_version,
        description=version_data.description,
        html_content=project.html_content,
        css_content=project.css_content,
        js_content=project.js_content,
        elements_tree=project.elements_tree
    )
    
    db.add(version)
    db.commit()
    db.refresh(version)
    
    return version

@router.get("/{project_id}/versions", response_model=List[ProjectVersionResponse])
async def get_project_versions(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all versions of a project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    versions = db.query(ProjectVersion).filter(
        ProjectVersion.project_id == project_id
    ).order_by(ProjectVersion.version_number.desc()).all()
    
    return versions