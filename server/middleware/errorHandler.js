
 
// Error handling middleware for Express.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)


  // Default error response
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'

  // Send JSON error response
  res.status(status).json({
    error: message,
    status,
    timestamp: new Date().toISOString()//Add timestamp for easier debugging
  })
}

//Export error handler middleware
module.exports = {
  errorHandler
}
