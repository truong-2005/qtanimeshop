import axiosClient from './axiosClient';

const bannerApi = {
  getAll: () => {
    return axiosClient.get('/api/banners');
  },
  getById: (id) => {
    return axiosClient.get(`/api/banners/${id}`);
  },
  create: (formData) => {
    return axiosClient.post('/api/banners', formData);
  },
  update: (id, formData) => {
    return axiosClient.put(`/api/banners/${id}`, formData);
  },
  delete: (id) => {
    return axiosClient.delete(`/api/banners/${id}`);
  },
};

export default bannerApi;
