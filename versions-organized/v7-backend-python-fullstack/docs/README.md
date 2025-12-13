# Versión 7: Backend Python Fullstack (FastAPI + Frontend)

## Descripción
Backend completo con FastAPI que sirve tanto la API REST como el frontend del editor. Incluye autenticación, base de datos y gestión completa de proyectos.

## Tecnologías
- **FastAPI**: Framework web moderno y rápido
- **SQLAlchemy**: ORM para base de datos
- **PostgreSQL**: Base de datos relacional
- **Pydantic**: Validación de datos
- **JWT**: Autenticación con tokens
- **Uvicorn**: Servidor ASGI
- **Alembic**: Migraciones de base de datos

## Características
- ✅ API REST completa
- ✅ Autenticación JWT
- ✅ CRUD de usuarios
- ✅ CRUD de proyectos
- ✅ CRUD de templates
- ✅ CRUD de componentes
- ✅ Validación de datos con Pydantic
- ✅ Documentación automática (Swagger/ReDoc)
- ✅ CORS configurado
- ✅ Middleware de seguridad
- ✅ Manejo de errores centralizado
- ✅ Sirve frontend estático
- ✅ Migraciones de base de datos con Alembic

## Cómo ejecutar

### Requisitos previos
```bash
# Instalar Python 3.8+
python3 --version

# Instalar PostgreSQL
sudo apt-get install postgresql postgresql-contrib
```

### Instalación
```bash
cd /home/admin/DragNDrop/versions/v7-backend-python-fullstack

# Activar entorno virtual (ya existe)
source bin/activate

# O crear uno nuevo si es necesario
# python3 -m venv venv
# source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### Configuración
```bash
# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales
nano .env

# Variables requeridas:
# DATABASE_URL=postgresql://user:password@localhost/dragndrop
# SECRET_KEY=your-secret-key-here
# ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000
# DEBUG=True
# ENVIRONMENT=development
```

### Base de datos
```bash
# Crear base de datos
createdb dragndrop

# Ejecutar migraciones
alembic upgrade head
```

### Ejecutar
```bash
# Modo desarrollo
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Modo producción
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Endpoints principales

### Autenticación
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token

### Usuarios
- `GET /api/v1/users/me` - Obtener usuario actual
- `PUT /api/v1/users/me` - Actualizar usuario
- `DELETE /api/v1/users/me` - Eliminar usuario

### Proyectos
- `GET /api/v1/projects` - Listar proyectos
- `POST /api/v1/projects` - Crear proyecto
- `GET /api/v1/projects/{id}` - Obtener proyecto
- `PUT /api/v1/projects/{id}` - Actualizar proyecto
- `DELETE /api/v1/projects/{id}` - Eliminar proyecto

### Templates
- `GET /api/v1/templates` - Listar templates
- `GET /api/v1/templates/{id}` - Obtener template

### Componentes
- `GET /api/v1/components` - Listar componentes
- `GET /api/v1/components/{id}` - Obtener componente

### Health
- `GET /api/v1/health` - Health check

## Documentación API
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Estructura de archivos
```
v7-backend-python-fullstack/
├── app/
│   ├── core/
│   │   ├── auth.py         # Autenticación JWT
│   │   └── config.py       # Configuración
│   ├── models/
│   │   ├── user.py         # Modelo Usuario
│   │   └── project.py      # Modelo Proyecto
│   ├── routers/
│   │   ├── auth.py         # Rutas autenticación
│   │   ├── users.py        # Rutas usuarios
│   │   ├── projects.py     # Rutas proyectos
│   │   ├── templates.py    # Rutas templates
│   │   └── components.py   # Rutas componentes
│   ├── schemas/
│   │   └── project.py      # Schemas Pydantic
│   ├── database.py         # Configuración DB
│   └── __init__.py
├── alembic/                # Migraciones
├── main.py                 # Entry point
├── requirements.txt        # Dependencias
├── .env.example           # Ejemplo variables
└── README.md
```

## Puertos
- **API + Frontend**: 8000

## Estado
✅ **PRODUCCIÓN** - Backend completo y funcional

## Casos de uso
- Backend para aplicación fullstack
- API REST para frontend separado
- Gestión de usuarios y proyectos
- Autenticación y autorización
- Persistencia de datos

## Deploy

### Heroku
```bash
# Crear app
heroku create dragndrop-api

# Agregar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Ejecutar migraciones
heroku run alembic upgrade head
```

### Railway
```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Docker
```bash
# Build
docker build -t dragndrop-api .

# Run
docker run -p 8000:8000 --env-file .env dragndrop-api
```

## Testing
```bash
# Instalar dependencias de testing
pip install pytest pytest-asyncio httpx

# Ejecutar tests
pytest

# Con coverage
pytest --cov=app tests/
```

## Próximos pasos
- Agregar tests unitarios y de integración
- Implementar caché con Redis
- Agregar rate limiting por usuario
- Implementar webhooks
- Agregar soporte para S3/storage externo
- Implementar búsqueda full-text
- Agregar analytics
