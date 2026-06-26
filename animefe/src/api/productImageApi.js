import axiosClient from './axiosClient';

const productImageApi = {
  addImage: (productId, formData) => {
    return axiosClient.post(`/api/product-images/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: (imageId) => {
    return axiosClient.delete(`/api/product-images/${imageId}`);
  }
};

export default productImageApi;
