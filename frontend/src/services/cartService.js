import api from './api'
import { API_ENDPOINTS } from '../config/api'

export const cartService = {
  addToCart: async (customerId, productId, quantity) => {
    const response = await api.post(API_ENDPOINTS.CART.ADD, {
      customerId,
      productId,
      quantity,
    })
    return response.data
  },

  getCart: async (customerId) => {
    const response = await api.get(API_ENDPOINTS.CART.GET(customerId))
    return response.data
  },

  updateCartItem: async (customerId, productId, quantity) => {
    const response = await api.put(API_ENDPOINTS.CART.UPDATE_ITEM, {
      customerId,
      productId,
      quantity,
    })
    return response.data
  },

  removeCartItem: async (customerId, productId) => {
    const response = await api.delete(API_ENDPOINTS.CART.REMOVE_ITEM, {
      data: { customerId, productId },
    })
    return response.data
  },

  clearCart: async (customerId) => {
    const response = await api.delete(API_ENDPOINTS.CART.CLEAR(customerId))
    return response.data
  },
}
