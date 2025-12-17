// Auth controller - handles authentication routes

const authService = require('../services/authService') // Auth business logic
const { validateRegistration, validateLogin } = require('../validators/authValidator') // Validation

// Register new user - POST /api/auth/register
const register = async (req, res) => {
  // Validate input data
  const validation = validateRegistration(req.body)

  // Return validation errors
  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors })
  }

  try {
    // Create user in database
    const user = await authService.registerUser(req.body)

    // Store user ID in session
    req.session.userId = user.id
    // Save session to cookie
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

// Login user - POST /api/auth/login
const login = async (req, res) => {
  // Validate credentials
  const validation = validateLogin(req.body)

  // Return validation errors
  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors })
  }

  try {
    // Authenticate user
    const user = await authService.loginUser(req.body.email, req.body.password)

    // Create session for user
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

// Logout user - POST /api/auth/logout
const logout = (req, res) => {
  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' })
    }
    res.json({ message: 'Logged out successfully' })
  })
}

// Get current session/user - GET /api/auth/session
const getSession = async (req, res) => {
  // Return null if not logged in
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
