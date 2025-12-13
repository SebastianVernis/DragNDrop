"""
Component library API endpoints
"""

from fastapi import APIRouter
from typing import List, Dict, Any
from pydantic import BaseModel

router = APIRouter()

class ComponentResponse(BaseModel):
    id: str
    name: str
    category: str
    description: str
    icon: str
    properties: Dict[str, Any]

# Component definitions (matching frontend)
COMPONENTS_LIBRARY = {
    "layout": [
        {
            "id": "contenedor",
            "name": "Contenedor",
            "category": "layout",
            "description": "Contenedor básico para agrupar elementos",
            "icon": "📦",
            "properties": {
                "padding": "20px",
                "border": "1px dashed #ccc",
                "minHeight": "100px"
            }
        },
        {
            "id": "seccion",
            "name": "Sección",
            "category": "layout",
            "description": "Sección de página con padding",
            "icon": "📄",
            "properties": {
                "padding": "40px 20px",
                "width": "100%",
                "minHeight": "200px",
                "background": "#f8fafc"
            }
        },
        {
            "id": "fila",
            "name": "Fila",
            "category": "layout",
            "description": "Contenedor flex horizontal",
            "icon": "↔️",
            "properties": {
                "display": "flex",
                "flexDirection": "row",
                "gap": "10px",
                "minHeight": "80px"
            }
        },
        {
            "id": "columna",
            "name": "Columna",
            "category": "layout",
            "description": "Contenedor flex vertical",
            "icon": "↕️",
            "properties": {
                "display": "flex",
                "flexDirection": "column",
                "gap": "10px",
                "minHeight": "100px"
            }
        },
        {
            "id": "grid2",
            "name": "Grid 2 Columnas",
            "category": "layout",
            "description": "Grid de 2 columnas",
            "icon": "⚏",
            "properties": {
                "display": "grid",
                "gridTemplateColumns": "1fr 1fr",
                "gap": "10px",
                "minHeight": "100px"
            }
        },
        {
            "id": "grid3",
            "name": "Grid 3 Columnas",
            "category": "layout",
            "description": "Grid de 3 columnas",
            "icon": "⚏",
            "properties": {
                "display": "grid",
                "gridTemplateColumns": "1fr 1fr 1fr",
                "gap": "10px",
                "minHeight": "100px"
            }
        }
    ],
    "text": [
        {
            "id": "h1",
            "name": "Título H1",
            "category": "text",
            "description": "Título principal",
            "icon": "H1",
            "properties": {
                "fontSize": "2.5rem",
                "fontWeight": "bold",
                "margin": "0"
            }
        },
        {
            "id": "h2",
            "name": "Título H2",
            "category": "text",
            "description": "Subtítulo",
            "icon": "H2",
            "properties": {
                "fontSize": "2rem",
                "fontWeight": "bold",
                "margin": "0"
            }
        },
        {
            "id": "h3",
            "name": "Título H3",
            "category": "text",
            "description": "Título de sección",
            "icon": "H3",
            "properties": {
                "fontSize": "1.5rem",
                "fontWeight": "bold",
                "margin": "0"
            }
        },
        {
            "id": "p",
            "name": "Párrafo",
            "category": "text",
            "description": "Texto de párrafo",
            "icon": "¶",
            "properties": {
                "fontSize": "1rem",
                "lineHeight": "1.6",
                "margin": "0"
            }
        },
        {
            "id": "span",
            "name": "Texto en línea",
            "category": "text",
            "description": "Texto inline",
            "icon": "T",
            "properties": {}
        },
        {
            "id": "ul",
            "name": "Lista no ordenada",
            "category": "text",
            "description": "Lista con viñetas",
            "icon": "•",
            "properties": {
                "paddingLeft": "20px"
            }
        },
        {
            "id": "ol",
            "name": "Lista ordenada",
            "category": "text",
            "description": "Lista numerada",
            "icon": "1.",
            "properties": {
                "paddingLeft": "20px"
            }
        }
    ],
    "media": [
        {
            "id": "img",
            "name": "Imagen",
            "category": "media",
            "description": "Elemento de imagen",
            "icon": "🖼️",
            "properties": {
                "maxWidth": "100%",
                "display": "block"
            }
        },
        {
            "id": "video",
            "name": "Video",
            "category": "media",
            "description": "Reproductor de video",
            "icon": "🎥",
            "properties": {
                "width": "100%",
                "maxWidth": "600px",
                "controls": True
            }
        },
        {
            "id": "iframe",
            "name": "Iframe",
            "category": "media",
            "description": "Marco embebido",
            "icon": "🌐",
            "properties": {
                "width": "100%",
                "height": "400px",
                "border": "1px solid #ccc"
            }
        }
    ],
    "forms": [
        {
            "id": "input",
            "name": "Campo de texto",
            "category": "forms",
            "description": "Input de texto",
            "icon": "📝",
            "properties": {
                "padding": "10px",
                "border": "1px solid #ccc",
                "borderRadius": "4px",
                "width": "100%"
            }
        },
        {
            "id": "textarea",
            "name": "Área de texto",
            "category": "forms",
            "description": "Textarea multilinea",
            "icon": "📄",
            "properties": {
                "padding": "10px",
                "border": "1px solid #ccc",
                "borderRadius": "4px",
                "width": "100%",
                "minHeight": "100px"
            }
        },
        {
            "id": "button",
            "name": "Botón",
            "category": "forms",
            "description": "Botón básico",
            "icon": "🔘",
            "properties": {
                "padding": "10px 20px",
                "background": "#64748b",
                "color": "white",
                "border": "none",
                "borderRadius": "6px",
                "cursor": "pointer"
            }
        },
        {
            "id": "checkbox",
            "name": "Checkbox",
            "category": "forms",
            "description": "Casilla de verificación",
            "icon": "☑️",
            "properties": {
                "display": "flex",
                "alignItems": "center"
            }
        },
        {
            "id": "radio",
            "name": "Radio",
            "category": "forms",
            "description": "Botón de radio",
            "icon": "🔘",
            "properties": {
                "display": "flex",
                "alignItems": "center"
            }
        },
        {
            "id": "select",
            "name": "Select",
            "category": "forms",
            "description": "Lista desplegable",
            "icon": "📋",
            "properties": {
                "padding": "10px",
                "border": "1px solid #ccc",
                "borderRadius": "4px",
                "width": "100%"
            }
        }
    ],
    "ui": [
        {
            "id": "btn-primary",
            "name": "Botón Primario",
            "category": "ui",
            "description": "Botón de acción principal",
            "icon": "🔵",
            "properties": {
                "padding": "12px 24px",
                "background": "#2563eb",
                "color": "white",
                "border": "none",
                "borderRadius": "6px",
                "cursor": "pointer",
                "fontWeight": "500"
            }
        },
        {
            "id": "btn-secondary",
            "name": "Botón Secundario",
            "category": "ui",
            "description": "Botón de acción secundaria",
            "icon": "⚪",
            "properties": {
                "padding": "12px 24px",
                "background": "white",
                "color": "#1e293b",
                "border": "1px solid #e2e8f0",
                "borderRadius": "6px",
                "cursor": "pointer",
                "fontWeight": "500"
            }
        },
        {
            "id": "card",
            "name": "Tarjeta",
            "category": "ui",
            "description": "Componente de tarjeta",
            "icon": "🃏",
            "properties": {}
        },
        {
            "id": "navbar",
            "name": "Barra de navegación",
            "category": "ui",
            "description": "Navegación principal",
            "icon": "🧭",
            "properties": {
                "width": "100%"
            }
        },
        {
            "id": "footer",
            "name": "Pie de página",
            "category": "ui",
            "description": "Footer del sitio",
            "icon": "⬇️",
            "properties": {
                "width": "100%"
            }
        },
        {
            "id": "hero",
            "name": "Sección Hero",
            "category": "ui",
            "description": "Sección principal destacada",
            "icon": "🦸",
            "properties": {
                "width": "100%"
            }
        }
    ],
    "advanced": [
        {
            "id": "tabs",
            "name": "Pestañas",
            "category": "advanced",
            "description": "Componente de pestañas",
            "icon": "📑",
            "properties": {
                "width": "100%"
            }
        },
        {
            "id": "accordion",
            "name": "Acordeón",
            "category": "advanced",
            "description": "Contenido plegable",
            "icon": "🪗",
            "properties": {
                "width": "100%"
            }
        },
        {
            "id": "modal",
            "name": "Modal",
            "category": "advanced",
            "description": "Ventana modal",
            "icon": "🪟",
            "properties": {}
        },
        {
            "id": "carousel",
            "name": "Carrusel",
            "category": "advanced",
            "description": "Slider de contenido",
            "icon": "🎠",
            "properties": {
                "width": "100%"
            }
        },
        {
            "id": "alert",
            "name": "Alerta",
            "category": "advanced",
            "description": "Mensaje de alerta",
            "icon": "⚠️",
            "properties": {
                "width": "100%"
            }
        },
        {
            "id": "badge",
            "name": "Insignia",
            "category": "advanced",
            "description": "Etiqueta pequeña",
            "icon": "🏷️",
            "properties": {}
        }
    ]
}

@router.get("/", response_model=Dict[str, List[ComponentResponse]])
async def get_components():
    """Get all available components organized by category"""
    return COMPONENTS_LIBRARY

@router.get("/categories", response_model=List[str])
async def get_component_categories():
    """Get available component categories"""
    return list(COMPONENTS_LIBRARY.keys())

@router.get("/{category}", response_model=List[ComponentResponse])
async def get_components_by_category(category: str):
    """Get components by category"""
    if category not in COMPONENTS_LIBRARY:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{category}' not found"
        )
    
    return COMPONENTS_LIBRARY[category]

@router.get("/{category}/{component_id}", response_model=ComponentResponse)
async def get_component(category: str, component_id: str):
    """Get a specific component"""
    if category not in COMPONENTS_LIBRARY:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{category}' not found"
        )
    
    component = next(
        (c for c in COMPONENTS_LIBRARY[category] if c["id"] == component_id),
        None
    )
    
    if not component:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Component '{component_id}' not found in category '{category}'"
        )
    
    return component