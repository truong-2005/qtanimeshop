import axiosClient from './axiosClient';

const productSaleApi = {
  createSale: (productId, data) => {
    return axiosClient.post(`/api/product-sales/${productId}`, data);
  },
  removeSale: (productId) => {
    return axiosClient.delete(`/api/product-sales/${productId}`);
  }
};

export default productSaleApi;
