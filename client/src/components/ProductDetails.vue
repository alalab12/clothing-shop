<template>
  <div class="product-details">
    <div class="container">
      <div v-if="loading" class="loading">Loading...</div>

      <div v-else-if="product" class="product-content">
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
        </div>

        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <p class="price">¥{{ product.price }}</p>
          <p class="description">{{ product.description }}</p>

          <div class="options">
            <div class="option-group">
              <label>Size</label>
              <div class="size-options">
                <div
                  v-for="size in product.sizes"
                  :key="size"
                  class="size-wrapper"
                >
                  <button
                    @click="selectSize(size)"
                    :class="{ active: selectedSize === size, 'out-of-stock': isSizeOutOfStock(size) }"
                    :disabled="isSizeOutOfStock(size)"
                  >
                    {{ size }}
                  </button>
                  <span v-if="isSizeOutOfStock(size)" class="stock-label">Out of Stock</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="message" :class="['message', messageType]">
            {{ message }}
          </div>

          <button 
            @click="addToCart" 
            class="add-to-cart-btn"
            :disabled="!selectedSize || addingToCart || isSizeOutOfStock(selectedSize) || allSizesOutOfStock"
          >
            <span v-if="allSizesOutOfStock">Out of Stock</span>
            <span v-else-if="selectedSize && isSizeOutOfStock(selectedSize)">Out of Stock</span>
            <span v-else>{{ addingToCart ? 'Adding...' : 'Add to Cart' }}</span>
          </button>
        </div>
      </div>

      <div v-else class="error">Product not found</div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productAPI } from '../services/api'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'ProductDetails',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const cart = useCart()
    const auth = useAuth()

    const product = ref(null)
    const loading = ref(true)
    const selectedSize = ref('')
    const message = ref('')
    const messageType = ref('success')
    const addingToCart = ref(false)
    const sizeStock = ref({})

    const loadProduct = async () => {
      loading.value = true
      try {
        const data = await productAPI.getById(route.params.id)
        product.value = data.product
        sizeStock.value = data.product.sizeStock || {}
        
        // Auto-select first available size
        const availableSizes = product.value.sizes.filter(size => (sizeStock.value[size] || 0) > 0)
        if (availableSizes.length > 0) {
          selectedSize.value = availableSizes[0]
        }
      } catch (error) {
        console.error('Failed to load product:', error)
      } finally {
        loading.value = false
      }
    }

    const isSizeOutOfStock = (size) => {
      return (sizeStock.value[size] || 0) === 0
    }

    const allSizesOutOfStock = computed(() => {
      if (!product.value || !product.value.sizes) return false
      return product.value.sizes.every(size => isSizeOutOfStock(size))
    })

    const selectSize = (size) => {
      if (!isSizeOutOfStock(size)) {
        selectedSize.value = size
        message.value = ''
      }
    }

    const addToCart = async () => {
      if (isSizeOutOfStock(selectedSize.value)) {
        message.value = 'This size is out of stock'
        messageType.value = 'error'
        return
      }

      if (!auth.isAuthenticated.value) {
        message.value = 'Please login to add items to cart'
        messageType.value = 'error'
        setTimeout(() => {
          router.push('/login')
        }, 1500)
        return
      }

      if (!selectedSize.value) {
        message.value = 'Please select a size'
        messageType.value = 'error'
        return
      }

      addingToCart.value = true
      message.value = ''

      const result = await cart.addItem(
        product.value.id,
        selectedSize.value,
        1
      )

      addingToCart.value = false

      if (result.success) {
        message.value = 'Added to cart!'
        messageType.value = 'success'
        setTimeout(() => {
          message.value = ''
        }, 3000)
      } else {
        message.value = result.error || 'Failed to add to cart'
        messageType.value = 'error'
      }
    }

    onMounted(() => {
      loadProduct()
    })

    return {
      product,
      loading,
      selectedSize,
      message,
      messageType,
      addingToCart,
      sizeStock,
      isSizeOutOfStock,
      allSizesOutOfStock,
      selectSize,
      addToCart
    }
  }
}
</script>

<style scoped>
.product-details {
  padding: 4rem 0;
}

.loading, .error {
  text-align: center;
  padding: 4rem 0;
  font-size: 1.1rem;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.product-image {
  aspect-ratio: 3/4;
  overflow: hidden;
  border-radius: 8px;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.price {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.options {
  margin-bottom: 2rem;
}

.option-group {
  margin-bottom: 1.5rem;
}

.option-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.size-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.size-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.size-options button {
  background: #fff;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  color: #111;
  font-weight: 500;
}

.size-options button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

.size-options button:hover:not(:disabled) {
  border-color: #000;
}

.size-options button.active {
  background: #000;
  color: #fff;
  border-color: #000;
}

.size-options button.out-of-stock {
  border-color: #e5e5e5;
  color: #999;
}

.stock-label {
  font-size: 0.7rem;
  font-weight: 400;
  color: #999;
  text-align: center;
}

.message {
  padding: 0.9rem 1.2rem;
  border-radius: 3px;
  margin-bottom: 1.3rem;
  font-size: 0.92rem;
  font-weight: var(--font-weight-medium);
  border: 1px solid;
  letter-spacing: 0.01em;
}

.message.success {
  background: #f0f9f4;
  color: #1e6b3e;
  border-color: #c3e6cd;
}

.message.error {
  background: #fef2f2;
  color: #991b1b;
  border-color: #fecaca;
}

.add-to-cart-btn {
  width: 100%;
  background: #000;
  color: #fff;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #333;
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
