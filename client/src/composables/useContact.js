// Manages contact form state and operations
// Handles contact message submission to server

import { ref } from 'vue' // Vue reactivity
import { contactAPI } from '../services/api' // API calls

// Contact form state
const loading = ref(false) // Request status
const errors = ref([]) // Validation errors
const successMessage = ref('') // Success message

export function useContact() {
  // Send contact message to server
  const sendMessage = async (email, message) => {
    loading.value = true
    errors.value = []
    successMessage.value = ''
    
    try {
      const data = await contactAPI.send({ email, message })
      successMessage.value = 'Message sent successfully! We will contact you soon.'
      return { success: true }
    } catch (error) {
      errors.value = [error.message]
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }


  return {
    // State
    loading,
    errors,
    successMessage,
    
    // Methods
    sendMessage
  }
}
