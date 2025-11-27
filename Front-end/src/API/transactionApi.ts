import axiosClient from './axiosClient';

const transactionApi = {
  getAll: async (userId: any) => axiosClient.get(`/transactions/${userId}`),
  create: async (data: any) => axiosClient.post('/transactions', data),
  update: async (id: any, data: any) => axiosClient.put(`/transactions/${id}`, data),
  delete: async (id: any) => axiosClient.delete(`/transactions/${id}`)
};

export default transactionApi;
