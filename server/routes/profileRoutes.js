
// Profile API routes
// Defines API endpoints for user profile operations

const express = require('express') // Express framework
const router = express.Router() // Router instance
const profileController = require('../controllers/profileController') // Profile handler
const { requireAuth } = require('../middleware/authMiddleware') // Auth check

// Get user's profile (requires login)
router.get('/', requireAuth, profileController.getProfile)

module.exports = router
