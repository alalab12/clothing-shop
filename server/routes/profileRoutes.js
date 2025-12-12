/**
 * Profile Routes
 * 
 * Defines API endpoints for user profile operations
 */

const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profileController')
const { requireAuth } = require('../middleware/authMiddleware')

/**
 * GET /api/profile
 * Fetch authenticated user's profile
 * Protected: Requires authentication
 */
router.get('/', requireAuth, profileController.getProfile)

module.exports = router
