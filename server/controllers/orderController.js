/**
 * Order Controller
 * 
 * Handles HTTP requests for order routes
 */

const orderService = require('../services/orderService')
const cartService = require('../services/cartService')

/**
 * POST /api/orders
 * Creates new order from cart items (requires authentication)
 * 
 * Process:
 * 1. Get user's cart items
 * 2. Verify stock availability
 * 3. Create order
 * 4. Update stock quantities
 * 5. Clear cart
 */
const createOrder = async (req, res) => {
  const { total, shippingAddress } = req.body
  const userId = req.session.userId

  if (!shippingAddress) {
    return res.status(400).json({ error: 'Shipping address is required' })
  }

  try {
    // Get cart items
    const cartItems = await cartService.getCart(userId)

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    // Verify stock availability
    await orderService.verifyStock(cartItems)

    // Create order and update stock
    const orderId = await orderService.createOrder(userId, cartItems, total, shippingAddress)

    // Clear cart after successful order
    await cartService.clearCart(userId)

    res.status(201).json({
      orderId,
      message: 'Order created successfully'
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

/**
 * GET /api/orders
 * Fetches user's orders (requires authentication)
 */
const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.session.userId)
    res.json({ orders })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createOrder,
  getOrders
}
