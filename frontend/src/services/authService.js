import api from './api'
import { API_ENDPOINTS } from '../config/api'

export const authService = {
  login: async (userName, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      userName,
      password,
    })
    const token = response.data?.result?.token
    if (token) {
      localStorage.setItem('token', token)
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
  },

  getToken: () => {
    return localStorage.getItem('token')
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
}
