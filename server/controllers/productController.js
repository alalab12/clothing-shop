
// Product controller - handles product HTTP requests

const productService = require('../services/productService') // Product business logic

// Get all products - GET /api/products
const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from database
    const products = await productService.getAllProducts()
    res.json({ products }) // Return products
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get product by ID - GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    // Fetch product with stock information
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
