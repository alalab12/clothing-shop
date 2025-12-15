
//Business logic validators for authentication operations
//Separates validation logic from middleware/controllers



//Validates registration data

const validateRegistration = (data) => {
  const errors = []

  // Validate email
  if (!data.email) {
    //Check if email is provided
    errors.push('Email is required')
    // Check email format
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email format is invalid')
  }

  // Validate password
  if (!data.password) {
    //Check if password is provided
    errors.push('Password is required')
    // Check password length
  } else if (data.password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  // Validate first and last name
  if (!data.firstName) {
    //Check if first name is provided
    errors.push('First name is required')
  }

  if (!data.lastName) {
    //Check if last name is provided
    errors.push('Last name is required')
  }

  // Validate phone (if provided)
  if (data.phone && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,5}[-\s.]?[0-9]{1,5}$/.test(data.phone)) {//International phone regex
    errors.push('Phone number format is invalid')
  }

  //Return validation result
  return {
    isValid: errors.length === 0,
    errors
  }
}


//Validates login data
const validateLogin = (data) => {
  const errors = []

  // Check email
  if (!data.email) {
    errors.push('Email is required')
  }

  // Check password
  if (!data.password) {
    errors.push('Password is required')
  }

  //Return validation result
  return {
    isValid: errors.length === 0,
    errors
  }
}

//Export validation functions
module.exports = {
  validateRegistration,
  validateLogin
}
