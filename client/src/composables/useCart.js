/**
 * Cart Composable (useCart)
 * 
 * Manages shopping cart state and operations
 * Handles cart item management and synchronization with server
 * 
 * Pattern: Composition API composable for state management
 * Reference: 04-vue.pdf - Composition API & Custom Composables
 * Reference: 03-ModernFrontEnd.pdf - State Management Pattern
 * 
 * Usage:
 *   const { items, cartTotal, cartCount, addItem, removeItem } = useCart()
 */

import { ref, computed } from 'vue'
import { cartAPI } from '../services/api'
import { useAuth } from './useAuth'

// Global cart state - shared across all component instances
const cartItems = ref([])
const loading = ref(false)
const errors = ref([])

export function useCart() {
  const auth = useAuth()

  /**
   * Synchronize cart with server
   * Fetches latest cart items from backend
   */
  const syncWithServer = async () => {
    if (!auth.isAuthenticated.value) return
    
    loading.value = true
    errors.value = []
    try {
      const data = await cartAPI.get()
      cartItems.value = data.items || []
    } catch (error) {
      errors.value = [error.message]
      console.error('Failed to sync cart:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * Add item to cart
   * @param {number} productId - Product ID
   * @param {string} size - Product size
   * @param {string} color - Product color
   * @param {number} quantity - Item quantity (default: 1)
   */
  const addItem = async (productId, size, color, quantity = 1) => {
    if (!auth.isAuthenticated.value) {
      throw new Error('Please login to add items to cart')
    }

    loading.value = true
    errors.value = []
    try {
      await cartAPI.add(productId, size, color, quantity)
      await syncWithServer()
      return { success: true }
    } catch (error) {
      errors.value = [error.message]
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Remove item from cart
   * @param {number} itemId - Cart item ID
   */
  const removeItem = async (itemId) => {
    loading.value = true
    errors.value = []
    try {
      await cartAPI.remove(itemId)
      await syncWithServer()
      return { success: true }
    } catch (error) {
      errors.value = [error.message]
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear entire cart
   */
  const clearCart = async () => {
    loading.value = true
    errors.value = []
    try {
      await cartAPI.clear()
      cartItems.value = []
      return { success: true }
    } catch (error) {
      errors.value = [error.message]
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Computed property: total number of items in cart
   * Reference: 04-vue.pdf - Computed Properties
   */
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  /**
   * Computed property: total price of all items
   * Reference: 04-vue.pdf - Computed Properties
   */
  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0).toFixed(2)
  })

  return {
    // State
    items: cartItems,
    loading,
    errors,
    cartCount,
    cartTotal,
    
    // Methods
    addItem,
    removeItem,
    clearCart,
    syncWithServer
  }
}
