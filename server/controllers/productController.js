/**
 * Product Controller
 * 
 * Handles HTTP requests for product routes
 */

const productService = require('../services/productService')

/**
 * GET /api/products
 * Fetches all products
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts()
    res.json({ products })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * GET /api/products/:id
 * Fetches product by ID with available stock info
 */
const getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id)
    res.json({ product })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}

module.exports = {
  getAllProducts,
  getProduct
}
