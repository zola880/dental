import api from './api';

export const notificationService = {
  getAll: async (params) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/notifications', data);
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
  deleteAll: async () => {
    const response = await api.delete('/notifications');
    return response.data;
  },
};