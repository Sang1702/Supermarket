import api from './api'
import { API_ENDPOINTS } from '../config/api'

export const productService = {
  getProducts: async () => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.LIST)
    return response.data
  },

  getProduct: async (id) => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.GET(id))
    return response.data
  },

  createProduct: async (productData) => {
    const response = await api.post(API_ENDPOINTS.PRODUCTS.CREATE, productData)
    return response.data
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(API_ENDPOINTS.PRODUCTS.UPDATE(id), productData)
    return response.data
  },

  deleteProduct: async (id) => {
    const response = await api.delete(API_ENDPOINTS.PRODUCTS.DELETE(id))
    return response.data
  },

  searchProducts: async (name) => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.LIST + '/search', {
      params: { name },
    })
    return response.data
  },
}
