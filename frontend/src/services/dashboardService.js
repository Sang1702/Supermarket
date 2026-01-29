import api from './api'
import { API_ENDPOINTS } from '../config/api'

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get(API_ENDPOINTS.DASHBOARD.SUMMARY)
    return response.data
  },
}
