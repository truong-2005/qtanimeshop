import axiosClient from './axiosClient';

const brandApi = {
  getAll: () => {
    return axiosClient.get('/api/brands');
  },
  getById: (id) => {
    return axiosClient.get(`/api/brands/${id}`);
  },
  create: (data) => {
    return axiosClient.post('/api/brands', data);
  },
  update: (id, data) => {
    return axiosClient.put(`/api/brands/${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`/api/brands/${id}`);
  },
};

export default brandApi;
