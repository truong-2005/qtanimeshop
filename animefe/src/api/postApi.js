import axiosClient from './axiosClient';

const postApi = {
  getAll: (params) => {
    return axiosClient.get('/api/posts', { params });
  },
  getById: (id) => {
    return axiosClient.get(`/api/posts/${id}`);
  },
  getBySlug: (slug) => {
    return axiosClient.get(`/api/posts/slug/${slug}`);
  },
  create: (data) => {
    return axiosClient.post('/api/posts', data);
  },
  update: (id, data) => {
    return axiosClient.put(`/api/posts/${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`/api/posts/${id}`);
  }
};

export default postApi;
