/**
 * Cart Controller
 * 
 * Handles HTTP requests for cart routes
 */

const cartService = require('../services/cartService')

/**
 * GET /api/cart
 * Fetches user's cart (requires authentication)
 */
const getCart = async (req, res) => {
  try {
    const items = await cartService.getCart(req.session.userId)
    res.json({ items })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * POST /api/cart
 * Adds item to cart (requires authentication)
 */
const addToCart = async (req, res) => {
  const { productId, size, color, quantity } = req.body

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' })
  }

  try {
    const item = await cartService.addToCart(req.session.userId, {
      productId,
      size,
      color,
      quantity
    })
    res.status(201).json({ item, message: 'Added to cart' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * DELETE /api/cart/:id
 * Removes item from cart (requires authentication)
 */
const removeFromCart = async (req, res) => {
  try {
    await cartService.removeFromCart(req.session.userId, req.params.id)
    res.json({ message: 'Item removed from cart' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * DELETE /api/cart
 * Clears entire cart (requires authentication)
 */
const clearCart = async (req, res) => {
  try {
    await cartService.clearCart(req.session.userId)
    res.json({ message: 'Cart cleared' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
}
