# DEVOPS-002: Container Strategy & Docker Setup

**Tipo**: DevOps/Containerization  
**Prioridad**: 🟠 ALTA  
**Estimación**: 8h  
**Agente Recomendado**: @devops  
**Estado**: ⏳ ESPERANDO ASIGNACIÓN  

## 📋 Descripción

Implementar estrategia completa de containerización para desarrollo local, testing y deployment opcional.

## 🎯 Objetivos

1. Crear Dockerfiles optimizados multi-stage
2. Configurar docker-compose para desarrollo local
3. Implementar caching eficiente de dependencias
4. Setup de dev containers para VSCode
5. Integración con CI/CD pipelines

## 📝 Tareas Específicas

### 1. Frontend Dockerfile
```dockerfile
# Dockerfile.frontend
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### 2. Backend Node.js Dockerfile
```dockerfile
# backend-node/Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM node:18-alpine AS prod
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### 3. Backend Python Dockerfile
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim AS base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM base AS dev
COPY requirements-dev.txt .
RUN pip install --no-cache-dir -r requirements-dev.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0"]

FROM base AS prod
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]
```

### 4. Docker Compose Configuration
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "8080:80"
    volumes:
      - ./src:/app/src
      - ./public:/app/public
    environment:
      - NODE_ENV=development

  backend-node:
    build:
      context: ./backend-node
      target: dev
    ports:
      - "3000:3000"
    volumes:
      - ./backend-node:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=${DATABASE_URL}

  backend-python:
    build:
      context: ./backend
      target: dev
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - PYTHONUNBUFFERED=1
      - DATABASE_URL=${DATABASE_URL}

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: dragndrop
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 5. Dev Container Configuration
```json
// .devcontainer/devcontainer.json
{
  "name": "DragNDrop Development",
  "dockerComposeFile": "../docker-compose.yml",
  "service": "frontend",
  "workspaceFolder": "/app",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {},
    "ghcr.io/devcontainers/features/python:1": {}
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ms-python.python"
      ]
    }
  }
}
```

### 6. CI Integration
```yaml
# .github/workflows/docker.yml
name: Docker CI
on:
  push:
    branches: [master, dev]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      - name: Build Frontend
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile.frontend
          tags: dragndrop-frontend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## 📂 Archivos a Crear/Modificar

- `/Dockerfile.frontend`
- `/backend-node/Dockerfile`
- `/backend/Dockerfile`
- `/docker-compose.yml`
- `/docker-compose.prod.yml`
- `/.dockerignore`
- `/nginx.conf`
- `/.devcontainer/devcontainer.json`
- `/.github/workflows/docker.yml`
- `/scripts/docker/build.sh`
- `/scripts/docker/dev.sh`
- `/docs/docker/README.md`

## 🔧 Scripts Útiles

```bash
# scripts/docker/dev.sh
#!/bin/bash
docker-compose up -d
docker-compose logs -f frontend

# scripts/docker/build.sh
#!/bin/bash
docker buildx build --platform linux/amd64,linux/arm64 -t dragndrop:latest .
```

## 📋 Criterios de Aceptación

- [ ] Todos los servicios funcionan con `docker-compose up`
- [ ] Hot reload funciona en desarrollo
- [ ] Imágenes optimizadas (<100MB frontend, <200MB backends)
- [ ] CI puede construir y cachear eficientemente
- [ ] Dev containers funcionan en VSCode
- [ ] Documentación clara para setup local

## 🔗 Dependencias

- Ninguna

## 🏷️ Tags

`docker`, `containerization`, `devcontainer`, `docker-compose`, `ci-integration`