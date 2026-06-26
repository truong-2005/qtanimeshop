import axiosClient from './axiosClient';

const reviewApi = {
  createReview: (data) => {
    return axiosClient.post('/api/reviews', data);
  },
  getReviewsByProduct: (productId) => {
    return axiosClient.get(`/api/reviews/product/${productId}`);
  }
};

export default reviewApi;
