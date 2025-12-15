// Contact service - handles contact messages

const { getDb } = require('../database')

// Save contact message
const saveContactMessage = async (email, message) => {
  const db = getDb()
  const result = await db.execute(
    'INSERT INTO contact_messages (email, message) VALUES (?, ?)',
    [email, message]
  )
  return result[0].insertId
}

module.exports = {
  saveContactMessage
}
