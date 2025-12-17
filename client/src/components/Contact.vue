<template>
  <div class="contact-page">
    <div class="container">
      <h1>Contact Us</h1>
      <p class="subtitle">Have questions? We'd love to hear from you.</p>

      <div class="contact-form-wrapper">
        <form @submit.prevent="handleSubmit" class="contact-form">
          <!-- Email Field -->
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <!-- Message Field -->
          <div class="form-group">
            <label for="message">Message</label>
            <textarea
              id="message"
              v-model="message"
              placeholder="Tell us how we can help..."
              rows="6"
              required
            ></textarea>
          </div>

          <!-- Success Message -->
          <div v-if="contact.successMessage.value" class="message success-message">
            ✓ {{ contact.successMessage.value }}
          </div>

          <!-- Error Messages -->
          <div v-if="contact.errors.value.length > 0" class="message error-message">
            <span v-for="(error, index) in contact.errors.value" :key="index">
              ✗ {{ error }}
            </span>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn-submit"
            :disabled="contact.loading.value"
          >
            {{ contact.loading.value ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// Simple: Contact — contact form component to send messages to backend
import { ref } from 'vue'
import { useContact } from '../composables/useContact'

export default {
  name: 'Contact',
  setup() {
    const contact = useContact()
    const email = ref('')
    const message = ref('')

    const handleSubmit = async () => {
      // Send message
      const result = await contact.sendMessage(email.value, message.value)

      if (result.success) {
        // Clear form
        email.value = ''
        message.value = ''
      } else {
        alert('Failed to send message: ' + result.error)
      }
    }

    return {
      contact,
      email,
      message,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.contact-page {
  padding: 3.5rem 0 4.5rem;
  min-height: calc(100vh - 80px);
  background: var(--color-bg-page);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

h1 {
  font-size: 1.95rem;
  margin-bottom: 0.5rem;
  font-weight: var(--font-weight-medium);
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.subtitle {
  font-size: 1.05rem;
  color: var(--color-text-secondary);
  margin-bottom: 2.5rem;
  line-height: 1.5;
}

.contact-form-wrapper {
  background: var(--color-bg-card);
  padding: 2.5rem;
  border-radius: 3px;
  border: 1px solid #e8e7e3;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

label {
  font-size: 0.95rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

input,
textarea {
  padding: 0.9rem 1rem;
  border: 1px solid #d4d2ce;
  border-radius: 3px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.95rem;
  color: var(--color-text-primary);
  background: #fafaf9;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #000;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

textarea {
  resize: vertical;
  min-height: 150px;
}

.message {
  padding: 1rem;
  border-radius: 3px;
  font-size: 0.95rem;
  line-height: 1.5;
}

.success-message {
  background: #e8f5e9;
  border: 1px solid #81c784;
  color: #2e7d32;
}

.error-message {
  background: #ffebee;
  border: 1px solid #ef5350;
  color: #c62828;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.btn-submit {
  padding: 1rem 2rem;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 0.95rem;
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.btn-submit:hover:not(:disabled) {
  background: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .contact-page {
    padding: 2rem 0 3rem;
  }

  .container {
    padding: 0 1.5rem;
  }

  h1 {
    font-size: 1.65rem;
  }

  .contact-form-wrapper {
    padding: 1.8rem;
  }

  .contact-form {
    gap: 1.4rem;
  }

  input,
  textarea {
    padding: 0.8rem 0.9rem;
    font-size: 0.9rem;
  }

  .btn-submit {
    width: 100%;
  }
}
</style>
