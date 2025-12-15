
// Validation middleware - validates request data

// Check for required fields in request body
const validateRequired = (fields) => {
  return (req, res, next) => {
    // Find missing required fields
    const missingFields = fields.filter(field => !req.body[field])
    // Return error if any fields are missing
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      })
    }
    next()
  }
}

// Validate email format is valid
const validateEmail = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Email pattern
  if (req.body.email && !emailRegex.test(req.body.email)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }
  next()
}

// Validate password meets minimum length requirement
// Minimum 8 characters required
const validatePassword = (req, res, next) => {
  if (req.body.password && req.body.password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' })
  }
  next()
}

// Validate phone format (international format)
// Optional field - only validates if provided
const validatePhone = (req, res, next) => {
  if (req.body.phone && req.body.phone.trim() !== '') {
    // International phone regex pattern
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,5}[-\s.]?[0-9]{1,5}$/
    if (!phoneRegex.test(req.body.phone.trim())) {
      return res.status(400).json({ error: 'Invalid phone number format' })
    }
  }
  next()
}

// Export all validation middleware
module.exports = {
  validateRequired,
  validateEmail,
  validatePassword,
  validatePhone
}
