<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ mode === 'edit' ? 'Edit Product' : 'Add New Product' }}</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Product ID</label>
            <input 
              v-model="formData.id" 
              :disabled="mode === 'edit'"
              required
              placeholder="e.g., sweater-01"
            />
          </div>

          <div class="form-group">
            <label>Name</label>
            <input v-model="formData.name" required placeholder="Product name" />
          </div>

          <div class="form-group">
            <label>Category</label>
            <select v-model="formData.category" required>
              <option value="">Select category</option>
              <option value="accessories">Accessories</option>
              <option value="jacket">Jacket</option>
              <option value="jeans">Jeans</option>
              <option value="sweater">Sweater</option>
              <option value="tshirt">T-shirt</option>
              <option value="dress">Dress</option>
            </select>
          </div>

          <div class="form-group">
            <label>Price (¥)</label>
            <input v-model.number="formData.price" type="number" step="0.01" required />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="formData.description" rows="4" required></textarea>
          </div>

          <div class="form-group">
            <label>Image URL</label>
            <input v-model="formData.image" required placeholder="/img/products/category/image.jpg" />
          </div>

          <div class="form-group">
            <label>Stock by Size</label>
            <div class="stock-grid">
              <div v-for="size in sizes" :key="size" class="stock-item">
                <label>{{ size }}</label>
                <input 
                  v-model.number="formData.stock[size]" 
                  type="number" 
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-cancel">Cancel</button>
            <button type="submit" :disabled="loading" class="btn-submit">
              {{ loading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// Simple: AdminProductForm — form used by admin to add or edit products
import { ref, watch } from 'vue'
import { adminAPI } from '../services/api'

export default {
  name: 'AdminProductForm',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    mode: {
      type: String,
      default: 'add', // 'add' or 'edit'
      validator: (value) => ['add', 'edit'].includes(value)
    },
    product: {
      type: Object,
      default: null
    },
    category: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const sizes = ['XS', 'S', 'M', 'L', 'XL']
    const loading = ref(false)
    const error = ref('')

    const formData = ref({
      id: '',
      name: '',
      category: props.category || '',
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

    // Watch for product changes to populate form
    watch(() => props.product, (newProduct) => {
      if (newProduct && props.mode === 'edit') {
        formData.value = {
          id: newProduct.id || '',
          name: newProduct.name || '',
          category: newProduct.category || '',
          price: newProduct.price || 0,
          description: newProduct.description || '',
          image: newProduct.image || '',
          stock: {
            XS: newProduct.sizeStock?.XS || 0,
            S: newProduct.sizeStock?.S || 0,
            M: newProduct.sizeStock?.M || 0,
            L: newProduct.sizeStock?.L || 0,
            XL: newProduct.sizeStock?.XL || 0
          }
        }
      }
    }, { immediate: true })

    // Watch for category changes when adding new product
    watch(() => props.category, (newCategory) => {
      if (props.mode === 'add' && newCategory) {
        formData.value.category = newCategory
      }
    })

    const closeModal = () => {
      error.value = ''
      emit('close')
    }

    const handleSubmit = async () => {
      loading.value = true
      error.value = ''

      try {
        if (props.mode === 'edit') {
          await adminAPI.updateProduct(formData.value.id, formData.value)
        } else {
          await adminAPI.createProduct(formData.value)
        }
        
        emit('success')
        closeModal()
        
        // Reset form for next use
        if (props.mode === 'add') {
          formData.value = {
            id: '',
            name: '',
            category: props.category || '',
            price: 0,
            description: '',
            image: '',
            stock: { XS: 0, S: 0, M: 0, L: 0, XL: 0 }
          }
        }
      } catch (err) {
        error.value = err.message || 'Failed to save product'
      } finally {
        loading.value = false
      }
    }

    return {
      sizes,
      formData,
      loading,
      error,
      closeModal,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
}

.close-btn:hover {
  color: #000;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #333;
}

.form-group textarea {
  resize: vertical;
}

.stock-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}

.stock-item {
  display: flex;
  flex-direction: column;
}

.stock-item label {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  text-align: center;
}

.stock-item input {
  padding: 0.5rem;
  text-align: center;
}

.error-message {
  color: #d32f2f;
  background: #ffebee;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #333;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-submit {
  background: #000;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #333;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
