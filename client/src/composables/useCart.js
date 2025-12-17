// Manages shopping cart state and operations
// Handles item management and server synchronization

import { ref, computed } from 'vue' // Vue reactivity
import { cartAPI } from '../services/api' // API calls
import { useAuth } from './useAuth' // Get auth state

// Global cart state 
const cartItems = ref([]) // Items in cart
const loading = ref(false) // Request status
const errors = ref([]) // Error messages

export function useCart() {
  const auth = useAuth() // Use auth state


  // Sync cart with server to get latest items
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


  //Add item to cart
  const addItem = async (productId, size, quantity = 1) => {
    if (!auth.isAuthenticated.value) {
      throw new Error('Please login to add items to cart')
    }

    loading.value = true
    errors.value = []

    try {
      await cartAPI.add(productId, size, quantity)
      await syncWithServer()
      return { success: true }
    } catch (error) {
      errors.value = [error.message]
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }


  //Remove item from cart
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

  // total number of items in cart
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  // total price of items in cart
  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0).toFixed(2)// 2 decimal places
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
    syncWithServer
  }
}
