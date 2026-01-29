import api from './api'
import { API_ENDPOINTS } from '../config/api'

export const supplierService = {
  getSuppliers: async () => {
    const response = await api.get(API_ENDPOINTS.SUPPLIERS.LIST)
    return response.data
  },

  getSupplier: async (id) => {
    const response = await api.get(API_ENDPOINTS.SUPPLIERS.GET(id))
    return response.data
  },

  createSupplier: async (supplierData) => {
    const response = await api.post(API_ENDPOINTS.SUPPLIERS.CREATE, supplierData)
    return response.data
  },

  updateSupplier: async (id, supplierData) => {
    const response = await api.put(API_ENDPOINTS.SUPPLIERS.UPDATE(id), supplierData)
    return response.data
  },

  deleteSupplier: async (id) => {
    const response = await api.delete(API_ENDPOINTS.SUPPLIERS.DELETE(id))
    return response.data
  },

  searchSuppliers: async (name) => {
    const response = await api.get(API_ENDPOINTS.SUPPLIERS.SEARCH, {
      params: { name },
    })
    return response.data
  },
}
