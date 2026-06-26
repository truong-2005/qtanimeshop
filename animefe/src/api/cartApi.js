import axiosClient from './axiosClient';

const cartApi = {
  getMyCart: () => {
    return axiosClient.get('/api/cart');
  },
  addToCart: (cartRequest) => {
    return axiosClient.post('/api/cart', cartRequest);
  },
  updateQuantity: (cartItemId, quantity) => {
    return axiosClient.put(`/api/cart/${cartItemId}`, null, { params: { quantity } });
  },
  removeItem: (cartItemId) => {
    return axiosClient.delete(`/api/cart/${cartItemId}`);
  },
  clearCart: () => {
    return axiosClient.delete('/api/cart/clear');
  }
};

export default cartApi;
