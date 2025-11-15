import axiosClient from './axiosClient';

const budgetApi = {
  getAll: async (userId) => axiosClient.get(`/budgets/${userId}`),
  create: async (data) => axiosClient.post('/budgets', data),
  delete: async (id) => axiosClient.delete(`/budgets/${id}`)
};

export default budgetApi;

