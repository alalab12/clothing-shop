/**
 * Vue Application Entry Point
 * 
 * Initializes the Vue 3 application with:
 * - Router configuration for client-side navigation (SPA)
 * - Global styling
 * - Plugin registration
 * 
 * Pattern: Single Page Application (SPA) with client-side routing
 * Reference: 03-ModernFrontEnd.pdf - Single Page Applications
 * Reference: 04-vue.pdf - Vue Application Setup
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/**
 * Create and mount Vue application
 * 
 * Flow:
 * 1. Create app instance from root component (App.vue)
 * 2. Register router for client-side navigation
 * 3. Mount app to DOM element with id="app"
 */
const app = createApp(App)

// Register router for navigation
// Reference: 03-ModernFrontEnd.pdf - Front-end Routing
app.use(router)

// Mount application to #app element in index.html
app.mount('#app')

