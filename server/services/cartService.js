/**
 * Cart Service
 * 
 * Contains business logic for cart operations
 */

const { getDb } = require('../database')

/**
 * Service to fetch user's cart
 * 
 * @param {number} userId - User ID
 * @returns {Promise} Array of cart items
 */
const getCart = (userId) => {
  const db = getDb()

  return new Promise((resolve, reject) => {
    db.all(
      `SELECT ci.id, ci.productId, ci.size, ci.color, ci.quantity,
              p.name, p.price, p.image, p.category
       FROM cart_items ci
       JOIN products p ON ci.productId = p.id
       WHERE ci.userId = ?`,
      [userId],
      (err, items) => {
        if (err) {
          reject(new Error('Failed to fetch cart'))
        } else {
          resolve(items || [])
        }
      }
    )
  })
}

/**
 * Service to add item to cart
 * 
 * @param {number} userId - User ID
 * @param {Object} item - Cart item {productId, size, color, quantity}
 * @returns {Promise} Created cart item
 */
const addToCart = (userId, item) => {
  const db = getDb()
  const { productId, size, color, quantity } = item

  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO cart_items (userId, productId, size, color, quantity) VALUES (?, ?, ?, ?, ?)',
      [userId, productId, size || null, color || null, quantity || 1],
      function(err) {
        if (err) {
          reject(new Error('Failed to add to cart'))
        } else {
          resolve({
            id: this.lastID,
            ...item
          })
        }
      }
    )
  })
}

/**
 * Service to remove item from cart
 * 
 * @param {number} userId - User ID
 * @param {number} cartItemId - Cart item ID
 * @returns {Promise}
 */
const removeFromCart = (userId, cartItemId) => {
  const db = getDb()

  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM cart_items WHERE id = ? AND userId = ?',
      [cartItemId, userId],
      (err) => {
        if (err) {
          reject(new Error('Failed to remove item'))
        } else {
          resolve()
        }
      }
    )
  })
}

/**
 * Service to clear user's cart
 * 
 * @param {number} userId - User ID
 * @returns {Promise}
 */
const clearCart = (userId) => {
  const db = getDb()

  return new Promise((resolve, reject) => {
    db.run('DELETE FROM cart_items WHERE userId = ?', [userId], (err) => {
      if (err) {
        reject(new Error('Failed to clear cart'))
      } else {
        resolve()
      }
    })
  })
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
}
