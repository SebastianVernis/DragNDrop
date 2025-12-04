/**
 * Authentication Middleware
 * 
 * Protects routes and validates sessions
 */

import { auth } from './config.js';

/**
 * Require authentication middleware
 * Validates session and attaches user to request
 */
export async function requireAuth(req, res, next) {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    // Attach user and session to request
    req.user = session.user;
    req.session = session.session;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired session',
    });
  }
}

/**
 * Optional authentication middleware
 * Attaches user if authenticated, but doesn't require it
 */
export async function optionalAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (session) {
      req.user = session.user;
      req.session = session.session;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}

/**
 * Check if user owns resource
 */
export function requireOwnership(resourceUserIdField = 'userId') {
  return (req, res, next) => {
    const resourceUserId = req.resource?.[resourceUserIdField];
    
    if (!resourceUserId) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Resource ownership check failed',
      });
    }

    if (resourceUserId !== req.user.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to access this resource',
      });
    }

    next();
  };
}

/**
 * Rate limiting middleware
 */
export function rateLimit(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // 100 requests per window
    message = 'Too many requests, please try again later',
  } = options;

  const requests = new Map();

  return (req, res, next) => {
    const key = req.user?.id || req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [k, timestamps] of requests.entries()) {
      const filtered = timestamps.filter(t => t > windowStart);
      if (filtered.length === 0) {
        requests.delete(k);
      } else {
        requests.set(k, filtered);
      }
    }

    // Check rate limit
    const userRequests = requests.get(key) || [];
    const recentRequests = userRequests.filter(t => t > windowStart);

    if (recentRequests.length >= max) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message,
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000),
      });
    }

    // Add current request
    recentRequests.push(now);
    requests.set(key, recentRequests);

    next();
  };
}

export default {
  requireAuth,
  optionalAuth,
  requireOwnership,
  rateLimit,
};
