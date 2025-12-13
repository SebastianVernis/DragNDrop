from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Crear aplicación FastAPI
app = FastAPI(
    title="DragNDrop Backend API v3",
    description="API Backend Python con FastAPI para el editor drag & drop",
    version="3.0.0",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios exactos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class Component(BaseModel):
    id: Optional[str] = None
    name: str
    type: str
    properties: dict = {}
    position: dict = {"x": 0, "y": 0}

class Project(BaseModel):
    id: Optional[str] = None
    name: str
    description: str = ""
    components: List[Component] = []

class User(BaseModel):
    id: Optional[str] = None
    username: str
    email: str

# Almacenamiento en memoria (para demo)
projects_db = []
components_db = []
users_db = []

# Servir frontend demo como página principal
@app.get("/")
async def root():
    return FileResponse("demo-frontend.html")

@app.get("/api")
async def api_root():
    return {
        "message": "🚀 DragNDrop Backend API v3 - Python FastAPI",
        "version": "3.0.0",
        "status": "active",
        "endpoints": {
            "projects": "/projects/",
            "components": "/components/",
            "users": "/users/",
            "docs": "/docs",
            "openapi": "/openapi.json"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "3.0.0",
        "database": "in-memory",
        "cors": "enabled"
    }

# CRUD Proyectos
@app.get("/projects/", response_model=List[Project])
async def get_projects():
    return projects_db

@app.post("/projects/", response_model=Project)
async def create_project(project: Project):
    project.id = f"proj_{len(projects_db) + 1}"
    projects_db.append(project)
    return project

@app.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    project = next((p for p in projects_db if p.id == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return project

@app.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project: Project):
    existing = next((p for p in projects_db if p.id == project_id), None)
    if not existing:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    project.id = project_id
    projects_db[projects_db.index(existing)] = project
    return project

@app.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    project = next((p for p in projects_db if p.id == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    projects_db.remove(project)
    return {"message": "Proyecto eliminado exitosamente"}

# CRUD Componentes
@app.get("/components/", response_model=List[Component])
async def get_components():
    return components_db

@app.post("/components/", response_model=Component)
async def create_component(component: Component):
    component.id = f"comp_{len(components_db) + 1}"
    components_db.append(component)
    return component

@app.get("/components/{component_id}", response_model=Component)
async def get_component(component_id: str):
    component = next((c for c in components_db if c.id == component_id), None)
    if not component:
        raise HTTPException(status_code=404, detail="Componente no encontrado")
    return component

@app.put("/components/{component_id}", response_model=Component)
async def update_component(component_id: str, component: Component):
    existing = next((c for c in components_db if c.id == component_id), None)
    if not existing:
        raise HTTPException(status_code=404, detail="Componente no encontrado")
    
    component.id = component_id
    components_db[components_db.index(existing)] = component
    return component

@app.delete("/components/{component_id}")
async def delete_component(component_id: str):
    component = next((c for c in components_db if c.id == component_id), None)
    if not component:
        raise HTTPException(status_code=404, detail="Componente no encontrado")
    
    components_db.remove(component)
    return {"message": "Componente eliminado exitosamente"}

# Usuarios básicos
@app.get("/users/", response_model=List[User])
async def get_users():
    return users_db

@app.post("/users/", response_model=User)
async def create_user(user: User):
    user.id = f"user_{len(users_db) + 1}"
    users_db.append(user)
    return user

# Datos de ejemplo para demo
@app.post("/seed-data/")
async def seed_demo_data():
    # Limpiar datos existentes
    projects_db.clear()
    components_db.clear()
    users_db.clear()
    
    # Crear usuarios demo
    demo_users = [
        User(id="user_1", username="admin", email="admin@dragndrop.demo"),
        User(id="user_2", username="developer", email="dev@dragndrop.demo")
    ]
    users_db.extend(demo_users)
    
    # Crear componentes demo
    demo_components = [
        Component(
            id="comp_1", 
            name="Header", 
            type="header",
            properties={"text": "Mi Website", "color": "#333"},
            position={"x": 0, "y": 0}
        ),
        Component(
            id="comp_2", 
            name="Button", 
            type="button",
            properties={"text": "Click Me", "color": "#007bff"},
            position={"x": 100, "y": 100}
        )
    ]
    components_db.extend(demo_components)
    
    # Crear proyecto demo
    demo_project = Project(
        id="proj_1",
        name="Mi Primer Proyecto",
        description="Proyecto de demostración para DragNDrop",
        components=demo_components
    )
    projects_db.append(demo_project)
    
    return {
        "message": "Datos de demostración creados exitosamente",
        "users": len(users_db),
        "components": len(components_db),
        "projects": len(projects_db)
    }

# Información de la API
@app.get("/api/info")
async def api_info():
    return {
        "name": "DragNDrop Backend API v3",
        "version": "3.0.0",
        "framework": "FastAPI",
        "python_version": "3.13",
        "database": "In-Memory (Demo)",
        "cors": "Enabled",
        "features": [
            "RESTful API",
            "Pydantic validation",
            "Auto-generated docs",
            "CORS support",
            "Health checks"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8083)