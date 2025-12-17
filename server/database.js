// Simple: database.js — manages MySQL connection pool and schema setup.
// It creates the database and tables if they do not exist and exports helpers.
// Keep DB credentials in this file for local development only.

const mysql = require('mysql2/promise')

let pool = null

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'clothing_shop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

// Initialize database and create tables
async function initDatabase() {
  try {
    const tempPool = mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    })
    
    // Create fresh database (without dropping)
    await tempPool.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`)
    await tempPool.end()
    
    pool = mysql.createPool(dbConfig)
    
    const connection = await pool.getConnection()
    console.log('MySQL connected')
    connection.release()
    
    await createTables()
  } catch (err) {
    console.error('MySQL connection failed:', err)
    throw err
  }
}

// Create tables
async function createTables() {
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      firstName VARCHAR(100) NOT NULL,
      lastName VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      role VARCHAR(20) DEFAULT 'user',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Products table with VARCHAR ID
    `CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(50) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      description TEXT,
      image VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Stock table
    `CREATE TABLE IF NOT EXISTS stock (
      id INT AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(50) NOT NULL,
      size VARCHAR(10) NOT NULL,
      quantity INT NOT NULL DEFAULT 0,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE KEY unique_stock (productId, size)
    )`,
    
    // Cart items table
    `CREATE TABLE IF NOT EXISTS cart_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      productId VARCHAR(50) NOT NULL,
      size VARCHAR(10) NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
    )`,
    
    // Orders table
    `CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      shippingAddress TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`,
    
    // Order items table
    `CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      orderId INT NOT NULL,
      productId VARCHAR(50) NOT NULL,
      size VARCHAR(10) NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES products(id)
    )`,
    
    // Contact messages table
    `CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ]
  
  try {
    // Execute each table creation query
    for (const tableQuery of tables) {
      await pool.query(tableQuery)
    }
    console.log('Tables ready')
  } catch (err) {
    // Handle table creation error
    console.error('Table creation failed:', err)
    throw err
  }
}

// Get connection pool instance
function getDb() {
  if (!pool) {
    throw new Error('Database not initialized')
  }
  
  return {
    execute: (sql, params = []) => {
      return pool.execute(sql, params)
    }
  }
}

module.exports = { initDatabase, getDb }
