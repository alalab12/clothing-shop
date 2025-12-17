
// Order controller - handles order routes

// Simple: orderController — handles HTTP requests related to orders
const orderService = require('../services/orderService')
const cartService = require('../services/cartService')

// Create order from cart items
const createOrder = async (req, res) => {
  const { total, shippingAddress } = req.body
  const userId = req.session.userId

  if (!shippingAddress) {
    return res.status(400).json({ error: 'Shipping address is required' })
  }

  try {
    const cartItems = await cartService.getCart(userId)

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    await orderService.verifyStock(cartItems)
    const orderId = await orderService.createOrder(userId, cartItems, total, shippingAddress)
    await cartService.clearCart(userId)

    res.status(201).json({
      orderId,
      message: 'Order created successfully'
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Get user's orders
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
