

import { createApp } from 'vue'// Vue.js framework
import App from './App.vue'// Root application component
import router from './router'// Vue Router for navigation

// Create Vue application instance
const app = createApp(App)

// Use Vue Router for client-side routing
app.use(router)

// Mount the application to the DOM
app.mount('#app')

