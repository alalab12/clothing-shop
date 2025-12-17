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
      >
        <figure class="product-image" @click="goToProduct(product.id)">
          <img :src="product.image" :alt="product.name" />
          <button 
            v-if="auth.isAdmin.value" 
            class="delete-btn" 
            @click.stop="deleteProduct(product.id)"
            title="Delete product"
          >
            &times;
          </button>
        </figure>
        <div class="product-info" @click="goToProduct(product.id)">
          <h3>{{ product.name }}</h3>
          <p class="price">¥{{ product.price }}</p>
        </div>
        <button 
          v-if="auth.isAdmin.value" 
          @click.stop="editProduct(product)" 
          class="edit-btn"
        >
          Edit
        </button>
      </article>
    </div>

    <!-- Admin Add Button -->
    <button 
      v-if="auth.isAdmin.value" 
      class="admin-add-btn"
      @click="openAddModal()"
      title="Add new product"
    >
      +
    </button>

    <!-- Admin Add Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal-content" @click.stop>
        <h3>{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h3>
        
        <form @submit.prevent="saveProduct" class="product-form">
          <div v-if="!isEditing" class="form-group">
            <label>Type</label>
            <select v-model="formData.type" required>
              <option value="">-- Select Type --</option>
              <option value="jeans">Jeans</option>
              <option value="t-shirts">T-Shirts</option>
              <option value="sweaters">Sweaters</option>
              <option value="jackets">Jackets</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div class="form-group">
            <label>Name</label>
            <input v-model="formData.name" required />
          </div>

          <div class="form-group">
            <label>Price (¥)</label>
            <input v-model.number="formData.price" type="number" step="0.01" required />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="formData.description" rows="3" required></textarea>
          </div>

          <div class="form-group">
            <label>Image URL</label>
            <input v-model="formData.image" required />
          </div>

          <div class="form-group">
            <label>Stock by Size</label>
            <div class="size-stock-grid">
              <div v-for="size in sizes" :key="size" class="size-input">
                <label>{{ size }}</label>
                <input v-model.number="formData.stock[size]" type="number" min="0" :placeholder="size" required />
              </div>
            </div>
          </div>

          <div v-if="formError" class="error">{{ formError }}</div>

          <div class="form-actions">
            <button type="button" @click="closeAddModal" class="btn-cancel">Cancel</button>
            <button type="submit" :disabled="formLoading" class="btn-submit">
              {{ formLoading ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update' : 'Save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
// Simple: CategoryPage — shows products for a selected category
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { productAPI } from '../services/api'
import { useAuth } from '../composables/useAuth'

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
    const auth = useAuth()
    
    const products = ref([])
    const loading = ref(true)
    const sortOrder = ref('desc')
    const showAddModal = ref(false)
    const isEditing = ref(false)
    const editingId = ref(null)
    const formLoading = ref(false)
    const formError = ref('')
    const sizes = ['XS', 'S', 'M', 'L', 'XL']
    const formData = ref({
      type: '',
      name: '',
      price: 0,
      description: '',
      image: '',
      stock: {
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0
      }
    })

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

    const closeAddModal = () => {
      showAddModal.value = false
      formError.value = ''
      isEditing.value = false
      editingId.value = null
      formData.value = {
        type: '',
        name: '',
        price: 0,
        description: '',
        image: '',
        stock: {
          XS: 0,
          S: 0,
          M: 0,
          L: 0,
          XL: 0
        }
      }
    }

    const openAddModal = () => {
      isEditing.value = false
      editingId.value = null
      showAddModal.value = true
    }

    const saveProduct = async () => {
      formError.value = ''
      formLoading.value = true

      try {
        // Validation
        if (!isEditing.value && !formData.value.type) {
          throw new Error('Please select a product type')
        }
        if (!formData.value.name || formData.value.name.trim() === '') {
          throw new Error('Product name is required')
        }
        if (formData.value.price === null || formData.value.price === '' || formData.value.price <= 0) {
          throw new Error('Price must be greater than 0')
        }
        if (!formData.value.description || formData.value.description.trim() === '') {
          throw new Error('Description is required')
        }
        if (!formData.value.image || formData.value.image.trim() === '') {
          throw new Error('Image URL is required')
        }

        // Validate at least one size has stock
        const hasStock = Object.values(formData.value.stock).some(qty => qty > 0)
        if (!hasStock) {
          throw new Error('At least one size must have stock')
        }

        let response
        if (isEditing.value && editingId.value) {
          // Update existing product
          response = await fetch(`/api/admin/products/${editingId.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              name: formData.value.name,
              description: formData.value.description,
              price: formData.value.price,
              category: props.category,
              image: formData.value.image,
              stock: { ...formData.value.stock }
            })
          })
        } else {
          // Create new product with auto-generated ID based on type and timestamp
          const productId = `${formData.value.type}-${Date.now()}`
          response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              id: productId,
              name: formData.value.name,
              price: formData.value.price,
              description: formData.value.description,
              image: formData.value.image,
              category: formData.value.type,
              stock: { ...formData.value.stock }
            })
          })
        }

        if (!response.ok) {
          const err = await response.json().catch(() => ({}))
          throw new Error(err.error || (isEditing.value ? 'Failed to update product' : 'Failed to create product'))
        }

        closeAddModal()
        await loadProducts()
      } catch (error) {
        formError.value = error.message
      } finally {
        formLoading.value = false
      }
    }

    // Prevent background scroll when modal is open
    watch(showAddModal, (isOpen) => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    })

    onBeforeUnmount(() => {
      document.body.style.overflow = ''
    })

    const deleteProduct = async (productId) => {
      if (!confirm(`Delete product ${productId}?`)) return

      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        
        if (response.ok) {
          await loadProducts()
        } else {
          const error = await response.json()
          console.error('Delete error:', error)
          alert(`Failed to delete product: ${error.error || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Failed to delete:', error)
        alert('Error deleting product: ' + error.message)
      }
    }

    const editProduct = async (product) => {
      isEditing.value = true
      editingId.value = product.id
      formError.value = ''
      showAddModal.value = true
      formLoading.value = true

      try {
        // Load full product with stock from API
        const res = await fetch(`/api/products/${product.id}`)
        if (!res.ok) throw new Error('Failed to load product')
        const data = await res.json()
        const p = data.product

        // Build stock map with defaults
        const stock = { XS: 0, S: 0, M: 0, L: 0, XL: 0 }
        if (p.sizeStock) {
          for (const [k, v] of Object.entries(p.sizeStock)) {
            if (stock[k] !== undefined) stock[k] = v
          }
        }

        formData.value = {
          id: String(p.id),
          name: p.name || '',
          price: Number(p.price) || 0,
          description: p.description || '',
          image: p.image || '',
          stock
        }
      } catch (e) {
        formError.value = e.message
      } finally {
        formLoading.value = false
      }
    }

    onMounted(() => {
      loadProducts()
    })

    return {
      auth,
      products,
      loading,
      categoryTitle,
      filteredProducts,
      sortedProducts,
      sortOrder,
      showAddModal,
      isEditing,
      editingId,
      formLoading,
      formError,
      formData,
      sizes,
      goToProduct,
      closeAddModal,
      openAddModal,
      saveProduct,
      deleteProduct,
      editProduct
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
  aspect-ratio: 3/3.5;
  overflow: hidden;
  margin: 0;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  border: 1px solid #e0e0e0;
  border-bottom: none;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
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

.edit-btn {
  width: 100%;
  padding: 0.5rem;
  background: #000000;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: #333333;
}

.product-image {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 10;
}

.delete-btn:hover {
  background: #333333;
}

.admin-add-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 32px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: all 0.2s;
  z-index: 100;
}

.admin-add-btn:hover {
  background: #333333;
  transform: scale(1.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  padding: 2rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  max-width: 880px;
  width: min(880px, calc(100vw - 40px));
  max-height: 98vh;
  overflow-y: auto;
  overflow-x: hidden;
  /* Hide scrollbars on all browsers while preserving scroll */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;    /* Firefox */
}

/* WebKit (Chrome/Safari/Edge Chromium) */
.modal-content::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.modal-content h3 {
  margin: 0 0 1.25rem 0;
  font-size: 1.1rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.82rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  font-size: 0.95rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #111;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.05);
}

.size-stock-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.75rem;
}

.size-input {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.size-input label {
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.size-input input {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  font-size: 0.9rem;
  text-align: center;
}

.error {
  color: var(--color-error);
  background: #fff1f1;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(185,28,28,0.2);
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-cancel, .btn-submit {
  padding: 0.7rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.06em;
}

.btn-cancel {
  background: transparent;
  color: var(--color-text-primary);
}

.btn-cancel:hover {
  background: #f1f1f1;
}

.btn-submit {
  background: #000000;
  color: white;
  border-color: #000000;
}

.btn-submit:hover {
  background: #333333;
  border-color: #333333;
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }
}
</style>
