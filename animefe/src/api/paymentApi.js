import axiosClient from './axiosClient';

const paymentApi = {
  getAll: () => {
    return axiosClient.get('/api/payments');
  },
  getById: (id) => {
    return axiosClient.get(`/api/payments/${id}`);
  },
  create: (data) => {
    return axiosClient.post('/api/payments', data);
  },
  update: (id, data) => {
    return axiosClient.put(`/api/payments/${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`/api/payments/${id}`);
  }
};

export default paymentApi;
