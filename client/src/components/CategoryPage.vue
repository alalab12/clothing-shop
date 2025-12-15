<template>
  <main class="page-container">
    <h1 class="page-title">{{ categoryTitle }}</h1>

    <div class="controls">
      <label for="sort-select">Sort by price</label>
      <select id="sort-select" v-model="sortOrder">
        <option value="desc">High to Low</option>
        <option value="asc">Low to High</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading products...</div>

    <div v-else-if="sortedProducts.length === 0" class="no-products">
      <p>No products found in this category.</p>
    </div>

    <div v-else class="products-grid">
      <article
        v-for="product in sortedProducts"
        :key="product.id"
        class="product-card"
        @click="goToProduct(product.id)"
      >
        <figure class="product-image">
          <img :src="product.image" :alt="product.name" />
        </figure>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="price">¥{{ product.price }}</p>
        </div>
      </article>
    </div>
  </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productAPI } from '../services/api'

export default {
  name: 'CategoryPage',
  props: {
    category: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    
    const products = ref([])
    const loading = ref(true)
    const sortOrder = ref('desc')

    const categoryTitle = computed(() => props.title)

    const filteredProducts = computed(() => {
      return products.value.filter(p => p.category === props.category)
    })

    const sortedProducts = computed(() => {
      const list = [...filteredProducts.value]
      return list.sort((a, b) => {
        if (sortOrder.value === 'asc') return a.price - b.price
        return b.price - a.price
      })
    })

    const loadProducts = async () => {
      loading.value = true
      try {
        const data = await productAPI.getAll()
        products.value = data.products || []
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        loading.value = false
      }
    }

    const goToProduct = (id) => {
      router.push(`/product/${id}`)
    }

    onMounted(() => {
      loadProducts()
    })

    return {
      products,
      loading,
      categoryTitle,
      filteredProducts,
      sortedProducts,
      sortOrder,
      goToProduct
    }
  }
}
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 160px);
  display: block;
}

.page-title {
  text-align: left;
  margin-bottom: 3rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 400;
  font-size: 1.2rem;
  color: var(--color-text-primary);
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.controls label {
  font-size: 0.95rem;
  color: var(--color-text-primary);
}

.controls select {
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
}

.loading,
.no-products {
  text-align: center;
  padding: 4rem 0;
  color: var(--color-text-secondary);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
}

.product-card {
  cursor: pointer;
  transition: transform 0.2s;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.product-image {
  aspect-ratio: 3/4;
  overflow: hidden;
  margin: 0;
  background: #f5f5f5;
}

.product-image img {
  width: 105%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  margin-left: -2.5%;
}

.product-info {
  padding: 1rem;
}

.product-info h3 {
  font-size: 1rem;
  margin: 0 0 0.5rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-primary);
}

.price {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }
}
</style>
