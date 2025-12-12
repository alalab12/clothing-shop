/**
 * Product Service
 * 
 * Contains business logic for product operations
 */

const { getDb } = require('../database')

/**
 * Service to fetch all products
 * 
 * @returns {Promise} Array of all products
 */
const getAllProducts = () => {
  const db = getDb()

  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM products ORDER BY category, name', (err, products) => {
      if (err) {
        reject(new Error('Failed to fetch products'))
      } else {
        resolve(products || [])
      }
    })
  })
}

/**
 * Service to fetch product by ID with available stock info
 * 
 * @param {number} productId - Product ID
 * @returns {Promise} Product with sizes and colors
 */
const getProductById = (productId) => {
  const db = getDb()

  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
      if (err || !product) {
        return reject(new Error('Product not found'))
      }

      // Get available sizes and colors
      db.all(
        'SELECT DISTINCT size, color FROM stock WHERE productId = ? AND quantity > 0',
        [productId],
        (err, stock) => {
          if (err) {
            return reject(new Error('Failed to fetch stock'))
          }

          const sizes = [...new Set(stock.map(s => s.size))]
          const colors = [...new Set(stock.map(s => s.color))]

          resolve({
            ...product,
            sizes,
            colors
          })
        }
      )
    })
  })
}

module.exports = {
  getAllProducts,
  getProductById
}
