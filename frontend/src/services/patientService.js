import api from './api';

export const patientService = {
  getAll: async (params) => {
    const response = await api.get('/patients', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/patients', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/patients/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
  getStats: async (id) => {
    const response = await api.get(`/patients/stats/${id}`);
    return response.data;
  },
};