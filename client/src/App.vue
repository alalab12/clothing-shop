
<template>
  <div id="app">

    <NavBar />
    <main class="page-shell">
      <router-view />
    </main>

    <footer class="site-footer">
      <div class="footer-links">
        <a href="#" @click.prevent="scrollToSection('about')">About us</a> 
        <a href="#" @click.prevent="scrollToSection('contact')">Contact</a>
      </div>
    </footer>

  </div>
</template>




<script>
// Root application component
// Manages layout, navigation, and global state

import { onMounted } from 'vue' // Vue lifecycle
import NavBar from './components/NavBar.vue' // Navigation bar
import { useAuth } from './composables/useAuth' // Auth state

export default {
  name: 'App',
  components: { NavBar }, // Register navbar
  setup() {
    const auth = useAuth()

    onMounted(() => {
      // Check session on app load
      auth.checkSession()
    })

    return {}
  },
  methods: {
    // Scroll to section on same page or navigate and scroll
    scrollToSection(sectionId) {
      // Navigate to home if not already there
      if (this.$route.path !== '/') {
        this.$router.push('/').then(() => {
          this.$nextTick(() => {
            this.scrollTo(sectionId)
          })
        })
      } else {
        this.scrollTo(sectionId)
      }
    },
    // Smooth scroll to element
    scrollTo(sectionId) {
      const element = document.getElementById(sectionId) // Find element
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' }) // Scroll smooth
      }
    }
  }
}
</script>

<style>
/* Root Variables */
:root {
  font-family: 'Arial', 'Helvetica', sans-serif;
  color: #222;
  background-color: #f9f8f4;
  line-height: 1.5;
  letter-spacing: 0.05em;
  
  --color-bg-page: #f9f8f4;
  --color-bg-card: #fffffe;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #4a4a4a;
  --color-text-muted: #757575;
  --color-border: #e0e0e0;
  --color-success: #15803d;
  --color-error: #b91c1c;
  --color-warning: #d97706;
  
  --radius-md: 2px;
  --radius-sm: 1px;
  --shadow-md: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  
  --font-weight-normal: 400;
  --font-weight-medium: 450;
  --font-weight-semibold: 500;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--color-bg-page);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-shell {
  flex: 1;
  padding: 1.5rem 1rem 3rem;
}

.site-footer {
  text-align: center;
  padding: 1.5rem 1rem 2.5rem;
  color: #111;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.footer-links {
  margin-top: 0.75rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.footer-links a {
  color: #111;
  text-decoration: none;
  letter-spacing: 0.1em;
  font-size: 0.8rem;
}

/* Global Utility Classes */
.page-container {
  min-height: calc(100vh - 160px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem 3rem;
  background: var(--color-bg-page);
}

.page-container-center {
  align-items: center;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>

