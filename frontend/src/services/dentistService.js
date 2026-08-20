import api from './api';

export const dentistService = {
  getAll: async (params) => {
    const response = await api.get('/dentists', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/dentists/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/dentists', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/dentists/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/dentists/${id}`);
    return response.data;
  },
  getStats: async (id) => {
    const response = await api.get(`/dentists/${id}/stats`);
    return response.data;
  },
  getSchedule: async (id, startDate, endDate) => {
    const response = await api.get(`/dentists/${id}/schedule`, {
      params: { startDate, endDate }
    });
    return response.data;
  },
};