/**
 * Cart Routes
 * 
 * Defines API endpoints for cart operations
 * All routes require authentication
 */

const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')
const { requireAuth } = require('../middleware/authMiddleware')

/**
 * GET /api/cart
 * Fetch user's cart
 * Protected: Requires authentication
 */
router.get('/', requireAuth, cartController.getCart)

/**
 * POST /api/cart
 * Add item to cart
 * Body: { productId, size, color?, quantity? }
 * Protected: Requires authentication
 */
router.post('/', requireAuth, cartController.addToCart)

/**
 * DELETE /api/cart/:id
 * Remove item from cart
 * Protected: Requires authentication
 */
router.delete('/:id', requireAuth, cartController.removeFromCart)

/**
 * DELETE /api/cart
 * Clear entire cart
 * Protected: Requires authentication
 */
router.delete('/', requireAuth, cartController.clearCart)

module.exports = router
