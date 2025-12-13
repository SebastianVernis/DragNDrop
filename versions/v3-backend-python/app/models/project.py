"""
Project database models
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Project(Base):
    """Project model for storing HTML editor projects"""
    
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Project content
    html_content = Column(Text, nullable=True)
    css_content = Column(Text, nullable=True)
    js_content = Column(Text, nullable=True)
    
    # Project structure (JSON)
    elements_tree = Column(JSON, nullable=True)
    canvas_settings = Column(JSON, nullable=True)
    
    # Metadata
    template_id = Column(String(100), nullable=True)
    category = Column(String(100), nullable=True)
    tags = Column(JSON, nullable=True)  # Array of strings
    
    # Status
    is_public = Column(Boolean, default=False)
    is_template = Column(Boolean, default=False)
    status = Column(String(50), default="draft")  # draft, published, archived
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="projects")
    
    def __repr__(self):
        return f"<Project(id={self.id}, name='{self.name}', user_id={self.user_id})>"

class ProjectVersion(Base):
    """Project version history"""
    
    __tablename__ = "project_versions"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    
    # Version content
    html_content = Column(Text, nullable=True)
    css_content = Column(Text, nullable=True)
    js_content = Column(Text, nullable=True)
    elements_tree = Column(JSON, nullable=True)
    
    # Version metadata
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project")
    
    def __repr__(self):
        return f"<ProjectVersion(id={self.id}, project_id={self.project_id}, version={self.version_number})>"