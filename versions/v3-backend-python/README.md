# Versión 3: Backend Python (FastAPI)

## Descripción
API REST completa construida con FastAPI para gestionar usuarios, proyectos, templates y componentes.

## Tecnologías
- **FastAPI**: Framework web moderno y rápido
- **SQLAlchemy**: ORM para base de datos
- **PostgreSQL**: Base de datos relacional
- **Pydantic**: Validación de datos
- **JWT**: Autenticación con tokens
- **Uvicorn**: Servidor ASGI

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

## Cómo ejecutar

### Requisitos previos
```bash
# Instalar Python 3.8+
python3 --version

# Crear entorno virtual
cd /home/admin/DragNDrop/versions/v3-backend-python
python3 -m venv venv
source venv/bin/activate
```

### Instalación
```bash
# Instalar dependencias
pip install -r requirements.txt
```

### Configuración
```bash
# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

### Ejecutar
```bash
# Modo desarrollo
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Modo producción
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Puertos
- **API**: 8000

## Estado
✅ **PRODUCCIÓN** - API completa y funcional
