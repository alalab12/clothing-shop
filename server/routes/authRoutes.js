/**
 * Authentication Routes
 * 
 * Defines API endpoints for authentication operations
 * Pattern: Express router for modular route organization
 */

const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { validateRequired, validateEmail, validatePassword, validatePhone } = require('../middleware/validationMiddleware')

/**
 * POST /api/auth/register
 * Register a new user
 * Body: { email, password, firstName, lastName, phone? }
 */
router.post('/register',
  validateRequired(['email', 'password', 'firstName', 'lastName']),
  validateEmail,
  validatePassword,
  validatePhone,
  authController.register
)

/**
 * POST /api/auth/login
 * Login user
 * Body: { email, password }
 */
router.post('/login',
  validateRequired(['email', 'password']),
  authController.login
)

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', authController.logout)

/**
 * GET /api/auth/session
 * Check authentication status
 */
router.get('/session', authController.getSession)

module.exports = router
