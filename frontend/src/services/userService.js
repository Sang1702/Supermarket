import api from './api'
import { API_ENDPOINTS } from '../config/api'

export const userService = {
  getUsers: async () => {
    const response = await api.get(API_ENDPOINTS.USERS.LIST)
    return response.data
  },

  getUser: async (id) => {
    const response = await api.get(API_ENDPOINTS.USERS.GET(id))
    return response.data
  },

  createUser: async (userData) => {
    const response = await api.post(API_ENDPOINTS.USERS.CREATE, userData)
    return response.data
  },

  updateUser: async (id, userData) => {
    const response = await api.put(API_ENDPOINTS.USERS.UPDATE(id), userData)
    return response.data
  },

  deleteUser: async (id) => {
    const response = await api.delete(API_ENDPOINTS.USERS.DELETE(id))
    return response.data
  },

  searchUsers: async (name) => {
    const response = await api.get(API_ENDPOINTS.USERS.SEARCH, {
      params: { name },
    })
    return response.data
  },
}
