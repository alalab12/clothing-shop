<template>
  <div class="cart-page">
    <div class="container">
      <div v-if="!auth.isAuthenticated.value" class="auth-required">
        <h1>Please Sign In</h1>
        <p>You need to be logged in to view your cart.</p>
        <div class="auth-links">
          <router-link to="/login" class="btn-primary">Login</router-link>
          <router-link to="/register" class="btn-secondary">Create Account</router-link>
        </div>
      </div>

      <div v-else>
        <h1>Shopping Cart</h1>

        <div v-if="loading" class="loading">Loading cart...</div>

        <div v-else-if="cart.items.value.length === 0" class="empty-cart">
          <p>Your cart is empty</p>
          <router-link to="/" class="continue-shopping">Continue Shopping</router-link>
        </div>

        <div v-else class="cart-content">
        <div class="cart-items">
          <div 
            v-for="item in cart.items.value" 
            :key="item.id"
            class="cart-item"
          >
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <p class="item-meta">Size: {{ item.size }}</p>
              <p class="item-meta" v-if="item.color">Color: {{ item.color }}</p>
              <p class="item-quantity">Quantity: {{ item.quantity }}</p>
            </div>

            <div class="item-price">
              <p>¥{{ item.price * item.quantity }}</p>
              <button @click="removeItem(item.id)" class="remove-btn">
                Remove
              </button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>¥{{ cart.cartTotal.value }}</span>
          </div>
          <div class="summary-total">
            <span>Total</span>
            <span>¥{{ cart.cartTotal.value }}</span>
          </div>
          <button @click="proceedToCheckout" class="checkout-btn">
            Proceed to Checkout
          </button>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Simple: Cart — Vue component showing the user's shopping cart
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'Cart',

  setup() {
    const router = useRouter()
    const cart = useCart()
    const auth = useAuth()


    const removeItem = async (itemId) => {
      await cart.removeItem(itemId)
    }


    const proceedToCheckout = () => {
      router.push('/payment')
    }


    onMounted(() => {
      if (auth.isAuthenticated.value) {
        cart.syncWithServer()
      }
    })


    return {
      cart,
      auth,
      loading: cart.loading,
      removeItem,
      proceedToCheckout
    }
  }
}
</script>

<style scoped>
/* Page container */
.cart-page {
  padding: 3.5rem 0 4.5rem;
  min-height: calc(100vh - 80px);
  background: var(--color-bg-page);
}


/* Page title */
h1 {
  font-size: 1.95rem;
  margin-bottom: 2.2rem;
  font-weight: var(--font-weight-medium);
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}


/* Auth required section */
.auth-required {
  text-align: center;
  padding: 3.5rem 2rem;
  max-width: 520px;
  margin: 0 auto;
  background: var(--color-bg-card);
  border-radius: 3px;
  border: 1px solid #e8e7e3;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.auth-required h1 {
  margin-bottom: 1.2rem;
  color: var(--color-text-primary);
}

.auth-required p {
  font-size: 1.05rem;
  color: var(--color-text-secondary);
  margin-bottom: 2.2rem;
  line-height: 1.5;
}

.auth-links {
  display: flex;

/* Buttons */
  gap: 1.1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 0.85rem 1.6rem;
  text-decoration: none;
  border-radius: 3px;
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.82rem;
  transition: all 0.18s ease;
}

.btn-primary {
  background: var(--color-text-primary);
  color: var(--color-bg-card);
  border: 1px solid var(--color-text-primary);
}

.btn-primary:hover {
  background: #2a2a2a;
  border-color: #2a2a2a;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid #c0c0c0;
}

.btn-secondary:hover {
  background: var(--color-text-primary);
  color: var(--color-bg-card);
  border-color: var(--color-text-primary);
  transform: translateY(-1px);

/* Loading and empty cart states */
}

.loading, .empty-cart {
  text-align: center;
  padding: 4.5rem 2rem;
  background: var(--color-bg-card);
  border-radius: 3px;
  border: 1px solid #e8e7e3;
}

.empty-cart p {
  font-size: 1.15rem;
  margin-bottom: 2.1rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.continue-shopping {
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

.continue-shopping:hover {
  background: #2a2a2a;

/* Cart layout */
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-content {
  display: grid;

/* Cart items list */
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;
}


/* Individual cart item */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 115px 1fr auto;
  gap: 1.6rem;
  padding: 1.4rem 1.7rem;
  background: var(--color-bg-card);
  border-radius: 3px;
  border: 1px solid #e8e7e3;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.18s ease;
}

.cart-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.item-image {
  width: 115px;
  aspect-ratio: 3/4;
  overflow: hidden;
  border-radius: 2px;
  background: #fafafa;
  border: 1px solid #eeeeee;
}


/* Item details */
.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details h3 {
  font-size: 1.08rem;
  margin-bottom: 0.6rem;
  font-weight: var(--font-weight-medium);
  letter-spacing: -0.01em;
}

.item-meta {
  color: var(--color-text-secondary);
  font-size: 0.88rem;
  margin-bottom: 0.3rem;

/* Item price section */
}

.item-quantity {
  font-size: 0.88rem;
  margin-top: 0.6rem;
  color: var(--color-text-secondary);
}

.item-price {
  text-align: right;
}

.item-price p {
  font-size: 1.2rem;
  font-weight: var(--font-weight-semibold);
  margin-bottom: 1.1rem;
  letter-spacing: -0.01em;
}

.remove-btn {
  background: var(--color-bg-card);
  border: 1px solid #c0c0c0;
  color: var(--color-text-primary);
  padding: 0.6rem 1.15rem;
  border-radius: 2px;
  cursor: pointer;
  font-size: 0.84rem;
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  transition: all 0.18s ease;
}

/* Cart summary section */

.remove-btn:hover {
  background: var(--color-text-primary);
  border-color: var(--color-text-primary);
  color: var(--color-bg-card);
  transform: translateY(-1px);
}

.cart-summary {
  background: var(--color-bg-card);
  padding: 1.8rem 2.1rem;
  border-radius: 3px;
  border: 1px solid #e8e7e3;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  height: fit-content;
}

.cart-summary h2 {
  font-size: 1.35rem;
  margin-bottom: 1.7rem;
  font-weight: var(--font-weight-medium);
  letter-spacing: -0.01em;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.1rem;
  font-size: 0.98rem;
  color: var(--color-text-secondary);
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding-top: 1.1rem;
  border-top: 1px solid #e0e0e0;
  font-size: 1.22rem;
  font-weight: var(--font-weight-semibold);
  margin-bottom: 1.9rem;
  letter-spacing: -0.01em;
}

.checkout-btn {
  width: 100%;
  background: var(--color-text-primary);
  color: var(--color-bg-card);
  border: none;
  padding: 0.95rem;
  border-radius: 3px;
  font-size: 0.94rem;
  cursor: pointer;
  transition: all 0.18s ease;
  font-weight: var(--font-weight-medium);

/* Mobile responsive */
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.checkout-btn:hover {
  background: #2a2a2a;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 80px 1fr;
  }

  .item-price {
    grid-column: 2;
    text-align: left;
    margin-top: 1rem;
  }
}
</style>
