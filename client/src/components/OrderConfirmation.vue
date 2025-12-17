<template>
  <div class="confirmation-page">
    <div class="container">
      <div class="confirmation-card">
        <div class="success-header">
          <h2>Thank you for your order</h2>
          <p>Your order will be delivered on {{ deliveryDate }}</p>
        </div>

        <div class="order-details">
          <div class="detail-row">
            <span>Order Number</span>
            <span class="order-number">#{{ orderId }}</span>
          </div>
          
          <div class="detail-row">
            <span>Order Date</span>
            <span>{{ orderDate }}</span>
          </div>
          
          <div class="detail-row">
            <span>Estimated Delivery</span>
            <span>{{ deliveryDate }}</span>
          </div>
          
          <div class="detail-row total">
            <span>Total</span>
            <span>¥{{ orderTotal }}</span>
          </div>
        </div>

        <div class="actions">
          <router-link to="/" class="btn-primary">Continue Shopping</router-link>
          <router-link to="/profile" class="btn-secondary">View Orders</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Simple: OrderConfirmation — shows order success and details
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'OrderConfirmation',
  setup() {
    const route = useRoute()
    const orderId = ref('')
    const orderTotal = ref('0.00')
    const orderDate = ref('')
    const deliveryDate = ref('')

    onMounted(() => {
      orderId.value = route.query.orderId || '0000'
      orderTotal.value = route.query.total || '0.00'

      const now = new Date()
      orderDate.value = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      const delivery = new Date(now)
      delivery.setDate(delivery.getDate() + 3)
      deliveryDate.value = delivery.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    })

    return {
      orderId,
      orderTotal,
      orderDate,
      deliveryDate
    }
  }
}
</script>

<style scoped>
.confirmation-page {
  padding: 4rem 0;
  min-height: calc(100vh - 80px);
  background: #f9f9f9;
}

.confirmation-card {
  background: #fff;
  border-radius: 8px;
  padding: 3rem;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.success-header {
  text-align: center;
  margin-bottom: 3rem;
}

.success-header h1 {
  font-size: 4rem;
  color: #28a745;
  margin-bottom: 1rem;
}

.success-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.success-header p {
  color: #666;
  font-size: 1.1rem;
}

.order-details {
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.order-number {
  font-weight: 500;
  font-family: 'Courier New', monospace;
}

.detail-row.total {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-direction: column;
}

.btn-primary, .btn-secondary {
  display: block;
  text-align: center;
  padding: 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #000;
  color: #fff;
}

.btn-primary:hover {
  background: #333;
}

.btn-secondary {
  background: #fff;
  color: #000;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  border-color: #000;
}
</style>
