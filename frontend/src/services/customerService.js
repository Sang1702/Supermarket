import api from './api'
import { API_ENDPOINTS } from '../config/api'

export const customerService = {
  getCustomers: async () => {
    const response = await api.get(API_ENDPOINTS.CUSTOMERS.LIST)
    return response.data
  },

  getCustomer: async (id) => {
    const response = await api.get(API_ENDPOINTS.CUSTOMERS.GET(id))
    return response.data
  },
}
