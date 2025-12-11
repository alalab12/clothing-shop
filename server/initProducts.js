const { initDatabase, getDb } = require('./database')

async function initProducts() {
  await initDatabase()
  const db = getDb()

  const products = [
    // Dresses
    { id: 'dress-1', name: 'Ivy Silk Slip', category: 'dresses', price: 198, description: 'Bias-cut silk charmeuse with adjustable straps', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80' },
    { id: 'dress-2', name: 'Marin Wrap Midi', category: 'dresses', price: 228, description: 'Soft pleats, waist tie, flutter sleeve', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80' },
    { id: 'dress-3', name: 'Esme Column Dress', category: 'dresses', price: 248, description: 'Architectural neckline with back vent', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80' },
    
    // Jeans
    { id: 'denim-1', name: 'Harper Tailored Straight', category: 'jeans', price: 148, description: 'High-rise straight leg with hidden contour waistband', image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=800&q=80' },
    { id: 'denim-2', name: 'Arden Slim Kick Crop', category: 'jeans', price: 158, description: 'Subtle crop with forward seams', image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80' },
    { id: 'denim-3', name: 'Luca Relaxed Wide', category: 'jeans', price: 168, description: 'Vintage-inspired wide leg with breezy drape', image: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=800&q=80' },
    
    // T-Shirts
    { id: 'knit-1', name: 'Sol Ribbed Mock Neck', category: 't-shirts', price: 88, description: 'Second-skin rib knit with sculpted neckline', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80' },
    { id: 'knit-2', name: 'Lina Relaxed Tee', category: 't-shirts', price: 68, description: 'Boxy fit with cuffed sleeve and curved hem', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80' },
    { id: 'knit-3', name: 'Noor Polo Knit', category: 't-shirts', price: 98, description: 'Polished collar, tonal buttons', image: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?auto=format&fit=crop&w=800&q=80' },
    
    // Jackets
    { id: 'outer-1', name: 'Aria Cropped Blazer', category: 'jackets', price: 228, description: 'Sharp shoulders and sculpted waist seam', image: 'https://images.unsplash.com/photo-1496749845876-13bb02d4aa4e?auto=format&fit=crop&w=800&q=80' },
    { id: 'outer-2', name: 'Rey Belted Trench', category: 'jackets', price: 258, description: 'Water-resistant twill with storm flap', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' },
    { id: 'outer-3', name: 'Nora Utility Jacket', category: 'jackets', price: 198, description: 'Relaxed fit with adjustable waist toggles', image: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?auto=format&fit=crop&w=800&q=80' },
    
    // Skirts
    { id: 'skirt-1', name: 'Calla Pleated Midi', category: 'skirts', price: 188, description: 'Micro-pleated midi with soft elastic waistband', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80' },
    { id: 'skirt-2', name: 'Rey Wrap Mini', category: 'skirts', price: 168, description: 'Asymmetrical wrap mini with hidden snap', image: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=800&q=80' },
    { id: 'skirt-3', name: 'Isla Column Skirt', category: 'skirts', price: 198, description: 'Structured column skirt with front slit', image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80' },
    
    // Suiting
    { id: 'suit-1', name: 'Mara Relaxed Blazer', category: 'suiting', price: 298, description: 'Single-breasted blazer with soft shoulder', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=800&q=80' },
    { id: 'suit-2', name: 'Mara Tailored Trouser', category: 'suiting', price: 228, description: 'Straight-leg trouser with pintuck seams', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80' },
    { id: 'suit-3', name: 'Leona Waistcoat', category: 'suiting', price: 188, description: 'Sleek vest with adjustable back tab', image: 'https://images.unsplash.com/photo-1583846761851-e0366a7a0cac?auto=format&fit=crop&w=800&q=80' },
    
    // Accessories
    { id: 'acc-1', name: 'Mara Convertible Bag', category: 'accessories', price: 248, description: 'Vegetable-tanned leather with modular strap', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80' },
    { id: 'acc-2', name: 'Solstice Drop Earrings', category: 'accessories', price: 128, description: 'Hand-cast brass with luminous finish', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80' },
    { id: 'acc-3', name: 'Atlas Silk Scarf', category: 'accessories', price: 98, description: 'Oversized square in washable silk', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80' }
  ]

  const sizes = ['XS', 'S', 'M', 'L', 'XL']
  const colors = ['Ivory', 'Black', 'Navy']

  return new Promise((resolve, reject) => {
    let completed = 0

    products.forEach((product) => {
      db.run(
        'INSERT OR REPLACE INTO products (id, name, category, price, description, image) VALUES (?, ?, ?, ?, ?, ?)',
        [product.id, product.name, product.category, product.price, product.description, product.image],
        (err) => {
          if (err) {
            console.error('Error inserting product:', product.id, err)
            return reject(err)
          }

          // Add stock for each size/color combination
          let stockCompleted = 0
          const totalStock = sizes.length * colors.length

          sizes.forEach((size) => {
            colors.forEach((color) => {
              db.run(
                'INSERT OR REPLACE INTO stock (productId, size, color, quantity) VALUES (?, ?, ?, ?)',
                [product.id, size, color, Math.floor(Math.random() * 20) + 5],
                (err) => {
                  if (err) {
                    console.error('Error inserting stock:', err)
                  }
                  stockCompleted++
                  
                  if (stockCompleted === totalStock) {
                    completed++
                    console.log(`✓ Initialized ${product.name} (${product.id})`)
                    
                    if (completed === products.length) {
                      console.log('\n✅ All 21 products initialized successfully!')
                      resolve()
                    }
                  }
                }
              )
            })
          })
        }
      )
    })
  })
}

if (require.main === module) {
  initProducts()
    .then(() => {
      console.log('Done!')
      process.exit(0)
    })
    .catch((err) => {
      console.error('Error:', err)
      process.exit(1)
    })
}

module.exports = { initProducts }
