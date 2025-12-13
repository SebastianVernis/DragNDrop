# V8 - NodeJS Fullstack - Arquitectura

## 🏗️ Arquitectura General

### 🎯 Descripción
Aplicación fullstack completa con Node.js/Express backend y frontend integrado. Incluye colaboración en tiempo real y sistema de autenticación completo.

## 📋 Stack Tecnológico

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Socket.io** - WebSockets para tiempo real
- **Drizzle ORM** - Type-safe database queries
- **JWT** - Autenticación sin estado
- **Jest** - Testing framework

### Frontend
- **HTML/CSS/JS** - Frontend vanilla
- **Socket.io Client** - Real-time communication
- **Monaco Editor** - Editor de código

### Base de Datos
- **SQLite** (desarrollo)
- **PostgreSQL** (producción)

## 🔧 Estructura del Proyecto

```
v8-backend-nodejs-fullstack/
├── server.js              # Servidor principal
├── package.json           # Dependencias
├── drizzle.config.js      # Configuración ORM
├── api/                   # Endpoints REST
│   ├── projects.js
│   ├── components.js
│   └── deployments.js
├── auth/                  # Sistema autenticación
│   ├── config.js
│   └── middleware.js
├── collaboration/         # Sistema tiempo real
│   ├── socketServer.js
│   ├── roomManager.js
│   └── authMiddleware.js
├── db/                    # Base de datos
│   ├── client.js
│   ├── schema.js
│   └── migrations/
├── tests/                 # Tests automatizados
│   ├── auth.test.js
│   ├── projects.test.js
│   └── integration/
└── docs/                  # Documentación
```

## 🔄 Flujo de Datos

### 1. Autenticación
```
Cliente → POST /auth/login → JWT Token → Middleware → Recursos protegidos
```

### 2. Colaboración Tiempo Real
```
Cliente A → Socket.io → Servidor → Room Manager → Broadcast → Cliente B
```

### 3. Gestión de Proyectos
```
Frontend → API REST → Validación → Base de Datos → Response
```

## 🚀 Funcionalidades Principales

### 🔐 Sistema de Autenticación
- Registro y login de usuarios
- JWT tokens con expiración
- Middleware de autorización
- Refresh tokens
- Logout seguro

### 🤝 Colaboración en Tiempo Real
- Salas de colaboración por proyecto
- Sincronización de cursores
- Cambios en vivo
- Gestión de usuarios conectados
- Resolución de conflictos

### 📁 Gestión de Proyectos
- CRUD completo de proyectos
- Versionado de componentes
- Sistema de archivos virtual
- Backup automático

### 🚀 Despliegue Automático
- Build automatizado
- Deploy a múltiples plataformas
- Logs de despliegue
- Rollback automático

## 🔧 Configuración

### Variables de Entorno
```bash
PORT=3000
DATABASE_URL=sqlite://./dev.db
JWT_SECRET=tu-secreto-jwt
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Instalación y Ejecución
```bash
# Instalar dependencias
npm install

# Configurar base de datos
npm run db:migrate

# Desarrollo
npm run dev

# Producción
npm start

# Tests
npm test
```

## 🧪 Testing

### Tipos de Tests
- **Unitarios**: Funciones individuales
- **Integración**: APIs completas
- **E2E**: Flujos completos usuario

### Comandos
```bash
# Todos los tests
npm test

# Con watch mode
npm run test:watch

# Cobertura
npm run test:coverage

# Solo integración
npm run test:integration
```

## 📊 Monitoreo y Logs

### Health Checks
- `GET /health` - Estado del servidor
- `GET /db-health` - Estado base de datos
- `GET /metrics` - Métricas de performance

### Logging
- Logs estructurados con Winston
- Niveles: error, warn, info, debug
- Rotación automática de archivos
- Integración con servicios externos

## 🚀 Despliegue

### Desarrollo
```bash
npm run dev
# Servidor en http://localhost:3000
```

### Producción
```bash
# Build
npm run build

# Start
npm start

# Con PM2
pm2 start server.js --name "dragndrop-fullstack"
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Seguridad

### Medidas Implementadas
- Validación de entrada
- Rate limiting
- CORS configurado
- Headers de seguridad
- Sanitización de datos
- SQL injection prevention

### Best Practices
- Secrets en variables de entorno
- HTTPS en producción
- Validación server-side
- Logs de seguridad