/**
 * Room Manager for Collaborative Editing
 * 
 * Manages project rooms, user connections, and room lifecycle
 */

import { EventEmitter } from 'events';

class RoomManager extends EventEmitter {
  constructor() {
    super();
    
    // Map of projectId -> Room
    this.rooms = new Map();
    
    // Map of socketId -> { projectId, userId }
    this.socketToRoom = new Map();
    
    // Cleanup interval (every 5 minutes)
    this.cleanupInterval = setInterval(() => this.cleanupEmptyRooms(), 5 * 60 * 1000);
  }

  /**
   * Create or get a room for a project
   * @param {string} projectId - Project ID
   * @returns {Room} Room instance
   */
  getOrCreateRoom(projectId) {
    if (!this.rooms.has(projectId)) {
      const room = new Room(projectId);
      this.rooms.set(projectId, room);
      console.log(`📦 Created room for project: ${projectId}`);
      this.emit('room:created', { projectId, room });
    }
    
    return this.rooms.get(projectId);
  }

  /**
   * Get a room by project ID
   * @param {string} projectId - Project ID
   * @returns {Room|null} Room instance or null
   */
  getRoom(projectId) {
    return this.rooms.get(projectId) || null;
  }

  /**
   * Add user to a room
   * @param {string} projectId - Project ID
   * @param {Object} socket - Socket.io socket
   * @param {Object} userData - User data
   */
  joinRoom(projectId, socket, userData) {
    const room = this.getOrCreateRoom(projectId);
    
    const user = {
      socketId: socket.id,
      userId: userData.userId || socket.userId,
      userName: userData.userName || socket.userName,
      userEmail: userData.userEmail || socket.userEmail,
      color: userData.color || this.generateUserColor(),
      joinedAt: Date.now()
    };
    
    room.addUser(user);
    this.socketToRoom.set(socket.id, { projectId, userId: user.userId });
    
    // Join Socket.io room
    socket.join(projectId);
    
    console.log(`👤 User ${user.userName} joined room ${projectId}`);
    this.emit('user:joined', { projectId, user, room });
    
    return { room, user };
  }

  /**
   * Remove user from a room
   * @param {Object} socket - Socket.io socket
   */
  leaveRoom(socket) {
    const roomInfo = this.socketToRoom.get(socket.id);
    
    if (!roomInfo) {
      return null;
    }
    
    const { projectId, userId } = roomInfo;
    const room = this.getRoom(projectId);
    
    if (room) {
      const user = room.removeUser(socket.id);
      
      if (user) {
        console.log(`👋 User ${user.userName} left room ${projectId}`);
        this.emit('user:left', { projectId, user, room });
      }
      
      // Leave Socket.io room
      socket.leave(projectId);
      
      // Cleanup empty room
      if (room.getUserCount() === 0) {
        this.removeRoom(projectId);
      }
    }
    
    this.socketToRoom.delete(socket.id);
    
    return roomInfo;
  }

  /**
   * Get room info for a socket
   * @param {Object} socket - Socket.io socket
   * @returns {Object|null} Room info
   */
  getRoomForSocket(socket) {
    return this.socketToRoom.get(socket.id) || null;
  }

  /**
   * Remove a room
   * @param {string} projectId - Project ID
   */
  removeRoom(projectId) {
    const room = this.rooms.get(projectId);
    
    if (room) {
      console.log(`🗑️  Removed empty room: ${projectId}`);
      this.emit('room:removed', { projectId, room });
      this.rooms.delete(projectId);
    }
  }

  /**
   * Cleanup empty rooms
   */
  cleanupEmptyRooms() {
    const emptyRooms = [];
    
    for (const [projectId, room] of this.rooms.entries()) {
      if (room.getUserCount() === 0) {
        emptyRooms.push(projectId);
      }
    }
    
    emptyRooms.forEach(projectId => this.removeRoom(projectId));
    
    if (emptyRooms.length > 0) {
      console.log(`🧹 Cleaned up ${emptyRooms.length} empty rooms`);
    }
  }

  /**
   * Generate a random color for a user
   * @returns {string} Hex color
   */
  generateUserColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
      '#FF8FA3', '#6C5CE7', '#00B894', '#FDCB6E', '#E17055'
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Get all active rooms
   * @returns {Array} Array of room info
   */
  getAllRooms() {
    return Array.from(this.rooms.entries()).map(([projectId, room]) => ({
      projectId,
      userCount: room.getUserCount(),
      users: room.getUsers()
    }));
  }

  /**
   * Get statistics
   * @returns {Object} Statistics
   */
  getStats() {
    const totalUsers = Array.from(this.rooms.values())
      .reduce((sum, room) => sum + room.getUserCount(), 0);
    
    return {
      totalRooms: this.rooms.size,
      totalUsers,
      rooms: this.getAllRooms()
    };
  }

  /**
   * Destroy the room manager
   */
  destroy() {
    clearInterval(this.cleanupInterval);
    this.rooms.clear();
    this.socketToRoom.clear();
    this.removeAllListeners();
  }
}

/**
 * Room class representing a collaborative project session
 */
class Room {
  constructor(projectId) {
    this.projectId = projectId;
    this.users = new Map(); // socketId -> user
    this.createdAt = Date.now();
    this.lastActivity = Date.now();
  }

  /**
   * Add user to room
   * @param {Object} user - User data
   */
  addUser(user) {
    this.users.set(user.socketId, user);
    this.lastActivity = Date.now();
  }

  /**
   * Remove user from room
   * @param {string} socketId - Socket ID
   * @returns {Object|null} Removed user
   */
  removeUser(socketId) {
    const user = this.users.get(socketId);
    this.users.delete(socketId);
    this.lastActivity = Date.now();
    return user || null;
  }

  /**
   * Get user by socket ID
   * @param {string} socketId - Socket ID
   * @returns {Object|null} User data
   */
  getUser(socketId) {
    return this.users.get(socketId) || null;
  }

  /**
   * Get all users in room
   * @returns {Array} Array of users
   */
  getUsers() {
    return Array.from(this.users.values());
  }

  /**
   * Get user count
   * @returns {number} Number of users
   */
  getUserCount() {
    return this.users.size;
  }

  /**
   * Check if user is in room
   * @param {string} socketId - Socket ID
   * @returns {boolean} True if user is in room
   */
  hasUser(socketId) {
    return this.users.has(socketId);
  }

  /**
   * Update user data
   * @param {string} socketId - Socket ID
   * @param {Object} updates - Updates to apply
   */
  updateUser(socketId, updates) {
    const user = this.users.get(socketId);
    
    if (user) {
      Object.assign(user, updates);
      this.lastActivity = Date.now();
    }
  }

  /**
   * Get room info
   * @returns {Object} Room information
   */
  getInfo() {
    return {
      projectId: this.projectId,
      userCount: this.getUserCount(),
      users: this.getUsers(),
      createdAt: this.createdAt,
      lastActivity: this.lastActivity
    };
  }
}

// Export singleton instance
export const roomManager = new RoomManager();

// Export classes for testing
export { RoomManager, Room };

export default roomManager;
