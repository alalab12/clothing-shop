/**
 * API Service Module
 * 
 * Centralized API client for all backend communication
 * Handles HTTP requests to the backend API
 * 
 * Pattern: API Service Layer for separation of concerns
 * Reference: 03-ModernFrontEnd.pdf - Service layer pattern
 * Reference: 05-ModernBackEnd.pdf - RESTful API design
 * 
 * Usage:
 *   import { authAPI, productAPI, cartAPI } from '@/services/api'
 *   const result = await authAPI.login({ email, password })
 */

const API_BASE = 'http://localhost:3000/api'

/**
 * Helper function to handle API responses
 * Checks for errors and returns parsed JSON
 */
const handleResponse = async (response) => {
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`)
  }
  
  return data
}

/**
 * Authentication API Service
 * Handles user registration, login, logout, and session management
 * 
 * Reference: 07-Authentication and database.pdf - Stateful Authentication
 */
export const authAPI = {
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} User object with ID and email
   */
  async register(userData) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // Include cookies for session
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials {email, password}
   * @returns {Promise} User object
   */
  async login(credentials) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    })
    return handleResponse(response)
  },

  /**
   * Logout user
   */
  async logout() {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    return handleResponse(response)
  },

  /**
   * Get current session/user info
   */
  async getSession() {
    const response = await fetch(`${API_BASE}/auth/session`, {
      credentials: 'include'
    })
    return response.json()  // Don't throw error for session check
  }
}

/**
 * Product API Service
 * Handles product-related requests
 */
export const productAPI = {
  /**
   * Fetch all products
   * @returns {Promise} Array of products
   */
  async getAll() {
    const response = await fetch(`${API_BASE}/products`)
    return handleResponse(response)
  },

  /**
   * Fetch product by ID
   * @param {number} id - Product ID
   * @returns {Promise} Product object with available stock info
   */
  async getById(id) {
    const response = await fetch(`${API_BASE}/products/${id}`)
    return handleResponse(response)
  }
}

/**
 * Cart API Service
 * Handles shopping cart operations
 * All methods require authentication
 */
export const cartAPI = {
  /**
   * Get user's cart
   * @returns {Promise} Array of cart items
   */
  async get() {
    const response = await fetch(`${API_BASE}/cart`, {
      credentials: 'include'
    })
    return handleResponse(response)
  },

  /**
   * Add item to cart
   * @param {number} productId - Product ID
   * @param {string} size - Product size
   * @param {string} color - Product color
   * @param {number} quantity - Item quantity
   */
  async add(productId, size, color, quantity = 1) {
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId, size, color, quantity })
    })
    return handleResponse(response)
  },

  /**
   * Remove item from cart
   * @param {number} itemId - Cart item ID
   */
  async remove(itemId) {
    const response = await fetch(`${API_BASE}/cart/${itemId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    return handleResponse(response)
  },

  /**
   * Clear entire cart
   */
  async clear() {
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'DELETE',
      credentials: 'include'
    })
    return handleResponse(response)
  }
}

/**
 * Order API Service
 * Handles order creation and retrieval
 * All methods require authentication
 */
export const orderAPI = {
  /**
   * Create new order from cart
   * Stock is decremented on successful order creation
   * @param {Object} orderData - Order data {total, shippingAddress}
   * @returns {Promise} Order ID
   */
  async create(orderData) {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(orderData)
    })
    return handleResponse(response)
  },

  /**
   * Get user's orders
   * @returns {Promise} Array of user's orders
   */
  async getAll() {
    const response = await fetch(`${API_BASE}/orders`, {
      credentials: 'include'
    })
    return handleResponse(response)
  }
}

/**
 * Profile API Service
 * Handles user profile operations
 */
export const profileAPI = {
  /**
   * Get authenticated user's profile
   */
  async get() {
    const response = await fetch(`${API_BASE}/profile`, {
      credentials: 'include'
    })
    return handleResponse(response)
  }
}

/**
 * Contact API Service
 * Handles contact form submissions
 * Public endpoint - no authentication required
 */
export const contactAPI = {
  /**
   * Send contact message
   * @param {Object} data - Contact data {email, message}
   */
  async send(data) {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  }
}
