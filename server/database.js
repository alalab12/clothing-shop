const sqlite3 = require('sqlite3').verbose()
const path = require('path')

let db = null

function initDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(
      path.join(__dirname, 'shop.db'),
      (err) => {
        if (err) {
          console.error('Database connection error:', err)
          reject(err)
        } else {
          console.log('Connected to SQLite database')
          createTables()
            .then(() => resolve())
            .catch(reject)
        }
      }
    )
  })
}

function createTables() {
  return new Promise((resolve, reject) => {
    const schema = `
      -- Users
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        phone TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Products with TEXT ID
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Stock
      CREATE TABLE IF NOT EXISTS stock (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId TEXT NOT NULL,
        size TEXT NOT NULL,
        color TEXT,
        quantity INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE(productId, size, color)
      );

      -- Cart items
      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        productId TEXT NOT NULL,
        size TEXT NOT NULL,
        color TEXT,
        quantity INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
      );

      -- Orders
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        shippingAddress TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      -- Order items
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER NOT NULL,
        productId TEXT NOT NULL,
        size TEXT NOT NULL,
        color TEXT,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id)
      );

      -- Contact messages
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `

    db.exec(schema, (err) => {
      if (err) {
        console.error('Error creating tables:', err)
        reject(err)
      } else {
        console.log('Database tables created successfully')
        resolve()
      }
    })
  })
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}

module.exports = { initDatabase, getDb }
