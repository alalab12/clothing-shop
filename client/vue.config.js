// Vue CLI configuration for the client app

const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // Transpile dependencies if needed by Vue CLI
  transpileDependencies: true,

  // Public path configuration
  publicPath: '/',

  // Development server configuration
  devServer: {
    // Port configuration
    port: 8080,
    host: 'localhost',
    
    // Enable hot module replacement
    hot: true,
    
    // Open browser on server start
    open: false,
    
    // Disable host check for development
    allowedHosts: 'all',
    
    // Client configuration
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    },

    // Proxy configuration
    proxy: {
      // Forward all /api requests to the backend server
      '/api': {
        // Backend API base URL (Express server)
        target: 'http://localhost:3000',
        // Adjust the origin header to match the target
        changeOrigin: true,
        // Enable WebSocket proxying
        ws: true
      }
    }
  },

  // Webpack chain configuration
  chainWebpack: config => {
    // Only delete preload and prefetch for performance
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    
    // Configure HTML plugin properly
    config.plugin('html').tap(args => {
      if (args[0]) {
        args[0].title = 'Clueless'
        // Ensure template interpolation works correctly
        args[0].templateParameters = (compilation, assets, assetTags, options) => {
          return {
            compilation,
            webpackConfig: compilation.options,
            htmlWebpackPlugin: {
              tags: assetTags,
              files: assets,
              options
            },
            BASE_URL: '/'
          }
        }
      }
      return args
    })

    // Adjust Copy plugin to ignore index.html
    if (config.plugins.has('copy')) {
      config.plugin('copy').tap(args => {
        const patterns = (args[0] && (args[0].patterns || args[0])) || []
        if (Array.isArray(patterns)) {
          patterns.forEach(p => {
            if (!p.globOptions) p.globOptions = {}
            if (!p.globOptions.ignore) p.globOptions.ignore = []
            if (!p.globOptions.ignore.includes('**/index.html')) {
              p.globOptions.ignore.push('**/index.html')
            }
          })
        }
        return args
      })
    }
  },

  // Configure devtool for better debugging
  configureWebpack: {
    devtool: 'source-map'
  }
})
