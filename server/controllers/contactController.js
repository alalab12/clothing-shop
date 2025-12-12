/**
 * Contact Controller
 * 
 * Handles HTTP requests for contact form routes
 */

const contactService = require('../services/contactService')

/**
 * POST /api/contact
 * Saves contact message (public route, no authentication required)
 */
const saveContactMessage = async (req, res) => {
  const { email, message } = req.body

  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' })
  }

  try {
    const messageId = await contactService.saveContactMessage(email, message)
    res.status(201).json({
      messageId,
      success: true,
      message: 'Message sent successfully'
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  saveContactMessage
}
