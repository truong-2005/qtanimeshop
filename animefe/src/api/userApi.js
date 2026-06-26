import axiosClient from './axiosClient';

const userApi = {
  getAll: () => {
    return axiosClient.get('/api/users');
  },
  create: (data) => {
    return axiosClient.post('/api/users', data);
  },
  getById: (id) => {
    return axiosClient.get(`/api/users/${id}`);
  },
  update: (id, data) => {
    return axiosClient.put(`/api/users/${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`/api/users/${id}`);
  },
  getMyProfile: () => {
    return axiosClient.get('/api/users/me');
  },
  updateProfile: (formData) => {
    return axiosClient.put('/api/users/me', formData);
  },
  changePassword: (data) => {
    return axiosClient.put('/api/users/change-password', data);
  }
};

export default userApi;
