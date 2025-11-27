import axiosClient from './axiosClient';

const categoryApi = {
    getAll: () => axiosClient.get('/categories'),
    create: (data: any) => axiosClient.post('/categories', data),
    update: (id: any, data: any) => axiosClient.put(`/categories/${id}`, data),
    delete: (id: any) => axiosClient.delete(`/categories/${id}`),
};

export default categoryApi;

//Đức