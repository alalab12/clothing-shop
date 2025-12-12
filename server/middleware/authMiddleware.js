/**
 * Authentication Middleware
 * 
 * Implements stateful authentication using express-session.
 * Validates that user sessions are active and valid.
 * 
 * Pattern: Express middleware for route protection
 * Reference: 07-Authentication and database.pdf - Stateful Authentication Flow
 */

/**
 * Middleware to require user authentication
 * Checks if req.session.userId exists (indicates authenticated session)
 * Returns 401 Unauthorized if not authenticated
 */
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  next()
}

/**
 * Middleware to optionally load user info without requiring auth
 * Passes user info if authenticated, otherwise continues
 */
const optionalAuth = (req, res, next) => {
  if (req.session.userId) {
    req.userId = req.session.userId
  }
  next()
}

module.exports = {
  requireAuth,
  optionalAuth
}
