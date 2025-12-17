// API Service Module
// Centralized API client for all backend communication


// Base API URL
const API_BASE = '/api'

// Handle API responses and errors
const handleResponse = async (response) => {
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`)
  }
  
  return data
}

// Authentication API Service
// Handles user registration, login, logout, and session management

export const authAPI = {
  // Register new user
  async register(userData) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // Include cookies for session
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  // Login user
  async login(credentials) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    })
    return handleResponse(response)
  },

  // Logout user
  async logout() {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    return handleResponse(response)
  },

  // Get current session/user info
  async getSession() {
    const response = await fetch(`${API_BASE}/auth/session`, {
      credentials: 'include'
    })
    return response.json()  
  }
}

// Product API Service
// Handles product-related requests
export const productAPI = {
  // Fetch all products
  async getAll() {
    const response = await fetch(`${API_BASE}/products`)
    const data = await handleResponse(response)
    // Normalize image paths: ensure leading slash so `<img :src>` works consistently
    if (data && Array.isArray(data.products)) {
      data.products = data.products.map(p => ({
        ...p,
        image: p.image && !p.image.startsWith('/') ? '/' + p.image : p.image
      }))
    }
    return data
  },

  // Fetch product by ID
  async getById(id) {
    const response = await fetch(`${API_BASE}/products/${id}`)
    const data = await handleResponse(response)
    if (data && data.product && data.product.image && !data.product.image.startsWith('/')) {
      data.product.image = '/' + data.product.image
    }
    return data
  }
}

// Cart API Service
// Handles shopping cart operations
// All methods require authentication
export const cartAPI = {
  // Get user's cart
  async get() {
    const response = await fetch(`${API_BASE}/cart`, {
      credentials: 'include'
    })
    return handleResponse(response)
  },

  // Add item to cart
  async add(productId, size, quantity = 1) {
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId, size, quantity })
    })
    return handleResponse(response)
  },

  // Remove item from cart
  async remove(itemId) {
    const response = await fetch(`${API_BASE}/cart/${itemId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    return handleResponse(response)
  }
}

// Order API Service
// Handles order creation and retrieval
// All methods require authentication
export const orderAPI = {
  // Create new order from cart
  // Stock is decremented on successful order creation
  async create(orderData) {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(orderData)
    })
    return handleResponse(response)
  },

  // Get user's orders
  async getAll() {
    const response = await fetch(`${API_BASE}/orders`, {
      credentials: 'include'
    })
    return handleResponse(response)
  }
}

// Profile API Service
// Handles user profile operations
export const profileAPI = {
  // Get authenticated user's profile
  async get() {
    const response = await fetch(`${API_BASE}/profile`, {
      credentials: 'include'
    })
    return handleResponse(response)
  }
}

// Contact API Service
// Handles contact form submissions
export const contactAPI = {
  // Send contact message
  async send(data) {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  }
}
