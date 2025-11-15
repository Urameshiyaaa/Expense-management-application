import axiosClient from './axiosClient';

const transactionApi = {
  getAll: async (userId) => axiosClient.get(`/transactions/${userId}`),
  create: async (data) => axiosClient.post('/transactions', data),
  update: async (id, data) => axiosClient.put(`/transactions/${id}`, data),
  delete: async (id) => axiosClient.delete(`/transactions/${id}`)
};

export default transactionApi;
