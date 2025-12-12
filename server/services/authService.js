/**
 * Authentication Service
 * 
 * Contains business logic for authentication operations
 * Separates database operations from route handlers
 * 
 * Pattern: Service layer (business logic separation)
 * Reference: 05-ModernBackEnd.pdf - Server-side architecture & MVC pattern
 */

const bcrypt = require('bcrypt')
const { getDb } = require('../database')

/**
 * Service for handling user registration
 * 
 * @param {Object} userData - User registration data
 * @returns {Promise} User object with id and email
 * @throws {Error} If email already exists or registration fails
 */
const registerUser = async (userData) => {
  const db = getDb()
  const { email, password, firstName, lastName, phone } = userData

  // Hash password using bcrypt (10 salt rounds)
  // Reference: 07-Authentication and database.pdf - Bcrypt
  const hashedPassword = await bcrypt.hash(password, 10)

  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (email, password, firstName, lastName, phone) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, phone || null],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            reject(new Error('Email already exists'))
          } else {
            reject(new Error('Registration failed'))
          }
        } else {
          resolve({
            id: this.lastID,
            email,
            firstName,
            lastName,
            phone
          })
        }
      }
    )
  })
}

/**
 * Service for handling user login
 * Verifies credentials against database
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} User object if credentials valid
 * @throws {Error} If credentials invalid
 */
const loginUser = async (email, password) => {
  const db = getDb()

  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err || !user) {
        return reject(new Error('Invalid credentials'))
      }

      try {
        // Compare password with hashed password using bcrypt
        // Reference: 07-Authentication and database.pdf - Bcrypt verification
        const match = await bcrypt.compare(password, user.password)
        
        if (!match) {
          return reject(new Error('Invalid credentials'))
        }

        resolve({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        })
      } catch (error) {
        reject(new Error('Password verification failed'))
      }
    })
  })
}

/**
 * Service to get user by ID
 * 
 * @param {number} userId - User ID
 * @returns {Promise} User object
 */
const getUserById = (userId) => {
  const db = getDb()

  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, email, firstName, lastName, phone FROM users WHERE id = ?',
      [userId],
      (err, user) => {
        if (err || !user) {
          reject(new Error('User not found'))
        } else {
          resolve(user)
        }
      }
    )
  })
}

module.exports = {
  registerUser,
  loginUser,
  getUserById
}
