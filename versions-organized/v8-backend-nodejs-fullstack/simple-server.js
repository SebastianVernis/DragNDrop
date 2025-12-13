import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const PORT = process.env.PORT || 8084;
const app = express();
const server = http.createServer(app);

// Socket.IO para colaboración en tiempo real
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middlewares
app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json());
app.use(express.static('public'));

// Base de datos en memoria para demo
let projects = [];
let components = [];
let users = [];
let rooms = new Map(); // Para colaboración tiempo real

// Utilidad para generar IDs
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Rutas principales
app.get('/', (req, res) => {
    res.json({
        message: '🚀 DragNDrop Backend v8 - NodeJS Fullstack',
        version: '8.0.0',
        status: 'active',
        features: [
            'Express API',
            'Socket.io real-time collaboration',
            'CORS enabled',
            'In-memory database'
        ],
        endpoints: {
            projects: '/api/projects',
            components: '/api/components', 
            users: '/api/users',
            rooms: '/api/rooms',
            websocket: 'ws://localhost:' + PORT
        }
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        version: '8.0.0',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        connections: io.engine.clientsCount
    });
});

// API Routes - Proyectos
app.get('/api/projects', (req, res) => {
    res.json(projects);
});

app.post('/api/projects', (req, res) => {
    const project = {
        id: generateId(),
        name: req.body.name || 'Nuevo Proyecto',
        description: req.body.description || '',
        components: req.body.components || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    projects.push(project);
    
    // Notificar a todos los clientes conectados
    io.emit('project:created', project);
    
    res.status(201).json(project);
});

app.get('/api/projects/:id', (req, res) => {
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
        return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.json(project);
});

app.put('/api/projects/:id', (req, res) => {
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    
    projects[index] = {
        ...projects[index],
        ...req.body,
        updatedAt: new Date().toISOString()
    };
    
    // Notificar cambios en tiempo real
    io.to(`project:${req.params.id}`).emit('project:updated', projects[index]);
    
    res.json(projects[index]);
});

app.delete('/api/projects/:id', (req, res) => {
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    
    const deleted = projects.splice(index, 1)[0];
    
    // Notificar eliminación
    io.emit('project:deleted', { id: req.params.id });
    
    res.json({ message: 'Proyecto eliminado', project: deleted });
});

// API Routes - Componentes
app.get('/api/components', (req, res) => {
    res.json(components);
});

app.post('/api/components', (req, res) => {
    const component = {
        id: generateId(),
        name: req.body.name || 'Nuevo Componente',
        type: req.body.type || 'div',
        properties: req.body.properties || {},
        position: req.body.position || { x: 0, y: 0 },
        projectId: req.body.projectId,
        createdAt: new Date().toISOString()
    };
    
    components.push(component);
    
    // Notificar en tiempo real si está asociado a un proyecto
    if (component.projectId) {
        io.to(`project:${component.projectId}`).emit('component:created', component);
    }
    
    res.status(201).json(component);
});

app.put('/api/components/:id', (req, res) => {
    const index = components.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Componente no encontrado' });
    }
    
    const oldComponent = components[index];
    components[index] = {
        ...oldComponent,
        ...req.body,
        updatedAt: new Date().toISOString()
    };
    
    // Notificar cambios en tiempo real
    if (components[index].projectId) {
        io.to(`project:${components[index].projectId}`).emit('component:updated', components[index]);
    }
    
    res.json(components[index]);
});

// API Routes - Usuarios
app.get('/api/users', (req, res) => {
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const user = {
        id: generateId(),
        username: req.body.username || 'usuario',
        email: req.body.email || '',
        createdAt: new Date().toISOString()
    };
    
    users.push(user);
    res.status(201).json(user);
});

// API Routes - Salas de colaboración
app.get('/api/rooms', (req, res) => {
    const roomsArray = Array.from(rooms.entries()).map(([id, room]) => ({
        id,
        name: room.name,
        users: room.users.length,
        projectId: room.projectId,
        createdAt: room.createdAt
    }));
    
    res.json(roomsArray);
});

