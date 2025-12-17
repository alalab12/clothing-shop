// Admin API routes - protected by admin middleware

const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const { requireAdmin } = require('../middleware/adminMiddleware')

// All routes require admin authentication
router.use(requireAdmin)

// Update product
router.put('/products/:id', adminController.updateProduct)

// Delete product
router.delete('/products/:id', adminController.deleteProduct)

// Create product
router.post('/products', adminController.createProduct)

module.exports = router
