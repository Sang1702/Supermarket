import api from './api'
import { API_ENDPOINTS } from '../config/api'

export const staffService = {
  getStaffs: async () => {
    const response = await api.get(API_ENDPOINTS.STAFF.LIST)
    return response.data
  },

  getStaff: async (id) => {
    const response = await api.get(API_ENDPOINTS.STAFF.GET(id))
    return response.data
  },

  searchStaffs: async (position) => {
    const response = await api.get(API_ENDPOINTS.STAFF.SEARCH, {
      params: { position },
    })
    return response.data
  },
}
