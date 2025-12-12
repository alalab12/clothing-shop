/**
 * Order Service
 * 
 * Contains business logic for order operations
 * Handles complex operations like stock verification and order creation
 */

const { getDb } = require('../database')

/**
 * Service to verify stock availability before order
 * Checks if all cart items have sufficient stock
 * 
 * @param {Array} cartItems - Array of cart items
 * @returns {Promise} Resolves if all items have stock, rejects with error message
 */
const verifyStock = (cartItems) => {
  const db = getDb()

  return new Promise((resolve, reject) => {
    let checkCount = 0
    const errors = []

    cartItems.forEach((item) => {
      db.get(
        'SELECT quantity FROM stock WHERE productId = ? AND size = ? AND color = ?',
        [item.productId, item.size, item.color || ''],
        (err, stock) => {
          if (err || !stock) {
            errors.push(`Product ${item.productId} is not available`)
          } else if (stock.quantity < item.quantity) {
            errors.push(`Insufficient stock for product ${item.productId}. Available: ${stock.quantity}, Requested: ${item.quantity}`)
          }

          checkCount++

          if (checkCount === cartItems.length) {
            if (errors.length > 0) {
              reject(new Error(errors.join(', ')))
            } else {
              resolve()
            }
          }
        }
      )
    })
  })
}

/**
 * Service to create order and update stock
 * Creates order, adds order items, and decrements stock
 * 
 * Reference: Stock decrement on order completion requirement
 * 
 * @param {number} userId - User ID
 * @param {Array} cartItems - Array of cart items
 * @param {number} total - Order total
 * @param {Object} shippingAddress - Shipping address
 * @returns {Promise} Order ID
 */
const createOrder = (userId, cartItems, total, shippingAddress) => {
  const db = getDb()

  return new Promise((resolve, reject) => {
    // Create order
    db.run(
      'INSERT INTO orders (userId, total, shippingAddress, status) VALUES (?, ?, ?, ?)',
      [userId, total, JSON.stringify(shippingAddress), 'confirmed'],
      function(err) {
        if (err) {
          return reject(new Error('Failed to create order'))
        }

        const orderId = this.lastID
        const stmt = db.prepare(
          'INSERT INTO order_items (orderId, productId, size, color, quantity, price) VALUES (?, ?, ?, ?, ?, ?)'
        )

        let completed = 0

        cartItems.forEach((item) => {
          // Get product price
          db.get('SELECT price FROM products WHERE id = ?', [item.productId], (err, product) => {
            if (!err && product) {
              stmt.run([orderId, item.productId, item.size, item.color, item.quantity, product.price])

              // Decrement stock for this item
              db.run(
                'UPDATE stock SET quantity = quantity - ? WHERE productId = ? AND size = ? AND color = ?',
                [item.quantity, item.productId, item.size, item.color || ''],
                (updateErr) => {
                  if (updateErr) {
                    console.error('Error updating stock:', updateErr)
                  }
                }
              )
            }

            completed++

            if (completed === cartItems.length) {
              stmt.finalize()
              resolve(orderId)
            }
          })
        })
      }
    )
  })
}

/**
 * Service to get user's orders
 * 
 * @param {number} userId - User ID
 * @returns {Promise} Array of user's orders
 */
const getUserOrders = (userId) => {
  const db = getDb()

  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC',
      [userId],
      (err, orders) => {
        if (err) {
          reject(new Error('Failed to fetch orders'))
        } else {
          resolve(orders || [])
        }
      }
    )
  })
}

module.exports = {
  verifyStock,
  createOrder,
  getUserOrders
}
