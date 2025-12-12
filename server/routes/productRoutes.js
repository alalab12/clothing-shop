/**
 * Product Routes
 * 
 * Defines API endpoints for product operations
 */

const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

/**
 * GET /api/products
 * Fetch all products
 */
router.get('/', productController.getAllProducts)

/**
 * GET /api/products/:id
 * Fetch product by ID with available stock
 */
router.get('/:id', productController.getProduct)

module.exports = router
