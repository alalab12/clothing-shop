
// Order service - handles order operations

const { getDb } = require('../database')

// Verify stock availability before order
const verifyStock = async (cartItems) => {
  const db = getDb()
  const errors = []

  for (const item of cartItems) {
    const [stock] = await db.execute(
      'SELECT quantity FROM stock WHERE productId = ? AND size = ?',
      [item.productId, item.size]
    )

    if (!stock || stock.length === 0) {
      errors.push(`Product ${item.productId} is not available`)
    } else if (stock[0].quantity < item.quantity) {
      errors.push(`Insufficient stock for product ${item.productId}. Available: ${stock[0].quantity}, Requested: ${item.quantity}`)
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '))
  }
}

// Create order and update stock
const createOrder = async (userId, cartItems, total, shippingAddress) => {
  const db = getDb()

  // Create order
  const [orderResult] = await db.execute(
    'INSERT INTO orders (userId, total, shippingAddress, status) VALUES (?, ?, ?, ?)',
    [userId, total, JSON.stringify(shippingAddress), 'confirmed']
  )

  const orderId = orderResult.insertId

  // Process each cart item
  for (const item of cartItems) {
    console.log(`Processing order item: ProductID=${item.productId}, Size=${item.size}, Quantity=${item.quantity}`)
    
    const [product] = await db.execute(
      'SELECT price FROM products WHERE id = ?',
      [item.productId]
    )

    if (!product || product.length === 0) {
      throw new Error(`Product ${item.productId} not found`)
    }

    // Insert order item
    await db.execute(
      'INSERT INTO order_items (orderId, productId, size, quantity, price) VALUES (?, ?, ?, ?, ?)',
      [orderId, item.productId, item.size, item.quantity, product[0].price]
    )

    // Decrement stock for specific size only
    console.log(`Decrementing stock: ProductID=${item.productId}, Size=${item.size}, Quantity to remove=${item.quantity}`)
    
    const [updateResult] = await db.execute(
      'UPDATE stock SET quantity = quantity - ? WHERE productId = ? AND size = ?',
      [item.quantity, item.productId, item.size]
    )

    console.log(`Stock update result: Rows affected=${updateResult.affectedRows}`)

    // Verify stock was updated
    if (updateResult.affectedRows === 0) {
      throw new Error(`Failed to update stock for product ${item.productId}, size ${item.size}. Stock entry may not exist.`)
    }
  }

  return orderId
}

// Get user's orders
const getUserOrders = async (userId) => {
  const db = getDb()
  const [orders] = await db.execute(
    'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC',
    [userId]
  )
  return orders || []
}

module.exports = {
  verifyStock,
  createOrder,
  getUserOrders
}
