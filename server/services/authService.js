// Auth service - handles user authentication

const bcrypt = require('bcrypt') // Password hashing library
const { getDb } = require('../database') // Database connection

// Register new user with validation
const registerUser = async (userData) => {
  const db = getDb()
  const { email, password, firstName, lastName, phone } = userData

  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const result = await db.execute(
      'INSERT INTO users (email, password, firstName, lastName, phone) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, phone || null]
    )
    
    return {
      id: result[0].insertId,
      email,
      firstName,
      lastName,
      phone
    }
  } catch (error) {
    if (error.message.includes('UNIQUE') || error.code === 'ER_DUP_ENTRY') {
      throw new Error('Email already exists')
    }
    throw new Error('Registration failed')
  }
}

// Login user with email and password
const loginUser = async (email, password) => {
  const db = getDb()

  // Find user by email
  const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email])
  const user = users[0]
  
  // Check if user exists
  if (!user) {
    throw new Error('Invalid credentials')
  }
  
  // Verify password matches hash
  const match = await bcrypt.compare(password, user.password)
  
  // Return error if password is wrong
  if (!match) {
    throw new Error('Invalid credentials')
  }
  
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone
  }
}

// Get user profile by ID
const getUserById = async (userId) => {
  const db = getDb()

  // Fetch user without password
  const [users] = await db.execute(
    'SELECT id, email, firstName, lastName, phone FROM users WHERE id = ?',
    [userId]
  )
  
  const user = users[0]
  
  if (!user) {
    throw new Error('User not found')
  }
  
  return user
}

module.exports = {
  registerUser,
  loginUser,
  getUserById
}
