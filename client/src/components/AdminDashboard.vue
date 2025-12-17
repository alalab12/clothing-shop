<template>
  <div class="admin-dashboard">
    <div class="container">
      <h1>Admin Dashboard</h1>

      <div v-if="!auth.isAdmin.value" class="access-denied">
        <p>Access Denied - Admin only</p>
        <router-link to="/">Back to Home</router-link>
      </div>

      <div v-else>
        <!-- Products Table -->
        <div class="products-section">
          <div class="section-header">
            <h2>Products Management</h2>
            <button @click="showAddForm = true" class="btn-add">+ Add Product</button>
          </div>

          <div v-if="loading" class="loading">Loading products...</div>

          <table v-else class="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price (¥)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.id }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.category }}</td>
                <td>{{ product.price }}</td>
                <td>
                  <button @click="editProduct(product)" class="btn-edit">Edit</button>
                  <button @click="deleteProduct(product.id)" class="btn-delete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Add/Edit Form Modal -->
        <div v-if="showAddForm || showEditForm" class="modal-overlay" @click="closeForm">
          <div class="modal-content" @click.stop>
            <h3>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h3>
            
            <form @submit.prevent="saveProduct" class="product-form">
              <div class="form-group">
                <label>Product ID</label>
                <input v-model="formData.id" :disabled="editingProduct" required />
              </div>

              <div class="form-group">
                <label>Name</label>
                <input v-model="formData.name" required />
              </div>

              <div class="form-group">
                <label>Category</label>
                <select v-model="formData.category" required>
                  <option value="">Select</option>
                  <option value="t-shirts">T-Shirts</option>
                  <option value="jeans">Jeans</option>
                  <option value="jackets">Jackets</option>
                  <option value="sweaters">Sweaters</option>
                  <option value="accessories">Accessories</option>
                </select>
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

              <div v-if="formError" class="error">{{ formError }}</div>

              <div class="form-actions">
                <button type="button" @click="closeForm" class="btn-cancel">Cancel</button>
                <button type="submit" :disabled="formLoading" class="btn-submit">
                  {{ formLoading ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Simple: AdminDashboard — Vue admin panel to manage products
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { productAPI } from '../services/api'

export default {
  name: 'AdminDashboard',
  setup() {
    const auth = useAuth()
    const products = ref([])
    const loading = ref(true)
    const showAddForm = ref(false)
    const showEditForm = ref(false)
    const editingProduct = ref(null)
    const formLoading = ref(false)
    const formError = ref('')

    const formData = ref({
      id: '',
      name: '',
      category: '',
      price: 0,
      description: '',
      image: ''
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

    const editProduct = (product) => {
      editingProduct.value = product
      formData.value = { ...product }
      showEditForm.value = true
    }

    const closeForm = () => {
      showAddForm.value = false
      showEditForm.value = false
      editingProduct.value = null
      formError.value = ''
      formData.value = {
        id: '',
        name: '',
        category: '',
        price: 0,
        description: '',
        image: ''
      }
    }

    const saveProduct = async () => {
      formError.value = ''
      formLoading.value = true

      try {
        if (editingProduct.value) {
          // Update
          await fetch(`/api/products/${formData.value.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(formData.value)
          })
        } else {
          // Create
          await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(formData.value)
          })
        }
        
        closeForm()
        await loadProducts()
      } catch (error) {
        formError.value = error.message
      } finally {
        formLoading.value = false
      }
    }

    const deleteProduct = async (productId) => {
      if (!confirm(`Delete product ${productId}?`)) return

      try {
        await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        await loadProducts()
      } catch (error) {
        console.error('Failed to delete:', error)
      }
    }

    onMounted(() => {
      loadProducts()
    })

    return {
      auth,
      products,
      loading,
      showAddForm,
      showEditForm,
      editingProduct,
      formLoading,
      formError,
      formData,
      editProduct,
      closeForm,
      saveProduct,
      deleteProduct
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem 0;
  min-height: calc(100vh - 80px);
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
}

.access-denied {
  background: #fee;
  color: #c33;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  font-size: 1.2rem;
}

.access-denied a {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #c33;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.products-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.btn-add {
  padding: 0.75rem 1.5rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-add:hover {
  background: #218838;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th {
  background: #f9f9f9;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #ddd;
  font-weight: 600;
}

.products-table td {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.products-table tbody tr:hover {
  background: #f9f9f9;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 0.75rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-edit {
  background: #007bff;
  color: white;
}

.btn-edit:hover {
  background: #0056b3;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
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
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
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
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:disabled {
  background: #f0f0f0;
  color: #999;
}

.error {
  color: #c33;
  background: #fee;
  padding: 0.75rem;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-cancel, .btn-submit {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #5a6268;
}

.btn-submit {
  background: #007bff;
  color: white;
}

.btn-submit:hover {
  background: #0056b3;
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
