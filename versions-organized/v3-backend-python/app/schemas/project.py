"""
Project Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ProjectBase(BaseModel):
    """Base project schema"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: bool = False

class ProjectCreate(ProjectBase):
    """Schema for creating a new project"""
    template_id: Optional[str] = None
    html_content: Optional[str] = None
    css_content: Optional[str] = None
    js_content: Optional[str] = None
    elements_tree: Optional[Dict[str, Any]] = None
    canvas_settings: Optional[Dict[str, Any]] = None

class ProjectUpdate(BaseModel):
    """Schema for updating a project"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None
    html_content: Optional[str] = None
    css_content: Optional[str] = None
    js_content: Optional[str] = None
    elements_tree: Optional[Dict[str, Any]] = None
    canvas_settings: Optional[Dict[str, Any]] = None
    status: Optional[str] = None

class ProjectResponse(ProjectBase):
    """Schema for project response"""
    id: int
    user_id: int
    template_id: Optional[str] = None
    status: str
    is_template: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ProjectDetail(ProjectResponse):
    """Detailed project schema with content"""
    html_content: Optional[str] = None
    css_content: Optional[str] = None
    js_content: Optional[str] = None
    elements_tree: Optional[Dict[str, Any]] = None
    canvas_settings: Optional[Dict[str, Any]] = None

class ProjectExport(BaseModel):
    """Schema for project export"""
    format: str = Field(..., regex="^(html|zip|json)$")
    include_assets: bool = True
    minify: bool = False

class ProjectVersionCreate(BaseModel):
    """Schema for creating a project version"""
    description: Optional[str] = None

class ProjectVersionResponse(BaseModel):
    """Schema for project version response"""
    id: int
    project_id: int
    version_number: int
    description: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True