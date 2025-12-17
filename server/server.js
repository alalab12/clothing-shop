
// Main server file for the Express backend API
// Sets up middleware, routes, error handling, and starts the server

const express = require('express')//Express framework
const session = require('express-session')//Session management
const { initDatabase } = require('./database')//Database initialization

const authRoutes = require('./routes/authRoutes')//Authentication routes
const productRoutes = require('./routes/productRoutes')//Product routes
const cartRoutes = require('./routes/cartRoutes')// Cart routes
const orderRoutes = require('./routes/orderRoutes')// Order routes
const profileRoutes = require('./routes/profileRoutes')//Profile routes
const contactRoutes = require('./routes/contactRoutes')// Contact routes
const adminRoutes = require('./routes/adminRoutes')//Admin routes

const { errorHandler } = require('./middleware/errorHandler')

// Create Express app
const path = require('path')
const app = express()
const PORT = 3000

app.use(express.json())
// Serve public images directly from the client public folder so product.image paths work
app.use('/img', express.static(path.join(__dirname, '../client/public/img')))
// Serve built frontend (if present)
app.use(express.static(path.join(__dirname, '../client/dist')))

app.use(session({
  secret: 'clothing-shop-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)

// SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

app.use(errorHandler)

const http = require('http')

// Start server after DB initialization
const startServer = async () => {
  try {
    await initDatabase()
    console.log('Database connected')

    const server = http.createServer(app)

    const MAX_TRIES = 10
    let attempt = 0

    const tryListen = (port) => {
      server.once('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
          console.warn(`Port ${port} in use, attempting next port`)
          attempt += 1
          if (attempt > MAX_TRIES) {
            console.error(`All ports ${PORT}..${PORT + MAX_TRIES} are in use. Exiting.`)
            process.exit(1)
          } else {
            // try next port
            tryListen(PORT + attempt)
          }
        } else {
          console.error('Server start failed:', err)
          process.exit(1)
        }
      })

      server.once('listening', () => {
        const addr = server.address()
        const host = addr.family === 'IPv6' ? `[::]` : 'localhost'
        console.log(`Server running on http://${host}:${addr.port}`)
      })

      server.listen(port)
    }

    tryListen(PORT)
  } catch (error) {
    console.error('Server start failed:', error)
    process.exit(1)
  }
}

startServer()

module.exports = app
