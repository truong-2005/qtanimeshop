import axiosClient from './axiosClient';

const productStoreApi = {
  getStoreInformation: () => {
    return axiosClient.get('/api/product-store');
  },
  createStore: (data) => {
    return axiosClient.post('/api/product-store', data);
  },
  updateStore: (id, data) => {
    return axiosClient.put(`/api/product-store/${id}`, data);
  },
  deleteStore: (id) => {
    return axiosClient.delete(`/api/product-store/${id}`);
  }
};

export default productStoreApi;
