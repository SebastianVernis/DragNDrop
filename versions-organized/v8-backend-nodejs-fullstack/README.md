# Versión 8: Backend Node.js Fullstack (Express + Better Auth + Colaboración)

## Descripción
Backend completo con Express.js, Better Auth para autenticación OAuth moderna, Socket.io para colaboración en tiempo real, y Drizzle ORM para base de datos.

## Tecnologías
- **Express.js**: Framework web para Node.js
- **Better Auth**: Sistema de autenticación moderno con OAuth
- **Socket.io**: WebSocket para colaboración en tiempo real
- **Drizzle ORM**: ORM TypeScript-first
- **PostgreSQL**: Base de datos (vía Supabase)
- **OAuth**: Google, GitHub authentication
- **Yjs**: CRDT para colaboración en tiempo real

## Características
- ✅ API REST completa
- ✅ Autenticación con Better Auth
- ✅ OAuth (Google, GitHub, Discord)
- ✅ WebSocket para colaboración en tiempo real
- ✅ CRDT con Yjs para edición colaborativa
- ✅ CRUD de proyectos
- ✅ CRUD de componentes
- ✅ Deploy a Vercel
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Helmet para seguridad
- ✅ Drizzle ORM con migraciones
- ✅ Sesiones persistentes

## Cómo ejecutar

### Requisitos previos
```bash
# Node.js 18+
node --version

# PostgreSQL o cuenta de Supabase
```

### Instalación
```bash
cd /home/admin/DragNDrop/versions/v8-backend-nodejs-fullstack
npm install
```

### Configuración
```bash
# Crear archivo .env
cp .env.example .env
nano .env

# Variables requeridas:
# DATABASE_URL=postgresql://user:password@localhost:5432/dragndrop
# BETTER_AUTH_SECRET=your-secret-key-here
# BETTER_AUTH_URL=http://localhost:3001
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# GITHUB_CLIENT_ID=your-github-client-id
# GITHUB_CLIENT_SECRET=your-github-client-secret
# PORT=3001
# NODE_ENV=development
```

### Base de datos
```bash
# Generar migraciones
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Push schema (desarrollo)
npm run db:push
```

### Ejecutar
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## Endpoints principales

### Autenticación (Better Auth)
- `POST /api/auth/sign-up/email` - Registro con email
- `POST /api/auth/sign-in/email` - Login con email
- `GET /api/auth/sign-in/google` - Login con Google
- `GET /api/auth/sign-in/github` - Login con GitHub
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Obtener sesión actual

### Proyectos
- `GET /api/projects` - Listar proyectos
- `POST /api/projects` - Crear proyecto
- `GET /api/projects/:id` - Obtener proyecto
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### Componentes
- `GET /api/components` - Listar componentes
- `POST /api/components` - Crear componente
- `GET /api/components/:id` - Obtener componente
- `PUT /api/components/:id` - Actualizar componente
- `DELETE /api/components/:id` - Eliminar componente

### Deployments
- `POST /api/deployments/vercel` - Deploy a Vercel
- `GET /api/deployments/:id/status` - Estado del deployment

### WebSocket (Colaboración)
- `connection` - Conectar a sala de colaboración
- `join-room` - Unirse a proyecto
- `leave-room` - Salir de proyecto
- `sync-update` - Sincronizar cambios (Yjs)
- `cursor-move` - Actualizar posición del cursor
- `user-joined` - Notificar nuevo usuario
- `user-left` - Notificar usuario desconectado

## Estructura de archivos
```
v8-backend-nodejs-fullstack/
├── api/
│   ├── projects.js         # Rutas de proyectos
│   ├── components.js       # Rutas de componentes
│   └── deployments.js      # Rutas de deployments
├── auth/
│   └── config.js           # Configuración Better Auth
├── collaboration/
│   ├── socketServer.js     # Servidor WebSocket
│   └── yjs-handler.js      # Manejo de Yjs CRDT
├── db/
│   ├── client.js           # Cliente Drizzle
│   ├── schema.js           # Schema de base de datos
│   └── migrations/         # Migraciones
├── tests/
│   ├── auth.test.js        # Tests de autenticación
│   ├── projects.test.js    # Tests de proyectos
│   └── collaboration.test.js # Tests de colaboración
├── utils/
│   ├── logger.js           # Logger
│   └── validators.js       # Validadores
├── server.js               # Entry point
├── drizzle.config.js       # Config Drizzle
├── package.json
├── .env.example
└── README.md
```

## Puertos
- **API + WebSocket**: 3001

## Estado
✅ **PRODUCCIÓN** - Backend completo con colaboración en tiempo real

## Casos de uso
- Backend moderno con OAuth
- Colaboración en tiempo real entre usuarios
- Edición simultánea de proyectos
- Autenticación social (Google, GitHub)
- Deploy automatizado a Vercel

## Colaboración en tiempo real

### Características
- Edición simultánea de múltiples usuarios
- Sincronización automática con Yjs CRDT
- Cursores en tiempo real
- Presencia de usuarios
- Resolución automática de conflictos
- Historial de cambios

### Uso
```javascript
// Cliente conecta al WebSocket
const socket = io('http://localhost:3001');

// Unirse a proyecto
socket.emit('join-room', { projectId: '123', userId: 'user-1' });

// Escuchar actualizaciones
socket.on('sync-update', (update) => {
  // Aplicar cambios con Yjs
  Y.applyUpdate(ydoc, update);
});

// Enviar cambios
ydoc.on('update', (update) => {
  socket.emit('sync-update', { projectId: '123', update });
});
```

## Deploy

### Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Configurar variables de entorno en Vercel dashboard
# DATABASE_URL, BETTER_AUTH_SECRET, etc.
```

### Railway
```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up

# Agregar PostgreSQL
railway add postgresql
```

### Docker
```bash
# Build
docker build -t dragndrop-backend .

# Run
docker run -p 3001:3001 --env-file .env dragndrop-backend
```

## Testing
```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch

# Tests específicos
npm test -- auth.test.js
```

## Monitoreo

### Stats del servidor
```bash
# GET /api/stats
curl http://localhost:3001/api/stats
```

Respuesta:
```json
{
  "uptime": 3600,
  "connections": 5,
  "rooms": 3,
  "memory": {
    "heapUsed": 50000000,
    "heapTotal": 100000000
  }
}
```

## Seguridad
- ✅ Helmet para headers de seguridad
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configurado
- ✅ Validación de inputs
- ✅ Sanitización de datos
- ✅ Sesiones seguras con Better Auth
- ✅ OAuth con proveedores confiables

## Performance
- ✅ Compresión gzip
- ✅ Caché de respuestas
- ✅ Connection pooling (PostgreSQL)
- ✅ WebSocket eficiente con Socket.io
- ✅ CRDT para sincronización optimizada

## Próximos pasos
- Agregar más proveedores OAuth (Discord, Twitter)
- Implementar notificaciones push
- Agregar analytics de colaboración
- Implementar versionado de proyectos
- Agregar comentarios en tiempo real
- Implementar chat entre colaboradores
- Agregar permisos granulares
