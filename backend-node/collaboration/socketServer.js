/**
 * Socket.io Server for Real-Time Collaboration
 * 
 * Handles WebSocket connections, room management, and real-time events
 */

import { Server } from 'socket.io';
import { authenticateSocket, createRateLimiter, authorizeProjectAccess } from './authMiddleware.js';
import roomManager from './roomManager.js';

/**
 * Initialize Socket.io server
 * @param {Object} httpServer - HTTP server instance
 * @param {Object} options - Configuration options
 * @returns {Object} Socket.io server instance
 */
export function initializeSocketServer(httpServer, options = {}) {
  const {
    corsOrigin = process.env.FRONTEND_URL || 'http://localhost:8080',
    path = '/socket.io',
    pingTimeout = 60000,
    pingInterval = 25000
  } = options;

  // Create Socket.io server
  const io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true
    },
    path,
    pingTimeout,
    pingInterval,
    transports: ['websocket', 'polling'],
    allowEIO3: true
  });

  console.log('🚀 Socket.io server initialized');

  // Apply authentication middleware
  io.use(authenticateSocket);

  // Apply rate limiting
  const rateLimiter = createRateLimiter(100, 1000); // 100 ops per second
  io.use(rateLimiter);

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id} (User: ${socket.userName})`);

    // Setup event handlers
    setupEventHandlers(io, socket);

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      handleDisconnect(io, socket, reason);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`❌ Socket error for ${socket.id}:`, error.message);
    });
  });

  // Room manager event listeners
  setupRoomManagerListeners(io);

  return io;
}

/**
 * Setup event handlers for a socket
 * @param {Object} io - Socket.io server instance
 * @param {Object} socket - Socket instance
 */
function setupEventHandlers(io, socket) {
  // Join room
  socket.on('join-room', async (data, callback) => {
    try {
      const { projectId, userData } = data;

      if (!projectId) {
        throw new Error('Project ID is required');
      }

      // Check authorization
      const authorized = await authorizeProjectAccess(socket, projectId, 'read');
      
      if (!authorized) {
        throw new Error('Not authorized to access this project');
      }

      // Join the room
      const { room, user } = roomManager.joinRoom(projectId, socket, {
        userId: socket.userId,
        userName: socket.userName,
        userEmail: socket.userEmail,
        ...userData
      });

      // Send success response
      const response = {
        success: true,
        projectId,
        user,
        users: room.getUsers(),
        userCount: room.getUserCount()
      };

      if (callback) callback(response);

      // Broadcast to other users in the room
      socket.to(projectId).emit('user-joined', {
        user,
        userCount: room.getUserCount()
      });

      console.log(`✅ User ${user.userName} joined room ${projectId}`);
    } catch (error) {
      console.error('Error joining room:', error.message);
      
      if (callback) {
        callback({
          success: false,
          error: error.message
        });
      }
    }
  });

  // Leave room
  socket.on('leave-room', (data, callback) => {
    try {
      const roomInfo = roomManager.leaveRoom(socket);

      if (roomInfo) {
        const { projectId } = roomInfo;
        const room = roomManager.getRoom(projectId);

        // Broadcast to other users
        socket.to(projectId).emit('user-left', {
          userId: socket.userId,
          userCount: room ? room.getUserCount() : 0
        });

        if (callback) {
          callback({
            success: true,
            projectId
          });
        }
      } else {
        if (callback) {
          callback({
            success: false,
            error: 'Not in any room'
          });
        }
      }
    } catch (error) {
      console.error('Error leaving room:', error.message);
      
      if (callback) {
        callback({
          success: false,
          error: error.message
        });
      }
    }
  });

  // Cursor move
  socket.on('cursor-move', (data) => {
    try {
      const roomInfo = roomManager.getRoomForSocket(socket);
      
      if (!roomInfo) return;

      const { projectId } = roomInfo;
      const room = roomManager.getRoom(projectId);

      if (room) {
        room.updateUser(socket.id, {
          cursor: {
            x: data.x,
            y: data.y,
            visible: data.visible !== false
          }
        });

        // Broadcast to other users (excluding sender)
        socket.to(projectId).emit('cursor-update', {
          userId: socket.userId,
          userName: socket.userName,
          cursor: {
            x: data.x,
            y: data.y,
            visible: data.visible !== false
          }
        });
      }
    } catch (error) {
      console.error('Error handling cursor move:', error.message);
    }
  });

  // Element selection
  socket.on('element-select', (data) => {
    try {
      const roomInfo = roomManager.getRoomForSocket(socket);
      
      if (!roomInfo) return;

      const { projectId } = roomInfo;
      const room = roomManager.getRoom(projectId);

      if (room) {
        room.updateUser(socket.id, {
          selectedElements: data.elementIds || []
        });

        // Broadcast to other users
        socket.to(projectId).emit('selection-update', {
          userId: socket.userId,
          userName: socket.userName,
          elementIds: data.elementIds || []
        });
      }
    } catch (error) {
      console.error('Error handling element selection:', error.message);
    }
  });

  // User action (generic action broadcast)
  socket.on('user-action', (data) => {
    try {
      const roomInfo = roomManager.getRoomForSocket(socket);
      
      if (!roomInfo) return;

      const { projectId } = roomInfo;

      // Broadcast action to other users
      socket.to(projectId).emit('user-action', {
        userId: socket.userId,
        userName: socket.userName,
        action: data.action,
        data: data.data,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error handling user action:', error.message);
    }
  });

  // Get room info
  socket.on('get-room-info', (data, callback) => {
    try {
      const { projectId } = data;
      const room = roomManager.getRoom(projectId);

      if (room) {
        callback({
          success: true,
          room: room.getInfo()
        });
      } else {
        callback({
          success: false,
          error: 'Room not found'
        });
      }
    } catch (error) {
      console.error('Error getting room info:', error.message);
      
      if (callback) {
        callback({
          success: false,
          error: error.message
        });
      }
    }
  });

  // Ping/pong for connection health
  socket.on('ping', (callback) => {
    if (callback) callback({ pong: true, timestamp: Date.now() });
  });
}

/**
 * Handle socket disconnection
 * @param {Object} io - Socket.io server instance
 * @param {Object} socket - Socket instance
 * @param {string} reason - Disconnect reason
 */
function handleDisconnect(io, socket, reason) {
  console.log(`🔌 Client disconnected: ${socket.id} (Reason: ${reason})`);

  const roomInfo = roomManager.leaveRoom(socket);

  if (roomInfo) {
    const { projectId } = roomInfo;
    const room = roomManager.getRoom(projectId);

    // Notify other users
    io.to(projectId).emit('user-left', {
      userId: socket.userId,
      userName: socket.userName,
      userCount: room ? room.getUserCount() : 0
    });
  }
}

/**
 * Setup room manager event listeners
 * @param {Object} io - Socket.io server instance
 */
function setupRoomManagerListeners(io) {
  roomManager.on('room:created', ({ projectId, room }) => {
    console.log(`📦 Room created: ${projectId}`);
  });

  roomManager.on('room:removed', ({ projectId, room }) => {
    console.log(`🗑️  Room removed: ${projectId}`);
  });

  roomManager.on('user:joined', ({ projectId, user, room }) => {
    // Additional logic when user joins
  });

  roomManager.on('user:left', ({ projectId, user, room }) => {
    // Additional logic when user leaves
  });
}

/**
 * Get Socket.io server statistics
 * @param {Object} io - Socket.io server instance
 * @returns {Object} Statistics
 */
export function getServerStats(io) {
  const sockets = io.sockets.sockets;
  const roomStats = roomManager.getStats();

  return {
    connectedSockets: sockets.size,
    ...roomStats,
    timestamp: Date.now()
  };
}

export default {
  initializeSocketServer,
  getServerStats
};
