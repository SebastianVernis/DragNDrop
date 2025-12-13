"""
Template management API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectResponse, ProjectDetail

router = APIRouter()

class TemplateResponse(BaseModel):
    id: str
    name: str
    description: str
    category: str
    emoji: str
    preview_url: Optional[str] = None
    
    class Config:
        from_attributes = True

# Predefined templates (same as in frontend)
PREDEFINED_TEMPLATES = [
    {
        "id": "saas-landing",
        "name": "Landing Page SaaS",
        "description": "Perfecta para software, apps y servicios en la nube",
        "category": "negocios",
        "emoji": "🚀",
        "preview_url": None
    },
    {
        "id": "portfolio",
        "name": "Portafolio Profesional",
        "description": "Vitrina profesional para mostrar tu trabajo",
        "category": "personal",
        "emoji": "👨‍💻",
        "preview_url": None
    },
    {
        "id": "blog",
        "name": "Blog Minimalista",
        "description": "Diseño limpio y elegante para tu blog",
        "category": "blog",
        "emoji": "📝",
        "preview_url": None
    },
    {
        "id": "contact",
        "name": "Página de Contacto",
        "description": "Formulario de contacto profesional",
        "category": "servicios",
        "emoji": "📞",
        "preview_url": None
    },
    {
        "id": "store",
        "name": "Tienda Online",
        "description": "Escaparate para productos y servicios",
        "category": "tienda",
        "emoji": "🛍️",
        "preview_url": None
    }
]

@router.get("/", response_model=List[TemplateResponse])
async def get_templates(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get available templates"""
    templates = PREDEFINED_TEMPLATES.copy()
    
    # Add user-created templates
    user_templates = db.query(Project).filter(
        Project.is_template == True,
        Project.is_public == True
    ).all()
    
    for template in user_templates:
        templates.append({
            "id": f"user-{template.id}",
            "name": template.name,
            "description": template.description or "",
            "category": template.category or "custom",
            "emoji": "🎨",
            "preview_url": None
        })
    
    # Filter by category if specified
    if category:
        templates = [t for t in templates if t["category"] == category]
    
    return templates

@router.get("/{template_id}", response_model=dict)
async def get_template_content(
    template_id: str,
    db: Session = Depends(get_db)
):
    """Get template content"""
    
    # Check if it's a predefined template
    predefined_template = next((t for t in PREDEFINED_TEMPLATES if t["id"] == template_id), None)
    
    if predefined_template:
        # Return predefined template content (would need to be implemented)
        # For now, return basic structure
        return {
            "id": template_id,
            "name": predefined_template["name"],
            "html_content": f"<!-- {predefined_template['name']} template -->",
            "css_content": "/* Template styles */",
            "js_content": "// Template scripts",
            "elements_tree": {},
            "canvas_settings": {"width": "100%", "responsive": True}
        }
    
    # Check if it's a user template
    if template_id.startswith("user-"):
        project_id = int(template_id.replace("user-", ""))
        template = db.query(Project).filter(
            Project.id == project_id,
            Project.is_template == True,
            Project.is_public == True
        ).first()
        
        if not template:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found"
            )
        
        return {
            "id": template_id,
            "name": template.name,
            "html_content": template.html_content,
            "css_content": template.css_content,
            "js_content": template.js_content,
            "elements_tree": template.elements_tree,
            "canvas_settings": template.canvas_settings
        }
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Template not found"
    )

@router.get("/categories/", response_model=List[str])
async def get_template_categories():
    """Get available template categories"""
    return ["negocios", "personal", "blog", "servicios", "tienda", "custom"]