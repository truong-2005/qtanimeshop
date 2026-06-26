import axiosClient from './axiosClient';

const commentApi = {
  createComment: (data) => {
    return axiosClient.post('/api/comments', data);
  },
  replyComment: (data) => {
    return axiosClient.post('/api/comments/reply', data);
  },
  getCommentsByProduct: (productId) => {
    return axiosClient.get(`/api/comments/product/${productId}`);
  }
};

export default commentApi;
