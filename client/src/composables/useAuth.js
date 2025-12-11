import { ref } from 'vue'
import { authAPI } from '../services/api'

// État global partagé entre toutes les instances
const user = ref(null)
const loading = ref(false)

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

  const isAuthenticated = () => {
    return user.value !== null
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    checkSession,
    isAuthenticated
  }
}
