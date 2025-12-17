<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-header">
        <h1>My Profile</h1>
        <button @click="handleLogout" class="logout-btn">Log Out</button>
      </div>

      <div v-if="loading" class="loading">Loading...</div>

      <div v-else class="profile-content">
        <div class="profile-card">
          <h2>Account Information</h2>
          <div class="info-row">
            <span class="label">Name</span>
            <span>{{ user?.firstName }} {{ user?.lastName }}</span>
          </div>
          <div class="info-row">
            <span class="label">Email</span>
            <span>{{ user?.email }}</span>
          </div>
          <div class="info-row" v-if="user?.phone">
            <span class="label">Phone</span>
            <span>{{ user?.phone }}</span>
          </div>
        </div>

        <div v-if="!auth.isAdmin.value" class="orders-section">
          <h2>Order History</h2>
          
          <div v-if="orders.length === 0" class="no-orders">
            <p>No orders yet</p>
            <router-link to="/" class="shop-btn">Start Shopping</router-link>
          </div>

          <div v-else class="orders-list">
            <div 
              v-for="order in orders" 
              :key="order.id"
              class="order-card"
            >
              <div class="order-header">
                <div>
                  <p class="order-number">Order #{{ order.id }}</p>
                  <p class="order-date">{{ formatDate(order.createdAt) }}</p>
                </div>
                <div class="order-total">¥{{ parseFloat(order.total).toFixed(2) }}</div>
              </div>
              <div class="order-status">
                <span :class="['status-badge', order.status]">
                  {{ order.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Simple: Profile — user profile page component
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { profileAPI, orderAPI } from '../services/api'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'Profile',
  setup() {
    const router = useRouter()
    const auth = useAuth()
    const user = ref(null)
    const orders = ref([])
    const loading = ref(true)

    const loadProfile = async () => {
      loading.value = true
      try {
        const profileData = await profileAPI.get()
        user.value = profileData.user

        const ordersData = await orderAPI.getAll()
        orders.value = ordersData.orders || []
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        loading.value = false
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const handleLogout = async () => {
      await auth.logout()
      router.push('/login')
    }

    onMounted(() => {
      loadProfile()
    })

    return {
      auth,
      user,
      orders,
      loading,
      formatDate,
      handleLogout
    }
  }
}
</script>

<style scoped>
.profile-page {
  padding: 3.5rem 0 4.5rem;
  min-height: calc(100vh - 80px);
  background: var(--color-bg-page);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.2rem;
}

h1 {
  font-size: 1.95rem;
  margin-bottom: 0;
  font-weight: var(--font-weight-medium);
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.logout-btn {
  background: transparent;
  border: 1px solid #c0c0c0;
  color: var(--color-text-primary);
  padding: 0.7rem 1.4rem;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: all 0.18s ease;
}

.logout-btn:hover {
  background: var(--color-text-primary);
  color: var(--color-bg-card);
  border-color: var(--color-text-primary);
  transform: translateY(-1px);
}

.loading {
  text-align: center;
  padding: 4.5rem 0;
  color: var(--color-text-secondary);
}

.profile-content {
  display: grid;
  gap: 2.8rem;
}

.profile-card {
  background: var(--color-bg-card);
  padding: 1.8rem 2.2rem;
  border-radius: 3px;
  border: 1px solid #e8e7e3;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.profile-card h2 {
  font-size: 1.35rem;
  margin-bottom: 1.7rem;
  font-weight: var(--font-weight-medium);
  letter-spacing: -0.01em;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.95rem 0;
  border-bottom: 1px solid #ececea;
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  font-size: 0.94rem;
}

.orders-section h2 {
  font-size: 1.35rem;
  margin-bottom: 1.7rem;
  font-weight: var(--font-weight-medium);
  letter-spacing: -0.01em;
}

.no-orders {
  text-align: center;
  padding: 3.5rem 0;
  background: var(--color-bg-card);
  border-radius: 3px;
  border: 1px solid #e8e7e3;
}

.no-orders p {
  color: var(--color-text-secondary);
  margin-bottom: 1.8rem;
  font-size: 1.05rem;
  line-height: 1.5;
}

.shop-btn {
  display: inline-block;
  background: var(--color-text-primary);
  color: var(--color-bg-card);
  padding: 0.85rem 1.7rem;
  text-decoration: none;
  border-radius: 3px;
  transition: all 0.18s ease;
  font-weight: var(--font-weight-medium);
  font-size: 0.88rem;
  letter-spacing: 0.02em;
}

.shop-btn:hover {
  background: #2a2a2a;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.order-card {
  background: var(--color-bg-card);
  padding: 1.6rem 1.9rem;
  border-radius: 3px;
  border: 1px solid #e8e7e3;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.18s ease;
}

.order-card:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.1rem;
}

.order-number {
  font-weight: var(--font-weight-semibold);
  font-size: 1.06rem;
  margin-bottom: 0.35rem;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.02em;
}

.order-date {
  color: var(--color-text-secondary);
  font-size: 0.88rem;
}

.order-total {
  font-size: 1.2rem;
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.01em;
}

.status-badge {
  display: inline-block;
  padding: 0.55rem 1.1rem;
  border-radius: 2px;
  font-size: 0.84rem;
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
  letter-spacing: 0.03em;
  border: 1px solid;
}

.status-badge.confirmed {
  background: #e8f5e9;
  color: #2e7d32;
  border-color: #c8e6c9;
}

.status-badge.pending {
  background: #fff8e1;
  color: #f57c00;
  border-color: #ffe082;
}
</style>
