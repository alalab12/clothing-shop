/**
 * Validation Middleware
 * 
 * Validates request data before passing to controllers
 * 
 * Pattern: Application-level middleware for input validation
 * Reference: 05-ModernBackEnd.pdf & 06-Nodejs.pdf - Middlewares
 */

/**
 * Validates required fields in request body
 * @param {Array} fields - Array of required field names
 * @returns {Function} Middleware function
 */
const validateRequired = (fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter(field => !req.body[field])
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      })
    }
    next()
  }
}

/**
 * Validates email format
 */
const validateEmail = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (req.body.email && !emailRegex.test(req.body.email)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }
  next()
}

/**
 * Validates password strength
 * Minimum 8 characters required
 */
const validatePassword = (req, res, next) => {
  if (req.body.password && req.body.password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' })
  }
  next()
}

/**
 * Validates phone format (international)
 * Optional field - only validates if provided
 */
const validatePhone = (req, res, next) => {
  if (req.body.phone && req.body.phone.trim() !== '') {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,5}[-\s.]?[0-9]{1,5}$/
    if (!phoneRegex.test(req.body.phone.trim())) {
      return res.status(400).json({ error: 'Invalid phone number format' })
    }
  }
  next()
}

module.exports = {
  validateRequired,
  validateEmail,
  validatePassword,
  validatePhone
}
