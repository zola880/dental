import api from './api';

export const settingService = {
  getAll: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
  getByKey: async (key) => {
    const response = await api.get(`/settings/${key}`);
    return response.data;
  },
  update: async (key, data) => {
    const response = await api.put(`/settings/${key}`, data);
    return response.data;
  },
  bulkUpdate: async (settings) => {
    const response = await api.put('/settings', { settings });
    return response.data;
  },
  delete: async (key) => {
    const response = await api.delete(`/settings/${key}`);
    return response.data;
  },
  initialize: async () => {
    const response = await api.post('/settings/initialize');
    return response.data;
  },
};