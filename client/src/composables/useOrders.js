/**
 * Orders Composable (useOrders)
 * 
 * Manages order state and operations
 * Handles order creation and retrieval
 * 
 * Pattern: Composition API composable for state management
 * Reference: 04-vue.pdf - Composition API & Custom Composables
 * 
 * Usage:
 *   const { orders, createOrder, fetchOrders } = useOrders()
 */

import { ref } from 'vue'
import { orderAPI } from '../services/api'

// Global orders state
const orders = ref([])
const loading = ref(false)
const errors = ref([])

export function useOrders() {
  /**
   * Create new order from cart
   * @param {number} total - Order total
   * @param {Object} shippingAddress - Shipping address
   */
  const createOrder = async (total, shippingAddress) => {
    loading.value = true
    errors.value = []
    try {
      const data = await orderAPI.create({
        total,
        shippingAddress
      })
      return { success: true, orderId: data.orderId }
    } catch (error) {
      errors.value = [error.message]
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch user's orders
   */
  const fetchOrders = async () => {
    loading.value = true
    errors.value = []
    try {
      const data = await orderAPI.getAll()
      orders.value = data.orders || []
      return { success: true, orders: orders.value }
    } catch (error) {
      errors.value = [error.message]
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    orders,
    loading,
    errors,
    
    // Methods
    createOrder,
    fetchOrders
  }
}
