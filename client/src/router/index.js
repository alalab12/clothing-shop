// Vue Router configuration
// Manages client-side navigation and page routing

import { createRouter, createWebHistory } from 'vue-router' // Router setup

// Import all page components
import HomePage from '../components/HomePage.vue'
import Jeans from '../components/Jeans.vue'
import TShirts from '../components/TShirts.vue'
import Sweaters from '../components/Dresses.vue'
import Jackets from '../components/Jackets.vue'
import Accessories from '../components/Accessories.vue'
import Cart from '../components/Cart.vue'
import Register from '../components/Register.vue'
import ProductDetails from '../components/ProductDetails.vue'
import Login from '../components/Login.vue'
import Profile from '../components/Profile.vue'
import OrderConfirmation from '../components/OrderConfirmation.vue'
import Payment from '../components/Payment.vue'
import Contact from '../components/Contact.vue'

const routes = [
  // Public routes
  { path: '/', component: HomePage }, // Home page
  { path: '/jeans', component: Jeans }, // Jeans category
  { path: '/t-shirts', component: TShirts },
  { path: '/sweaters', component: Sweaters },
  { path: '/jackets', component: Jackets },
  { path: '/accessories', component: Accessories },
  { path: '/cart', component: Cart },
  { path: '/register', component: Register },
  { path: '/product/:id', component: ProductDetails, props: true },
  { path: '/login', component: Login },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/payment', component: Payment, meta: { requiresAuth: true } },
  { path: '/order-confirmation', component: OrderConfirmation, meta: { requiresAuth: true } },
  { path: '/contact', component: Contact },
]

// Create router instance
const router = createRouter({
  history: createWebHistory(), // Use browser history
  routes // Routes list
})

// Check authentication on page navigation
// Redirect to login if accessing protected pages
router.beforeEach((to, from, next) => {
  // Get user from session storage
  const user = JSON.parse(sessionStorage.getItem('user') || 'null')
  
  // Require login for protected pages
  if (to.meta.requiresAuth && !user) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  next()
})

export default router
