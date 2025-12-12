/**
 * Authentication Composable (useAuth)
 * 
 * Manages user authentication state and operations
 * Centralizes all auth-related logic for reusability across components
 * 
 * Pattern: Composition API composable for state management
 * Reference: 04-vue.pdf - Composition API & Custom Composables
 * Reference: 03-ModernFrontEnd.pdf - State Management Pattern
 * 
 * Usage:
 *   const { user, isAuthenticated, login, logout, register } = useAuth()
 */

import { ref, computed } from 'vue'
import { authAPI } from '../services/api'

// Global state - shared across all component instances
// Reference: 03-ModernFrontEnd.pdf - Centralized state management
const user = ref(null)
const loading = ref(false)
const errors = ref([])

export function useAuth() {
  const login = async (email, password) => {
    loading.value = true
    try {
      const data = await authAPI.login({ email, password })
      if (data.error) {
        throw new Error(data.error)
      }
      user.value = data.user
      sessionStorage.setItem('user', JSON.stringify(data.user))
      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    try {
      const data = await authAPI.register(userData)
      if (data.error) {
        throw new Error(data.error)
      }
      user.value = data.user
      sessionStorage.setItem('user', JSON.stringify(data.user))
      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await authAPI.logout()
      user.value = null
      sessionStorage.removeItem('user')
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const checkSession = async () => {
    loading.value = true
    try {
      const data = await authAPI.getSession()
      user.value = data.user
      if (data.user) {
        sessionStorage.setItem('user', JSON.stringify(data.user))
      } else {
        sessionStorage.removeItem('user')
      }
      return data.user
    } catch (error) {
      user.value = null
      sessionStorage.removeItem('user')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Computed property to check if user is authenticated
   * Reference: 04-vue.pdf - Computed Properties
   */
  const isAuthenticated = computed(() => user.value !== null)

  return {
    // State
    user,
    loading,
    errors,
    isAuthenticated,
    
    // Methods
    login,
    register,
    logout,
    checkSession
  }
}
