# V3 - Backend Python - API Documentation

## 🚀 FastAPI Backend Server

### 🎯 Descripción
Backend completo en Python usando FastAPI para APIs RESTful modernas con documentación automática y validación de datos.

## 🔧 Tecnologías
- **Python 3.13**
- **FastAPI** - Framework async moderno
- **SQLAlchemy** - ORM avanzado
- **Alembic** - Migraciones de base de datos
- **Pydantic** - Validación de datos
- **Uvicorn** - Servidor ASGI

## 📚 API Endpoints

### 🔐 Autenticación
```
POST /auth/login
POST /auth/register
POST /auth/refresh
DELETE /auth/logout
```

### 👥 Usuarios
```
GET /users/me
PUT /users/me
GET /users/{user_id}
```

### 📁 Proyectos
```
GET /projects/
POST /projects/
GET /projects/{project_id}
PUT /projects/{project_id}
DELETE /projects/{project_id}
```

### 🧩 Componentes
```
GET /projects/{project_id}/components
POST /projects/{project_id}/components
PUT /components/{component_id}
DELETE /components/{component_id}
```

### 🚀 Despliegues
```
POST /projects/{project_id}/deploy
GET /deployments/{deployment_id}/status
GET /deployments/{deployment_id}/logs
```

## 🗄️ Modelos de Base de Datos

### User
```python
class User(Base):
    id: int
    email: str
    username: str
    hashed_password: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
```

### Project
```python
class Project(Base):
    id: int
    name: str
    description: str
    owner_id: int
    config: dict
    created_at: datetime
    updated_at: datetime
```

### Component
```python
class Component(Base):
    id: int
    project_id: int
    name: str
    type: str
    properties: dict
    position: dict
    created_at: datetime
```

## 🛠️ Configuración

### Variables de Entorno
```bash
DATABASE_URL=postgresql://user:pass@localhost/dbname
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Instalación
```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos
alembic upgrade head

# Ejecutar servidor
uvicorn app.main:app --reload
```

## 📖 Documentación Automática
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🧪 Testing
```bash
# Ejecutar tests
pytest

# Con cobertura
pytest --cov=app tests/
```

## 🔄 Migraciones
```bash
# Crear nueva migración
alembic revision --autogenerate -m "descripción"

# Aplicar migraciones
alembic upgrade head

# Revertir
alembic downgrade -1
```

## 🚀 Despliegue

### Docker
```dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Vercel
```bash
pip install vercel
vercel --prod
```

## 📊 Monitoreo
- Health check: `GET /health`
- Métricas: `GET /metrics`
- Logs estructurados con timestamps