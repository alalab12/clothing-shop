/**
 * Profile Controller
 * 
 * Handles HTTP requests for user profile routes
 */

const authService = require('../services/authService')

/**
 * GET /api/profile
 * Fetches authenticated user's profile (requires authentication)
 */
const getProfile = async (req, res) => {
  try {
    const user = await authService.getUserById(req.session.userId)
    res.json({ user })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}

module.exports = {
  getProfile
}
