
// Product API routes

const express = require('express') // Express framework
const router = express.Router() // Router instance
const productController = require('../controllers/productController') // Product handler

// Get all products
router.get('/', productController.getAllProducts)
// Get single product
router.get('/:id', productController.getProduct)

// Export routes
module.exports = router
