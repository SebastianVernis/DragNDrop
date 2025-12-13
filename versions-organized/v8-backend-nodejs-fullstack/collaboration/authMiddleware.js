/**
 * Authentication Middleware for Socket.io
 * 
 * Verifies JWT tokens and authenticates WebSocket connections
 */

import { auth } from '../auth/config.js';

/**
 * Authenticate Socket.io connection
 * @param {Object} socket - Socket.io socket instance
 * @param {Function} next - Next middleware function
 */
export async function authenticateSocket(socket, next) {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    // Verify token using Better Auth
    // Note: Better Auth handles session verification internally
    // We'll extract user info from the token
    const session = await verifySessionToken(token);
    
    if (!session || !session.user) {
      return next(new Error('Invalid or expired token'));
    }

    // Attach user info to socket
    socket.userId = session.user.id;
    socket.userName = session.user.name || session.user.email;
    socket.userEmail = session.user.email;
    
    console.log(`✅ User authenticated: ${socket.userName} (${socket.userId})`);
    next();
  } catch (error) {
    console.error('❌ Socket authentication error:', error.message);
    next(new Error('Authentication failed'));
  }
}

/**
 * Verify session token
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Session object with user info
 */
async function verifySessionToken(token) {
  try {
    // For Better Auth, we need to verify the session
    // This is a simplified version - in production, use Better Auth's session verification
    
    // Parse the token (Better Auth uses session tokens)
    // For now, we'll create a mock verification
    // TODO: Integrate with Better Auth's actual session verification
    
    // Temporary mock for development
    if (token && token.length > 10) {
      return {
        user: {
          id: 'user-' + Math.random().toString(36).substr(2, 9),
          name: 'Test User',
          email: 'test@example.com'
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Rate limiting middleware for Socket.io
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 */
export function createRateLimiter(maxRequests = 100, windowMs = 1000) {
  const requests = new Map();
  
  return (socket, next) => {
    const userId = socket.userId;
    const now = Date.now();
    
    if (!requests.has(userId)) {
      requests.set(userId, []);
    }
    
    const userRequests = requests.get(userId);
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return next(new Error('Rate limit exceeded'));
    }
    
    validRequests.push(now);
    requests.set(userId, validRequests);
    
    next();
  };
}

/**
 * Authorization middleware - check user permissions for a project
 * @param {string} projectId - Project ID
 * @param {string} requiredPermission - Required permission level
 */
export async function authorizeProjectAccess(socket, projectId, requiredPermission = 'read') {
  try {
    // TODO: Implement actual permission checking from database
    // For now, allow all authenticated users
    
    const userId = socket.userId;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Mock permission check
    // In production, query the database for user permissions
    const hasPermission = true; // await checkUserPermission(userId, projectId, requiredPermission);
    
    if (!hasPermission) {
      throw new Error('Insufficient permissions');
    }
    
    return true;
  } catch (error) {
    console.error('Authorization error:', error.message);
    return false;
  }
}

export default {
  authenticateSocket,
  createRateLimiter,
  authorizeProjectAccess
};
