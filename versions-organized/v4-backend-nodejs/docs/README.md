# Versión 4: Backend Node.js (Express + Better Auth)

## Descripción
Backend completo con Express.js, Better Auth para autenticación OAuth, y Socket.io para colaboración en tiempo real.

## Tecnologías
- **Express.js**: Framework web para Node.js
- **Better Auth**: Sistema de autenticación moderno
- **Socket.io**: WebSocket para tiempo real
- **PostgreSQL**: Base de datos (vía Supabase)
- **OAuth**: Google, GitHub authentication

## Características
- ✅ API REST completa
- ✅ Autenticación con Better Auth
- ✅ OAuth (Google, GitHub)
- ✅ WebSocket para colaboración en tiempo real
- ✅ CRUD de proyectos
- ✅ CRUD de componentes
- ✅ Deploy a Vercel
- ✅ Rate limiting
- ✅ CORS configurado

## Cómo ejecutar

### Instalación
```bash
cd /home/admin/DragNDrop/versions/v4-backend-nodejs
npm install
```

### Configuración
```bash
# Crear archivo .env
cp .env.example .env
nano .env
```

### Ejecutar
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## Puertos
- **API**: 3001
- **WebSocket**: 3001

## Estado
✅ **PRODUCCIÓN** - Backend completo con colaboración en tiempo real
