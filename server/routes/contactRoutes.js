
// Contact API routes
// Defines API endpoints for contact form operations

const express = require('express') // Express framework
const router = express.Router() // Router instance
const contactController = require('../controllers/contactController') // Contact handler
const { validateRequired } = require('../middleware/validationMiddleware') // Validation

// Save contact message (public endpoint, no login required)
router.post('/',
  validateRequired(['email', 'message']),
  contactController.saveContactMessage
)

// Export the router
module.exports = router
