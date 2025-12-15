
 // Cart API routes
//Defines API endpoints for cart operations
 
// Import dependencies
const express = require('express')// Express framework
const router = express.Router()// Router instance
const cartController = require('../controllers/cartController')//Cart controller
const { requireAuth } = require('../middleware/authMiddleware')//Auth check

// Get user's cart (requires login)
router.get('/', requireAuth, cartController.getCart)

// Add item to cart (requires login)
router.post('/', requireAuth, cartController.addToCart)

// Remove item from cart (requires login)
router.delete('/:id', requireAuth, cartController.removeFromCart)

// Export the router
module.exports = router
