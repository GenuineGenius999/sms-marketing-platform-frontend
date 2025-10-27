// Debug API calls
import { api } from './api'

export const debugLogin = async (email: string, password: string) => {
  console.log('🔍 Debug Login - Sending request with:', { email, password })
  
  try {
    const response = await api.post('/auth/login', { email, password })
    console.log('✅ Debug Login - Success:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Debug Login - Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    })
    throw error
  }
}
