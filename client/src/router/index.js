import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../components/HomePage.vue'
import Jeans from '../components/Jeans.vue'
import TShirts from '../components/TShirts.vue'
import Dresses from '../components/Dresses.vue'
import Jackets from '../components/Jackets.vue'
import Skirts from '../components/Skirts.vue'
import Suiting from '../components/Suiting.vue'
import Accessories from '../components/Accessories.vue'
import Cart from '../components/Cart.vue'
import Register from '../components/Register.vue'
import ProductDetails from '../components/ProductDetails.vue'
import Login from '../components/Login.vue'
import Profile from '../components/Profile.vue'
import OrderConfirmation from '../components/OrderConfirmation.vue'
import Payment from '../components/Payment.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/jeans', component: Jeans },
  { path: '/t-shirts', component: TShirts },
  { path: '/dresses', component: Dresses },
  { path: '/jackets', component: Jackets },
  { path: '/skirts', component: Skirts },
  { path: '/suiting', component: Suiting },
  { path: '/accessories', component: Accessories },
  { path: '/cart', component: Cart },
  { path: '/register', component: Register },
  { path: '/product/:id', component: ProductDetails, props: true },
  { path: '/login', component: Login },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/payment', component: Payment, meta: { requiresAuth: true } },
  { path: '/order-confirmation', component: OrderConfirmation, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Simple navigation guard for auth pages
router.beforeEach((to, from, next) => {
  const user = JSON.parse(sessionStorage.getItem('user') || 'null')
  
  if (to.meta.requiresAuth && !user) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  next()
})

export default router
