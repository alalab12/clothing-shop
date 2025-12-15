const { initDatabase, getDb } = require('./database') // Database connection

// Initialize products and stock in database
async function initProducts() {
  try {
    await initDatabase()
    const db = getDb()

    // Clear existing data (delete in correct order due to foreign keys)
    await db.execute('DELETE FROM order_items')
    await db.execute('DELETE FROM orders')
    await db.execute('DELETE FROM cart_items')
    await db.execute('DELETE FROM stock')
    await db.execute('DELETE FROM products')

    const products = [
      // T-Shirts
      { id: 'knit-1', name: 'Grey Cotton T-Shirt', category: 't-shirts', price: 58, description: 'Classic grey 100% cotton t-shirt', image: '/img/products/T-shirt/grey_T-shirt.png' },
      { id: 'knit-2', name: 'White Cotton T-Shirt', category: 't-shirts', price: 40, description: 'Classic white 100% cotton t-shirt', image: '/img/products/T-shirt/white_T-Shirt.png' },
      // Jackets
      { id: 'jacket-1', name: 'Cream Jacket', category: 'jackets', price: 198, description: 'Elegant cream jacket.', image: '/img/products/Jacket/Cream_Jacket.png' },
      { id: 'jacket-2', name: 'Blue Jacket', category: 'jackets', price: 185, description: 'Stylish blue jacket.', image: '/img/products/Jacket/Blue_Jacket.png' },
      //Jeans
      { id: 'jeans-1', name: 'Black Jeans', category: 'jeans', price: 75, description: 'Comfortable black jeans.', image: '/img/products/Jeans/Black_Jeans.png' },
      { id: 'jeans-2', name: 'Blue Jeans', category: 'jeans', price: 80, description: 'Classic blue jeans.', image: '/img/products/Jeans/Blue_Jeans.png' },
      // Accessories
      { id: 'accessory-1', name: 'Cream Gloves', category: 'accessories', price: 35, description: 'Elegant cream gloves.', image: '/img/products/Accessories/Cream_Gloves.png' },
      { id: 'accessory-2', name: 'Cream Scarf', category: 'accessories', price: 45, description: 'Soft cream scarf.', image: '/img/products/Accessories/Cream_Scarf.png' },
      // Sweaters
      { id: 'sweater-1', name: 'Blue Cardigan', category: 'sweaters', price: 95, description: 'Comfortable blue cardigan.', image: '/img/products/Sweaters/Blue_Cardigan.png' },
      { id: 'sweater-2', name: 'Grey Sweater', category: 'sweaters', price: 85, description: 'Cozy grey sweater.', image: '/img/products/Sweaters/Grey_Sweater.png' },
    ]

    const sizes = ['XS', 'S', 'M', 'L', 'XL']

    // Insert products and stock into database
    for (const product of products) {
      // Insert product
      await db.execute(
        'REPLACE INTO products (id, name, category, price, description, image) VALUES (?, ?, ?, ?, ?, ?)',
        [product.id, product.name, product.category, product.price, product.description, product.image]
      )

      // Add stock for each size
      for (const size of sizes) {
        // Grey T-shirt (knit-1): 50 in all sizes
        // White T-shirt (knit-2): 50 in all sizes EXCEPT S (0 in S)
        // Cream Jacket (jacket-1): 0 in all sizes (out of stock)
        // Blue Jacket (jacket-2): 30 in all sizes
        // Black Jeans (jeans-1): 50 in all sizes
        // Blue Jeans (jeans-2): 50 in all sizes
        // Cream Gloves (accessory-1): 60 in all sizes
        // Cream Scarf (accessory-2): 60 in all sizes
        // Blue Cardigan (sweater-1): 40 in all sizes
        // Grey Sweater (sweater-2): 40 in all sizes
        let quantity = 50
        if (product.id === 'knit-2' && size === 'S') {
          quantity = 0
        }
        if (product.id === 'jacket-1') {
          quantity = 0
        }
        if (product.id === 'jacket-2') {
          quantity = 30
        }
        if (product.id === 'accessory-1' || product.id === 'accessory-2') {
          quantity = 60
        }
        if (product.id === 'sweater-1' || product.id === 'sweater-2') {
          quantity = 40
        }

        await db.execute(
          'REPLACE INTO stock (productId, size, quantity) VALUES (?, ?, ?)',
          [product.id, size, quantity]
        )
      }

      console.log(`Loaded ${product.name}`)
    }

    console.log('Products initialized')
    return true
  } catch (err) {
    console.error('Product initialization failed:', err)
    throw err
  }
}

// Run initialization if executed directly
if (require.main === module) {
  initProducts()
    .then(() => {
      console.log('Done')
      process.exit(0)
    })
    .catch((err) => {
      console.error('Error:', err)
      process.exit(1)
    })
}

// Export initialization function
module.exports = { initProducts }
