
// Auth API routes
// Defines API endpoints for authentication operations

const express = require('express') // Express framework
const router = express.Router() // Router instance
const authController = require('../controllers/authController') // Auth handler
const { validateRequired, validateEmail, validatePassword, validatePhone } = require('../middleware/validationMiddleware') // Validation

// Register new user - POST /api/auth/register
router.post('/register',
  validateRequired(['email', 'password', 'firstName', 'lastName']),
  validateEmail,
  validatePassword,
  validatePhone,
  authController.register
)

// Login user - POST /api/auth/login
router.post('/login',
  validateRequired(['email', 'password']),
  authController.login
)

// Logout user - POST /api/auth/logout
router.post('/logout', authController.logout)

// Check session status - GET /api/auth/session
router.get('/session', authController.getSession)

// Export the router
module.exports = router
