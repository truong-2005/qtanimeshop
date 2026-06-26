import axiosClient from './axiosClient';

const menuApi = {
  getAll: () => {
    return axiosClient.get('/api/menus');
  },
  getById: (id) => {
    return axiosClient.get(`/api/menus/${id}`);
  },
  create: (data) => {
    return axiosClient.post('/api/menus', data);
  },
  update: (id, data) => {
    return axiosClient.put(`/api/menus/${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`/api/menus/${id}`);
  }
};

export default menuApi;
