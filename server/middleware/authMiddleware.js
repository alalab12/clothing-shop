// Auth middleware - validates user sessions

// Check if user is logged in (has session ID)
// Used on protected routes that require authentication
const requireAuth = (req, res, next) => {
  // Return error if user is not logged in
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  // Continue to next handler
  next()
}

module.exports = {
  requireAuth
}
