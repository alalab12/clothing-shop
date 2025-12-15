
// Order API routes
// Defines API endpoints for order operations

const express = require('express') // Express framework
const router = express.Router() // Router instance
const orderController = require('../controllers/orderController') // Order handler
const { requireAuth } = require('../middleware/authMiddleware') // Auth check

// Create new order from cart (requires login)
router.post('/', requireAuth, orderController.createOrder)

// Get user's orders (requires login)
router.get('/', requireAuth, orderController.getOrders)

// Export the router
module.exports = router
