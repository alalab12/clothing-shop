/**
 * Contact Composable (useContact)
 * 
 * Manages contact form state and operations
 * Handles contact message submission
 * 
 * Pattern: Composition API composable for state management
 * Reference: 04-vue.pdf - Composition API & Custom Composables
 * 
 * Usage:
 *   const { sendMessage, loading } = useContact()
 */

import { ref } from 'vue'
import { contactAPI } from '../services/api'

// Contact form state
const loading = ref(false)
const errors = ref([])
const successMessage = ref('')

export function useContact() {
  /**
   * Send contact message
   * @param {string} email - Contact email
   * @param {string} message - Contact message
   */
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

  /**
   * Clear all messages
   */
  const clearMessages = () => {
    errors.value = []
    successMessage.value = ''
  }

  return {
    // State
    loading,
    errors,
    successMessage,
    
    // Methods
    sendMessage,
    clearMessages
  }
}
