const API_BASE = 'http://localhost:3000/api'

// Auth API
export const authAPI = {
  async register(userData) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData)
    })
    return response.json()
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    })
    return response.json()
  },

  async logout() {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    return response.json()
  },

  async getSession() {
    const response = await fetch(`${API_BASE}/auth/session`, {
      credentials: 'include'
    })
    return response.json()
  }
}

// Product API
export const productAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE}/products`)
    return response.json()
  },

  async getById(id) {
    const response = await fetch(`${API_BASE}/products/${id}`)
    return response.json()
  }
}

// Cart API
export const cartAPI = {
  async get() {
    const response = await fetch(`${API_BASE}/cart`, {
      credentials: 'include'
    })
    return response.json()
  },

  async add(productId, size, color, quantity = 1) {
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId, size, color, quantity })
    })
    return response.json()
  },

  async remove(itemId) {
    const response = await fetch(`${API_BASE}/cart/${itemId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    return response.json()
  },

  async clear() {
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'DELETE',
      credentials: 'include'
    })
    return response.json()
  }
}

// Order API
export const orderAPI = {
  async create(orderData) {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(orderData)
    })
    return response.json()
  },

  async getAll() {
    const response = await fetch(`${API_BASE}/orders`, {
      credentials: 'include'
    })
    return response.json()
  }
}

// Profile API
export const profileAPI = {
  async get() {
    const response = await fetch(`${API_BASE}/profile`, {
      credentials: 'include'
    })
    return response.json()
  }
}
