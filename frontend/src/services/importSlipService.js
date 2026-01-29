import api from './api'
import { API_ENDPOINTS } from '../config/api'

export const importSlipService = {
  getImportSlips: async () => {
    const response = await api.get(API_ENDPOINTS.IMPORT_SLIPS.LIST)
    return response.data
  },

  getImportSlip: async (id) => {
    const response = await api.get(API_ENDPOINTS.IMPORT_SLIPS.GET(id))
    return response.data
  },

  getImportSlipsBySupplier: async (supplierId) => {
    const response = await api.get(`${API_ENDPOINTS.IMPORT_SLIPS.LIST}/supplier/${supplierId}`)
    return response.data
  },

  createImportSlip: async (importSlipData) => {
    const response = await api.post(API_ENDPOINTS.IMPORT_SLIPS.CREATE, importSlipData)
    return response.data
  },
}
