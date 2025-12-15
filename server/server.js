
// Server - Express app with MySQL database

const express = require('express')
const session = require('express-session')
const { initDatabase } = require('./database')

const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const profileRoutes = require('./routes/profileRoutes')
const contactRoutes = require('./routes/contactRoutes')

const { errorHandler } = require('./middleware/errorHandler')

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.static('../client/dist'))

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

// SPA routing
app.get('*', (req, res) => {
  res.sendFile('../client/dist/index.html', { root: __dirname })
})

app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    await initDatabase()
    console.log('Database connected')

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Server start failed:', error)
    process.exit(1)
  }
}

startServer()

module.exports = app
