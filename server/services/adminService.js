// Admin service - handles admin product operations

const { getDb } = require('../database')

// Update product information
const updateProduct = async (productId, productData) => {
  const db = getDb()
  const { name, description, price, category, image } = productData

  // Update product in database
  await db.execute(
    'UPDATE products SET name = ?, description = ?, price = ?, category = ?, image = ? WHERE id = ?',
    [name, description, price, category, image, productId]
  )

  // If stock data is provided, update stock for each size
  if (productData.stock) {
    for (const [size, quantity] of Object.entries(productData.stock)) {
      await db.execute(
        `INSERT INTO stock (productId, size, quantity) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE quantity = ?`,
        [productId, size, quantity, quantity]
      )
    }
  }

  return { success: true, productId }
}

// Delete product
const deleteProduct = async (productId) => {
  const db = getDb()
  
  // Check if product exists
  const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [productId])
  
  if (products.length === 0) {
    throw new Error('Product not found')
  }

  // Prevent deleting a product that appears in past orders
  const [orderRefs] = await db.execute('SELECT COUNT(*) as cnt FROM order_items WHERE productId = ?', [productId])
  const count = orderRefs[0]?.cnt || 0
  if (count > 0) {
    throw new Error('Cannot delete product because it appears in existing orders')
  }

  // Safe to delete product (this will cascade delete stock/cart items via foreign keys)
  await db.execute('DELETE FROM products WHERE id = ?', [productId])

  return { success: true }
}

// Create new product
const createProduct = async (productData) => {
  const db = getDb()
  const { id, name, category, price, description, image, stock } = productData

  // Insert product
  await db.execute(
    'INSERT INTO products (id, name, category, price, description, image) VALUES (?, ?, ?, ?, ?, ?)',
    [id, name, category, price, description, image]
  )

  // Insert stock for each size
  if (stock) {
    for (const [size, quantity] of Object.entries(stock)) {
      await db.execute(
        'INSERT INTO stock (productId, size, quantity) VALUES (?, ?, ?)',
        [id, size, quantity]
      )
    }
  }

  return { success: true, productId: id }
}

module.exports = {
  updateProduct,
  deleteProduct,
  createProduct
}
