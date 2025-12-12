/**
 * Order Routes
 * 
 * Defines API endpoints for order operations
 * All routes require authentication
 */

const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const { requireAuth } = require('../middleware/authMiddleware')

/**
 * POST /api/orders
 * Create new order from cart
 * Body: { total, shippingAddress }
 * Protected: Requires authentication
 */
router.post('/', requireAuth, orderController.createOrder)

/**
 * GET /api/orders
 * Fetch user's orders
 * Protected: Requires authentication
 */
router.get('/', requireAuth, orderController.getOrders)

module.exports = router
