<template>
  <div class="payment-page">
    <div class="container">
      <h1>Checkout</h1>

      <div class="checkout-content">
        <div class="shipping-form">
          <h2>Shipping Information</h2>
          
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Street Address</label>
              <input 
                type="text" 
                v-model="address.street" 
                required 
                placeholder="123 Main St"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  v-model="address.city" 
                  required 
                  placeholder="Nanjing"
                />
              </div>

              <div class="form-group">
                <label>Postal Code</label>
                <input 
                  type="text" 
                  v-model="address.postalCode" 
                  required 
                  placeholder="210000"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Country</label>
              <input 
                type="text" 
                v-model="address.country" 
                required 
                placeholder="China"
              />
            </div>

            <button type="submit" class="submit-btn" :disabled="submitting">
              {{ submitting ? 'Processing...' : 'Finish' }}
            </button>
          </form>
        </div>

        <div class="order-summary">
          <h2>Order Summary</h2>
          <div class="summary-items">
            <div 
              v-for="item in cart.items.value" 
              :key="item.id"
              class="summary-item"
            >
              <span>{{ item.name }} ({{ item.size }}) × {{ item.quantity }}</span>
              <span>¥{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
          <div class="summary-total">
            <span>Total</span>
            <span>¥{{ cart.cartTotal.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'
import { orderAPI } from '../services/api'

export default {
  name: 'Payment',
  setup() {
    const router = useRouter()
    const cart = useCart()

    const address = ref({
      street: '',
      city: '',
      postalCode: '',
      country: ''
    })
    
    const error = ref('')
    const submitting = ref(false)

    const handleSubmit = async () => {
      error.value = ''
      submitting.value = true

      try {
        const result = await orderAPI.create({
          total: cart.cartTotal.value,
          shippingAddress: address.value
        })

        if (result.error) {
          throw new Error(result.error)
        }

        router.push({
          path: '/order-confirmation',
          query: {
            orderId: result.orderId,
            total: cart.cartTotal.value
          }
        })
      } catch (err) {
        alert(err.message || 'Failed to create order')
      } finally {
        submitting.value = false
      }
    }

    onMounted(() => {
      if (cart.items.value.length === 0) {
        cart.syncWithServer().then(() => {
          if (cart.items.value.length === 0) {
            router.push('/cart')
          }
        })
      }
    })

    return {
      cart,
      address,
      error,
      submitting,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.payment-page {
  padding: 4rem 0;
  min-height: calc(100vh - 80px);
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: 500;
}

.checkout-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

.shipping-form h2, .order-summary h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #000;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.submit-btn {
  width: 100%;
  background: #000;
  color: #fff;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
}

.submit-btn:hover:not(:disabled) {
  background: #333;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.order-summary {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  height: fit-content;
}

.summary-items {
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 2px solid #ddd;
  font-size: 1.25rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
}
</style>
