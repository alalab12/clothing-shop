
const adminService = require('../services/adminService')

// Update product - PUT /api/admin/products/:id
const updateProduct = async (req, res) => {
  try {
    const result = await adminService.updateProduct(req.params.id, req.body)
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete product - DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
  try {
    const result = await adminService.deleteProduct(req.params.id)
    res.json(result)
  } catch (error) {
    // Business logic errors return 400 Bad Request
    res.status(400).json({ error: error.message })
  }
}

// Create product - POST /api/admin/products
const createProduct = async (req, res) => {
  try {
    const result = await adminService.createProduct(req.body)
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  updateProduct,
  deleteProduct,
  createProduct
}
