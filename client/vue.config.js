// Vue CLI configuration for the client app
// This sets up a devServer proxy so frontend calls to /api
// are forwarded to our Express backend on port 3000.
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // Transpile dependencies if needed by Vue CLI
  transpileDependencies: true,

  // Development server configuration
  devServer: {
    proxy: {
      // Forward all /api requests to the backend server
      '/api': {
        // Backend API base URL (Express server)
        target: 'http://localhost:3000',
        // Adjust the origin header to match the target
        changeOrigin: true
      }
    }
  }
})
