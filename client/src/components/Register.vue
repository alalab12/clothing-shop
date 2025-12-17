<template>
  <div class="register-page">
    <div class="register-container">
      <h1>Create Account</h1>
      
      <form @submit.prevent="handleRegister">
        <div class="form-row">
          <div class="form-group">
            <label>First Name</label>
            <input 
              type="text" 
              v-model="firstName" 
              required 
              placeholder="First Name"
            />
          </div>

          <div class="form-group">
            <label>Last Name</label>
            <input 
              type="text" 
              v-model="lastName" 
              required 
              placeholder="Last Name"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input 
            type="email" 
            v-model="email" 
            required 
            placeholder="your@email.com"
          />
        </div>

        <div class="form-group">
          <label>Phone (optional)</label>
          <input 
            type="tel" 
            v-model="phone" 
            placeholder="+1 234 567 8900"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="password" 
            required 
            placeholder="••••••••"
          />
          <small class="hint">Minimum 8 characters</small>
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
      </form>

      <p class="switch-link">
        Already have an account? 
        <router-link to="/login">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
// Simple: Register — user registration form component
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const auth = useAuth()
    
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const phone = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)

    const handleRegister = async () => {
      error.value = ''
      
      // Validation du mot de passe
      if (password.value.length < 8) {
        alert('Password must be at least 8 characters long.')
        return
      }
      
      // Validation du numéro de téléphone (si fourni)
      if (phone.value.trim() !== '') {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,5}[-\s.]?[0-9]{1,5}$/
        if (!phoneRegex.test(phone.value.trim())) {
          alert('Please enter a valid phone number (e.g., +1 234 567 8900 or 0123456789).')
          return
        }
      }
      
      loading.value = true

      try {
        console.log('Attempting registration...')
        const result = await auth.register({
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          phone: phone.value,
          password: password.value
        })
        
        if (result.success) {
          console.log('Registration successful, redirecting...')
          await router.push('/')
        } else {
          alert(result.error || 'Registration failed')
        }
      } catch (err) {
        console.error('Registration exception:', err)
        alert('An error occurred during registration')
      } finally {
        loading.value = false
      }
    }

    return {
      firstName,
      lastName,
      email,
      phone,
      password,
      error,
      loading,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  padding: 2rem;
}

.register-container {
  background: #fff;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 500px;
}

h1 {
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #000;
}

.hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: #666;
}

.error {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.submit-btn {
  width: 100%;
  background: #000;
  color: #fff;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #333;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.switch-link a {
  color: #000;
  font-weight: 600;
  text-decoration: none;
}

.switch-link a:hover {
  text-decoration: underline;
}
</style>
