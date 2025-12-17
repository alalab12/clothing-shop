
// Cart controller - handles cart routes

// Simple: cartController — handles cart-related HTTP endpoints
const cartService = require('../services/cartService')

// Get user's cart
const getCart = async (req, res) => {
  try {
    const items = await cartService.getCart(req.session.userId)
    res.json({ items })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Add item to cart
const addToCart = async (req, res) => {
  const { productId, size, quantity } = req.body

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' })
  }

  try {
    const item = await cartService.addToCart(req.session.userId, {
      productId,
      size,
      quantity
    })
    res.status(201).json({ item, message: 'Added to cart' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    await cartService.removeFromCart(req.session.userId, req.params.id)
    res.json({ message: 'Item removed from cart' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart
}
