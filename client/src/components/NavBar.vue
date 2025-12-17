<template>
  <div class="nav-wrapper">
    <header class="top-bar">
      <button class="menu-btn" @click="toggleMenu" aria-label="Open the menu">
        ☰
      </button>
      <router-link class="brand" to="/">Clueless</router-link>
      <div class="actions">
        <router-link v-if="!auth.isAdmin.value" to="/cart" class="cart-link">
          <img src="/img/icon/basket.jpg" alt="Panier" class="cart-icon" />
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </router-link>
        <router-link to="/profile" class="profile-link">
          <img src="/img/icon/profile.png" alt="Profil" class="profile-icon" />
        </router-link>
      </div>
    </header>
    <transition name="slide">
      <nav v-if="isOpen" class="menu">
        <router-link v-for="link in links" :key="link.path" :to="link.path" @click="closeMenu">
          {{ link.label }}
        </router-link>
      </nav>
    </transition>
  </div>
</template>

<script>
// Simple: NavBar — top navigation component with links and cart badge
import { computed } from 'vue'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'NavBar',
  setup() {
    const cart = useCart()
    const auth = useAuth()

    const cartCount = computed(() =>
      (cart.items.value || []).reduce((sum, item) => sum + item.quantity, 0)
    )

    return {
      cart,
      auth,
      cartCount
    }
  },
  data() {
    return {
      isOpen: false,
      links: [
        { path: '/sweaters', label: 'Sweaters' },
        { path: '/jeans', label: 'Jeans' },
        { path: '/t-shirts', label: 'T-Shirts' },
        { path: '/jackets', label: 'Jackets' },
        { path: '/accessories', label: 'Accessories' }
      ]
    }
  },
  async mounted() {
    await this.auth.checkSession()
    if (this.auth.isAuthenticated.value) {
      await this.cart.syncWithServer()
    }
  },
  watch: {
    async '$route'() {
      this.isOpen = false
      await this.auth.checkSession()
    }
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen
    },
    closeMenu() {
      this.isOpen = false
    }
  }
}
</script>

<style scoped>
.nav-wrapper {
  position: sticky;
  top: 0;
  z-index: 10;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
}

.menu-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-page);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1.3rem;
  color: var(--color-text-primary);
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-btn:hover {
  background: var(--color-border);
}

.brand {
  text-decoration: none;
  font-weight: 400;
  font-size: 1.4rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-primary);
}

.actions {
  display: flex;
  gap: 0.8rem;
}

.actions a {
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: 600;
}

.cart-link {
  display: flex;
  align-items: center;
  position: relative;
}

.cart-icon {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--color-text-primary);
  color: var(--color-bg-card);
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
}

.profile-link {
  display: flex;
  align-items: center;
}

.profile-icon {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--color-border);
}

.menu {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  padding: 0.5rem 1rem 1rem;
  gap: 0.3rem;
  transition: background 0.3s ease;
}

.menu a {
  text-decoration: none;
  color: var(--color-text-primary);
  padding: 0.35rem 0.5rem;
  border: none;
  border-radius: 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.menu a:hover,
.menu a.router-link-active {
  background: var(--color-text-primary);
  color: var(--color-bg-card);
}


/* Menu slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  transform-origin: top;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
