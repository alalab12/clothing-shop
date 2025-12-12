/**
 * Contact Routes
 * 
 * Defines API endpoints for contact form operations
 */

const express = require('express')
const router = express.Router()
const contactController = require('../controllers/contactController')
const { validateRequired } = require('../middleware/validationMiddleware')

/**
 * POST /api/contact
 * Save contact message
 * Body: { email, message }
 * Public route: No authentication required
 */
router.post('/',
  validateRequired(['email', 'message']),
  contactController.saveContactMessage
)

module.exports = router
