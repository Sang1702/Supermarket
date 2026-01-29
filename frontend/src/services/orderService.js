import api from './api'
import { API_ENDPOINTS } from '../config/api'

export const orderService = {
  getOrders: async () => {
    const response = await api.get(API_ENDPOINTS.ORDERS.LIST)
    return response.data
  },

  getOrder: async (id) => {
    const response = await api.get(API_ENDPOINTS.ORDERS.GET(id))
    return response.data
  },

  getOrdersByStatus: async (status) => {
    const response = await api.get(`${API_ENDPOINTS.ORDERS.LIST}/status/${status}`)
    return response.data
  },

  getOrdersByCustomer: async (customerId) => {
    const response = await api.get(`${API_ENDPOINTS.ORDERS.LIST}/customer/${customerId}`)
    return response.data
  },

  createOrder: async (orderData) => {
    const response = await api.post(API_ENDPOINTS.ORDERS.CREATE, orderData)
    return response.data
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`${API_ENDPOINTS.ORDERS.GET(id)}/status`, status)
    return response.data
  },
}
