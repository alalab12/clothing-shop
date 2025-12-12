/**
 * Authentication Controller
 * 
 * Handles HTTP requests for authentication routes
 * Calls services for business logic
 * 
 * Pattern: MVC Controller - Handles request/response and delegates to services
 * Reference: 05-ModernBackEnd.pdf - MVC Pattern
 */

const authService = require('../services/authService')
const { validateRegistration, validateLogin } = require('../validators/authValidator')

/**
 * POST /api/auth/register
 * Registers a new user
 */
const register = async (req, res) => {
  const validation = validateRegistration(req.body)

  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors })
  }

  try {
    const user = await authService.registerUser(req.body)

    // Set session after successful registration
    // Reference: 07-Authentication and database.pdf - Stateful Authentication
    req.session.userId = user.id
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session error' })
      }
      res.json({ user })
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

/**
 * POST /api/auth/login
 * Authenticates user and creates session
 */
const login = async (req, res) => {
  const validation = validateLogin(req.body)

  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors })
  }

  try {
    const user = await authService.loginUser(req.body.email, req.body.password)

    // Create session
    req.session.userId = user.id
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session error' })
      }
      res.json({ user })
    })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}

/**
 * POST /api/auth/logout
 * Destroys user session
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' })
    }
    res.json({ message: 'Logged out successfully' })
  })
}

/**
 * GET /api/auth/session
 * Checks if user is authenticated and returns user info
 */
const getSession = async (req, res) => {
  if (!req.session.userId) {
    return res.json({ user: null })
  }

  try {
    const user = await authService.getUserById(req.session.userId)
    res.json({ user })
  } catch (error) {
    res.json({ user: null })
  }
}

module.exports = {
  register,
  login,
  logout,
  getSession
}
