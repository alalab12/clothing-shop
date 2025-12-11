const express = require('express')
const session = require('express-session')
const cors = require('cors')
const bcrypt = require('bcrypt')
const { initDatabase, getDb } = require('./database')

const app = express()
const PORT = 3000

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081'],
  credentials: true
}))
app.use(express.json())
app.use(session({
  secret: 'clothing-shop-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}))

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  next()
}

// ===== AUTH ROUTES =====

// Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body
  const db = getDb()

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    db.run(
      'INSERT INTO users (email, password, firstName, lastName, phone) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, phone || null],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email already exists' })
          }
          return res.status(500).json({ error: 'Registration failed' })
        }
        
        req.session.userId = this.lastID
        req.session.save((saveErr) => {
          if (saveErr) {
            return res.status(500).json({ error: 'Session error' })
          }
          res.json({
            user: { id: this.lastID, email, firstName, lastName, phone }
          })
        })
      }
    )
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  const db = getDb()

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    try {
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      req.session.userId = user.id
      req.session.save((saveErr) => {
        if (saveErr) {
          return res.status(500).json({ error: 'Session error' })
        }
        res.json({
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone
          }
        })
      })
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  })
})

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy()
  res.json({ message: 'Logged out' })
})

// Check session
app.get('/api/auth/session', (req, res) => {
  if (!req.session.userId) {
    return res.json({ user: null })
  }

  const db = getDb()
  db.get('SELECT id, email, firstName, lastName, phone FROM users WHERE id = ?', 
    [req.session.userId], 
    (err, user) => {
      if (err || !user) {
        return res.json({ user: null })
      }
      res.json({ user })
    }
  )
})

// ===== PRODUCT ROUTES =====

// Get all products
app.get('/api/products', (req, res) => {
  const db = getDb()
  db.all('SELECT * FROM products ORDER BY category, name', (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch products' })
    }
    res.json({ products })
  })
})

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const db = getDb()
  const { id } = req.params

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err || !product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Get available sizes and colors
    db.all(
      'SELECT DISTINCT size, color FROM stock WHERE productId = ? AND quantity > 0',
      [id],
      (err, stock) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch stock' })
        }

        const sizes = [...new Set(stock.map(s => s.size))]
        const colors = [...new Set(stock.map(s => s.color))]

        res.json({
          product: {
            ...product,
            sizes,
            colors
          }
        })
      }
    )
  })
})

// ===== CART ROUTES =====

// Get cart
app.get('/api/cart', requireAuth, (req, res) => {
  const db = getDb()
  const userId = req.session.userId

  db.all(
    `SELECT ci.id, ci.productId, ci.size, ci.color, ci.quantity,
            p.name, p.price, p.image, p.category
     FROM cart_items ci
     JOIN products p ON ci.productId = p.id
     WHERE ci.userId = ?`,
    [userId],
    (err, items) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch cart' })
      }
      res.json({ items })
    }
  )
})

// Add to cart
app.post('/api/cart', requireAuth, (req, res) => {
  const db = getDb()
  const userId = req.session.userId
  const { productId, size, color, quantity } = req.body

  db.run(
    'INSERT INTO cart_items (userId, productId, size, color, quantity) VALUES (?, ?, ?, ?, ?)',
    [userId, productId, size, color || null, quantity || 1],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add to cart' })
      }
      res.json({ id: this.lastID, message: 'Added to cart' })
    }
  )
})

// Remove from cart
app.delete('/api/cart/:id', requireAuth, (req, res) => {
  const db = getDb()
  const userId = req.session.userId
  const { id } = req.params

  db.run(
    'DELETE FROM cart_items WHERE id = ? AND userId = ?',
    [id, userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to remove item' })
      }
      res.json({ message: 'Item removed' })
    }
  )
})

// Clear cart
app.delete('/api/cart', requireAuth, (req, res) => {
  const db = getDb()
  const userId = req.session.userId

  db.run('DELETE FROM cart_items WHERE userId = ?', [userId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to clear cart' })
    }
    res.json({ message: 'Cart cleared' })
  })
})

// ===== ORDER ROUTES =====

// Create order
app.post('/api/orders', requireAuth, (req, res) => {
  const db = getDb()
  const userId = req.session.userId
  const { total, shippingAddress } = req.body

  // Get cart items
  db.all(
    'SELECT * FROM cart_items WHERE userId = ?',
    [userId],
    (err, cartItems) => {
      if (err || !cartItems.length) {
        return res.status(400).json({ error: 'Cart is empty' })
      }

      // Create order
      db.run(
        'INSERT INTO orders (userId, total, shippingAddress, status) VALUES (?, ?, ?, ?)',
        [userId, total, JSON.stringify(shippingAddress), 'confirmed'],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create order' })
          }

          const orderId = this.lastID

          // Add order items
          const stmt = db.prepare(
            'INSERT INTO order_items (orderId, productId, size, color, quantity, price) VALUES (?, ?, ?, ?, ?, ?)'
          )

          let completed = 0
          cartItems.forEach((item) => {
            // Get product price
            db.get('SELECT price FROM products WHERE id = ?', [item.productId], (err, product) => {
              if (!err && product) {
                stmt.run([orderId, item.productId, item.size, item.color, item.quantity, product.price])
              }
              completed++
              
              if (completed === cartItems.length) {
                stmt.finalize()
                
                // Clear cart
                db.run('DELETE FROM cart_items WHERE userId = ?', [userId], () => {
                  res.json({ orderId, message: 'Order created' })
                })
              }
            })
          })
        }
      )
    }
  )
})

// Get user orders
app.get('/api/orders', requireAuth, (req, res) => {
  const db = getDb()
  const userId = req.session.userId

  db.all(
    'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC',
    [userId],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch orders' })
      }
      res.json({ orders })
    }
  )
})

// ===== PROFILE ROUTE =====

app.get('/api/profile', requireAuth, (req, res) => {
  const db = getDb()
  const userId = req.session.userId

  db.get('SELECT id, email, firstName, lastName, phone FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.json({ user })
    }
  )
})

// ===== CONTACT ROUTE =====

app.post('/api/contact', (req, res) => {
  const db = getDb()
  const { email, message } = req.body

  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' })
  }

  db.run(
    'INSERT INTO contact_messages (email, message) VALUES (?, ?)',
    [email, message],
    function(err) {
      if (err) {
        console.error('Error saving contact message:', err)
        return res.status(500).json({ error: 'Failed to save message' })
      }
      res.json({ success: true, messageId: this.lastID })
    }
  )
})

// Start server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err)
    process.exit(1)
  })
