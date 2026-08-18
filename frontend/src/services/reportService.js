import api from './api';

export const reportService = {
  getFinancialSummary: async (startDate, endDate) => {
    const response = await api.get('/reports/financial-summary', {
      params: { startDate, endDate }
    });
    return response.data;
  },
  getRevenueByService: async (startDate, endDate) => {
    const response = await api.get('/reports/revenue-by-service', {
      params: { startDate, endDate }
    });
    return response.data;
  },
  getRevenueByPeriod: async (period = 'monthly') => {
    const response = await api.get('/reports/revenue-by-period', {
      params: { period }
    });
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get('/reports/dashboard-stats');
    return response.data;
  },
};