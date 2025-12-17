// Admin middleware - verifies user is admin

const authService = require('../services/authService')

// Check if user is authenticated and has admin role
const requireAdmin = async (req, res, next) => {
  // Check if user is logged in
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    // Get user from database
    const user = await authService.getUserById(req.session.userId)
    
    // Check if user has admin role
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    
    // Attach user to request for use in controllers
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid session' })
  }
}

module.exports = {
  requireAdmin
}