// Datos de demostración
app.post('/api/seed-data', (req, res) => {
    // Limpiar datos
    projects = [];
    components = [];
    users = [];
    
    // Crear usuarios demo
    users.push(
        {
            id: 'user1',
            username: 'admin',
            email: 'admin@dragndrop.demo',
            createdAt: new Date().toISOString()
        },
        {
            id: 'user2', 
            username: 'developer',
            email: 'dev@dragndrop.demo',
            createdAt: new Date().toISOString()
        }
    );
    
    // Crear componentes demo
    components.push(
        {
            id: 'comp1',
            name: 'Header Principal',
            type: 'header',
            properties: { text: 'Mi Website', color: '#333', fontSize: '2em' },
            position: { x: 0, y: 0 },
            projectId: 'proj1',
            createdAt: new Date().toISOString()
        },
        {
            id: 'comp2',
            name: 'Botón CTA',
            type: 'button',
            properties: { text: 'Comenzar', color: '#007bff', padding: '10px 20px' },
            position: { x: 100, y: 150 },
            projectId: 'proj1',
            createdAt: new Date().toISOString()
        }
    );
    
    // Crear proyecto demo
    projects.push({
        id: 'proj1',
        name: 'Proyecto Colaborativo Demo',
        description: 'Demostración de colaboración en tiempo real con Socket.io',
        components: ['comp1', 'comp2'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    
    res.json({
        message: 'Datos de demostración creados',
        users: users.length,
        components: components.length,
        projects: projects.length
    });
});

// Socket.io - Colaboración en tiempo real
io.on('connection', (socket) => {
    console.log(`👤 Usuario conectado: ${socket.id}`);
    
    // Unirse a una sala de proyecto
    socket.on('join:project', (projectId, username) => {
        const roomId = `project:${projectId}`;
        socket.join(roomId);
        
        // Actualizar información de la sala
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                name: `Proyecto ${projectId}`,
                projectId: projectId,
                users: [],
                createdAt: new Date().toISOString()
            });
        }
        
        const room = rooms.get(roomId);
        const userInfo = { socketId: socket.id, username: username || `Usuario-${socket.id.slice(0, 6)}` };
        room.users.push(userInfo);
        
        // Notificar a otros usuarios en la sala
        socket.to(roomId).emit('user:joined', userInfo);
        socket.emit('room:info', room);
        
        console.log(`👤 ${userInfo.username} se unió al proyecto ${projectId}`);
    });
    
    // Sincronización de cambios en tiempo real
    socket.on('component:move', (data) => {
        const { projectId, componentId, position } = data;
        
        // Actualizar componente en memoria
        const componentIndex = components.findIndex(c => c.id === componentId);
        if (componentIndex !== -1) {
            components[componentIndex].position = position;
        }
        
        // Broadcast a otros usuarios en el proyecto
        socket.to(`project:${projectId}`).emit('component:moved', data);
    });
    
    socket.on('component:update', (data) => {
        const { projectId, component } = data;
        
        // Actualizar en memoria
        const componentIndex = components.findIndex(c => c.id === component.id);
        if (componentIndex !== -1) {
            components[componentIndex] = { ...components[componentIndex], ...component };
        }
        
        // Broadcast cambios
        socket.to(`project:${projectId}`).emit('component:updated', component);
    });
    
    // Cursor sharing para colaboración visual
    socket.on('cursor:move', (data) => {
        const { projectId, position, username } = data;
        socket.to(`project:${projectId}`).emit('cursor:update', {
            socketId: socket.id,
            position,
            username
        });
    });
    
    // Desconexión
    socket.on('disconnect', () => {
        console.log(`👤 Usuario desconectado: ${socket.id}`);
        
        // Remover usuario de todas las salas
        for (const [roomId, room] of rooms.entries()) {
            const userIndex = room.users.findIndex(u => u.socketId === socket.id);
            if (userIndex !== -1) {
                const user = room.users.splice(userIndex, 1)[0];
                socket.to(roomId).emit('user:left', user);
                
                // Eliminar sala si está vacía
                if (room.users.length === 0) {
                    rooms.delete(roomId);
                }
            }
        }
    });
});

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 DragNDrop Backend v8 ejecutándose en:`);
    console.log(`   HTTP: http://localhost:${PORT}`);
    console.log(`   WebSocket: ws://localhost:${PORT}`);
    console.log(`📊 API disponible en: http://localhost:${PORT}/api/`);
    console.log(`🔄 Colaboración tiempo real habilitada`);
});