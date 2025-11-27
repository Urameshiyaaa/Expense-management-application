import axiosClient from './axiosClient';

const budgetApi = {
  getAll: async (userId: any) => axiosClient.get(`/budgets/${userId}`),
  create: async (data: any) => axiosClient.post('/budgets', data),
  delete: async (id: any) => axiosClient.delete(`/budgets/${id}`)
};

export default budgetApi;

