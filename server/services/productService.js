
// Product service - handles product operations

const { getDb } = require('../database') // Database connection

// Fetch all products sorted by category
const getAllProducts = async () => {
  const db = getDb()
  const [products] = await db.execute('SELECT * FROM products ORDER BY category, name')
  return products || []
}

// Fetch product by ID with stock info
const getProductById = async (productId) => {
  const db = getDb()
  
  const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [productId])
  const product = products[0]
  
  if (!product) {
    throw new Error('Product not found')
  }
  
  // Get all sizes with their stock quantities
  const [stock] = await db.execute(
    'SELECT size, quantity FROM stock WHERE productId = ? ORDER BY FIELD(size, "XS", "S", "M", "L", "XL")',
    [productId]
  )
  
  // Create size availability map
  const sizeStock = {}
  stock.forEach(s => {
    sizeStock[s.size] = s.quantity
  })
  
  return {
    ...product,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    sizeStock
  }
}

module.exports = {
  getAllProducts,
  getProductById
}
