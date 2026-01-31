import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Request interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    console.log('=== API REQUEST ===')
    console.log('URL:', config.baseURL + config.url)
    console.log('Method:', config.method?.toUpperCase())
    console.log('Headers:', config.headers)
    console.log('Data:', config.data)
    
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Token added to headers')
    } else {
      console.log('No token found, request without auth')
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => {
    console.log('=== API RESPONSE SUCCESS ===')
    console.log('Status:', response.status)
    console.log('Data:', response.data)
    return response
  },
  (error) => {
    console.error('=== API RESPONSE ERROR ===')
    console.error('Error:', error)
    
    if (error.response) {
      // Server responded with error status
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
      console.error('Response headers:', error.response.headers)
      
      if (error.response.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        console.log('401 Unauthorized - Removing token and redirecting')
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received')
      console.error('Request config:', error.config)
      console.error('Request URL:', error.config?.baseURL + error.config?.url)
    } else {
      // Error setting up request
      console.error('Error setting up request:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default api
