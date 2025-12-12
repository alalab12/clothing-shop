/**
 * Authentication Validators
 * 
 * Business logic validators for authentication operations
 * Separates validation logic from middleware/controllers
 */

/**
 * Validates registration data
 * @param {Object} data - Registration data
 * @returns {Object} {isValid: boolean, errors: Array}
 */
const validateRegistration = (data) => {
  const errors = []

  if (!data.email) {
    errors.push('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email format is invalid')
  }

  if (!data.password) {
    errors.push('Password is required')
  } else if (data.password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!data.firstName) {
    errors.push('First name is required')
  }

  if (!data.lastName) {
    errors.push('Last name is required')
  }

  if (data.phone && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,5}[-\s.]?[0-9]{1,5}$/.test(data.phone)) {
    errors.push('Phone number format is invalid')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates login data
 * @param {Object} data - Login data
 * @returns {Object} {isValid: boolean, errors: Array}
 */
const validateLogin = (data) => {
  const errors = []

  if (!data.email) {
    errors.push('Email is required')
  }

  if (!data.password) {
    errors.push('Password is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

module.exports = {
  validateRegistration,
  validateLogin
}
