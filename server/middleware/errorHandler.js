/**
 * Global Error Handling Middleware
 * 
 * Catches all errors from route handlers and returns consistent error responses
 * 
 * Pattern: Express error-handling middleware (4 parameters: err, req, res, next)
 * Reference: 05-ModernBackEnd.pdf & 06-Nodejs.pdf - Error-handling middleware
 */

/**
 * Centralized error handler
 * Must be the last middleware registered
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Default error response
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'

  res.status(status).json({
    error: message,
    status,
    timestamp: new Date().toISOString()
  })
}

module.exports = {
  errorHandler
}
