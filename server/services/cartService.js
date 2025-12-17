
// Cart service - handles shopping cart operations

const { getDb } = require('../database') // Database connection

// Get user's cart with product details
const getCart = async (userId) => {
  const db = getDb()
  const [items] = await db.execute(
    `SELECT ci.id, ci.productId, ci.size, ci.quantity,
            p.name, p.price, p.image, p.category
     FROM cart_items ci
     JOIN products p ON ci.productId = p.id
     WHERE ci.userId = ?`,
    [userId]
  )
  return items || []
}

// Add item to cart
const addToCart = async (userId, item) => {
  const db = getDb()
  const { productId, size, quantity } = item
  const requestedQuantity = quantity || 1

  // Check stock availability before inserting
  const [stockRows] = await db.execute(
    'SELECT quantity FROM stock WHERE productId = ? AND size = ?',
    [productId, size || null]
  )

  if (!stockRows || stockRows.length === 0) {
    throw new Error('Product not available in this size')
  }

  const availableStock = stockRows[0].quantity

  // Check if item already exists in cart
  const [existingItems] = await db.execute(
    'SELECT id, quantity FROM cart_items WHERE userId = ? AND productId = ? AND size = ?',
    [userId, productId, size || null]
  )

  if (existingItems && existingItems.length > 0) {
    // Update existing cart item
    const existingItem = existingItems[0]
    const newQuantity = existingItem.quantity + requestedQuantity

    // Check if total quantity exceeds stock
    if (newQuantity > availableStock) {
      throw new Error(`Insufficient stock. Available: ${availableStock}, Requested: ${newQuantity}`)
    }

    await db.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [newQuantity, existingItem.id]
    )

    return {
      id: existingItem.id,
      productId,
      size,
      quantity: newQuantity
    }
  } else {
    // Check if requested quantity is available
    if (requestedQuantity > availableStock) {
      throw new Error(`Insufficient stock. Available: ${availableStock}, Requested: ${requestedQuantity}`)
    }

    // Insert new cart item
    const [result] = await db.execute(
      'INSERT INTO cart_items (userId, productId, size, quantity) VALUES (?, ?, ?, ?)',
      [userId, productId, size || null, requestedQuantity]
    )
    
    return {
      id: result.insertId,
      productId,
      size,
      quantity: requestedQuantity
    }
  }
}

// Remove item from cart
const removeFromCart = async (userId, cartItemId) => {
  const db = getDb()
  const [result] = await db.execute(
    'DELETE FROM cart_items WHERE id = ? AND userId = ?',
    [cartItemId, userId]
  )

  if (result.affectedRows === 0) {
    throw new Error('Cart item not found or does not belong to user')
  }
}

// Clear user's cart
const clearCart = async (userId) => {
  const db = getDb()
  const [result] = await db.execute('DELETE FROM cart_items WHERE userId = ?', [userId])
  return result.affectedRows
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
}
