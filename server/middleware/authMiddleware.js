// Authentication middleware to protect routes
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
