import axiosClient from './axiosClient';

const productApi = {
  getAll: (params) => {
    return axiosClient.get('/api/products', { params });
  },
  getById: (id) => {
    return axiosClient.get(`/api/products/${id}`);
  },
  getBySlug: (slug) => {
    return axiosClient.get(`/api/products/slug/${slug}`);
  },
  create: (data) => {
    return axiosClient.post('/api/products', data);
  },
  update: (id, data) => {
    return axiosClient.put(`/api/products/${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`/api/products/${id}`);
  },
};

export default productApi;
