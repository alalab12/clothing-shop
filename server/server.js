/**
 * Clothing Shop API Server
 * 
 * Main application entry point
 * 
 * Architecture: Modern Backend with MVC Pattern
 * - Routes: API endpoints with proper HTTP methods
 * - Controllers: Request/response handling
 * - Services: Business logic
 * - Middlewares: Authentication, validation, error handling
 * 
 * Reference: 
 * - 05-ModernBackEnd.pdf: MVC Architecture, API Design
 * - 06-Nodejs.pdf: Express.js, Middleware, Routing
 * - 07-Authentication and database.pdf: Session-based authentication
 */

const express = require('express')
const session = require('express-session')
const cors = require('cors')
const { initDatabase } = require('./database')

// Import routes
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const profileRoutes = require('./routes/profileRoutes')
const contactRoutes = require('./routes/contactRoutes')

// Import middleware
const { errorHandler } = require('./middleware/errorHandler')

const app = express()
const PORT = 3000

// ===== CONFIGURATION =====

/**
 * CORS Configuration
 * Allow requests from frontend (localhost:8080, 8081)
 * Credentials enabled for session cookies
 * 
 * Reference: 06-Nodejs.pdf - CORS configuration
 */
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081'],
  credentials: true
}))

/**
 * Body Parser Middleware
 * Parse JSON request bodies
 */
app.use(express.json())

/**
 * Session Configuration
 * Implements stateful authentication using express-session
 * 
 * Reference: 07-Authentication and database.pdf - Stateful Authentication
 * - secret: Used to sign the session ID cookie
 * - resave: Don't save session if unmodified
 * - saveUninitialized: Don't create session until something stored
 * - secure: false (set to true in production with HTTPS)
 * - httpOnly: Cookie not accessible by client-side JavaScript (prevents XSS)
 * - sameSite: 'lax' prevents CSRF attacks
 */
app.use(session({
  secret: 'clothing-shop-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,        // Set to true in production with HTTPS
    httpOnly: true,       // Prevents JavaScript from accessing the cookie
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    sameSite: 'lax'       // CSRF protection
  }
}))


// ===== ROUTES =====

/**
 * Route Organization
 * Routes are modular and grouped by feature
 * Each route file contains related endpoints
 * 
 * Pattern: RESTful API design
 * Reference: 05-ModernBackEnd.pdf & 06-Nodejs.pdf
 */

// Authentication routes (public)
app.use('/api/auth', authRoutes)

// Product routes (public)
app.use('/api/products', productRoutes)

// Cart routes (protected)
app.use('/api/cart', cartRoutes)

// Order routes (protected)
app.use('/api/orders', orderRoutes)

// Profile routes (protected)
app.use('/api/profile', profileRoutes)

// Contact routes (public)
app.use('/api/contact', contactRoutes)

// ===== ERROR HANDLING =====

/**
 * Global Error Handler
 * Must be registered as the last middleware
 * 
 * Reference: 06-Nodejs.pdf - Error-handling middleware
 */
app.use(errorHandler)

// ===== SERVER INITIALIZATION =====

/**
 * Initialize database and start server
 * Uses async/await for cleaner error handling
 */
const startServer = async () => {
  try {
    // Initialize database (create tables if needed)
    await initDatabase()
    console.log('✓ Database initialized')

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`)
      console.log(`✓ CORS enabled for http://localhost:8080, 8081`)
    })
  } catch (error) {
    console.error('✗ Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()

module.exports = app
