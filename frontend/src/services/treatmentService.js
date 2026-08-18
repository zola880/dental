import api from './api';

export const treatmentService = {
  getAll: async (params) => {
    const response = await api.get('/treatments', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/treatments/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/treatments', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/treatments/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/treatments/${id}`);
    return response.data;
  },
  getRecords: async (treatmentId) => {
    const response = await api.get(`/treatments/${treatmentId}/records`);
    return response.data;
  },
  addRecord: async (treatmentId, data) => {
    const response = await api.post(`/treatments/${treatmentId}/records`, data);
    return response.data;
  },
};