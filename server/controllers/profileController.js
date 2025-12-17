// Profile controller - handles user profile operations

const authService = require('../services/authService')

// Get user profile - GET /api/profile
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
