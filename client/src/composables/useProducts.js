/**
 * Product Composable (useProducts)
 * 
 * Manages product state and operations
 * Fetches and manages product data
 * 
 * Pattern: Composition API composable for state management
 * Reference: 04-vue.pdf - Composition API & Custom Composables
 * Reference: 03-ModernFrontEnd.pdf - Component-based Architecture
 * 
 * Usage:
 *   const { products, currentProduct, loading, fetchAll, fetchById } = useProducts()
 */

import { ref, computed } from 'vue'
import { productAPI } from '../services/api'

// Global products state
const products = ref([])
const currentProduct = ref(null)
const loading = ref(false)
const errors = ref([])

export function useProducts() {
  /**
   * Fetch all products
   */
  const fetchAll = async () => {
    loading.value = true
    errors.value = []
    try {
      const data = await productAPI.getAll()
      products.value = data.products || []
      return { success: true, products: products.value }
    } catch (error) {
      errors.value = [error.message]
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch product by ID with available stock
   * @param {number} productId - Product ID
   */
  const fetchById = async (productId) => {
    loading.value = true
    errors.value = []
    try {
      const data = await productAPI.getById(productId)
      currentProduct.value = data.product
      return { success: true, product: data.product }
    } catch (error) {
      errors.value = [error.message]
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Get products filtered by category
   * @param {string} category - Product category
   */
  const getByCategory = computed(() => {
    return (category) => {
      return products.value.filter(p => p.category === category)
    }
  })

  /**
   * Search products by name
   * @param {string} searchTerm - Search term
   */
  const search = (searchTerm) => {
    const term = searchTerm.toLowerCase()
    return products.value.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    )
  }

  return {
    // State
    products,
    currentProduct,
    loading,
    errors,
    
    // Methods
    fetchAll,
    fetchById,
    getByCategory,
    search
  }
}
