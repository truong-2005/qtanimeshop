import axiosClient from './axiosClient';

const productStoreApi = {
  getAllStores: () => {
    return axiosClient.get('/api/product-store');
  },
  getStoreByProductId: (productId) => {
    return axiosClient.get(`/api/product-store/product/${productId}`);
  },
  addStock: (data) => {
    return axiosClient.post('/api/product-store/add', data);
  },
  updateStock: (data) => {
    return axiosClient.put('/api/product-store/update', data);
  }
};

export default productStoreApi;
