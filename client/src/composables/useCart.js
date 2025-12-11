import { ref, computed } from 'vue'
import { cartAPI } from '../services/api'
import { useAuth } from './useAuth'

const cartItems = ref([])
const loading = ref(false)

export function useCart() {
  const auth = useAuth()

  const syncWithServer = async () => {
    if (!auth.isAuthenticated()) return
    
    loading.value = true
    try {
      const data = await cartAPI.get()
      cartItems.value = data.items || []
    } catch (error) {
      console.error('Failed to sync cart:', error)
    } finally {
      loading.value = false
    }
  }

  const addItem = async (productId, size, color, quantity = 1) => {
    if (!auth.isAuthenticated()) {
      throw new Error('Please login to add items to cart')
    }

    loading.value = true
    try {
      await cartAPI.add(productId, size, color, quantity)
      await syncWithServer()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const removeItem = async (itemId) => {
    loading.value = true
    try {
      await cartAPI.remove(itemId)
      await syncWithServer()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const clearCart = async () => {
    loading.value = true
    try {
      await cartAPI.clear()
      cartItems.value = []
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  return {
    items: cartItems,
    loading,
    cartCount,
    cartTotal,
    addItem,
    removeItem,
    clearCart,
    syncWithServer
  }
}
