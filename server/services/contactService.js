/**
 * Contact Service
 * 
 * Contains business logic for contact operations
 */

const { getDb } = require('../database')

/**
 * Service to save contact message
 * 
 * @param {string} email - Contact email
 * @param {string} message - Contact message
 * @returns {Promise} Message ID
 */
const saveContactMessage = (email, message) => {
  const db = getDb()

  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO contact_messages (email, message) VALUES (?, ?)',
      [email, message],
      function(err) {
        if (err) {
          reject(new Error('Failed to save contact message'))
        } else {
          resolve(this.lastID)
        }
      }
    )
  })
}

module.exports = {
  saveContactMessage
}
