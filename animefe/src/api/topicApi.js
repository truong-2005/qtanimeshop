import axiosClient from './axiosClient';

const topicApi = {
  getAll: () => {
    return axiosClient.get('/api/topics');
  },
  getById: (id) => {
    return axiosClient.get(`/api/topics/${id}`);
  },
  create: (data) => {
    return axiosClient.post('/api/topics', data);
  },
  update: (id, data) => {
    return axiosClient.put(`/api/topics/${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`/api/topics/${id}`);
  }
};

export default topicApi;
