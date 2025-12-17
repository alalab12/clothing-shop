// Manages user authentication state and operations
// Centralizes all auth-related logic for components

import { ref, computed } from 'vue' // Vue reactivity
import { authAPI } from '../services/api' // API calls

// Global auth state
const user = ref(null) // Current user
const loading = ref(false) // Request status
const errors = ref([]) // Error messages

export function useAuth() {
  // Login user with email and password
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

  
  //Computed property to check if user is authenticated
   
  const isAuthenticated = computed(() => user.value !== null)
  
  // Computed property to check if user is admin
  const isAdmin = computed(() => user.value?.role === 'admin')

  return {
    // State
    user,
    loading,
    errors,
    isAuthenticated,
    isAdmin,
    
    // Methods
    login,
    register,
    logout,
    checkSession
  }
}
