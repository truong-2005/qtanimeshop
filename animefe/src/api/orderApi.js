import axiosClient from './axiosClient';

const orderApi = {
  getAll: () => {
    return axiosClient.get('/api/orders');
  },
  getById: (id) => {
    return axiosClient.get(`/api/orders/${id}`);
  },
  create: (data) => {
    return axiosClient.post('/api/orders', data);
  },
  delete: (id) => {
    return axiosClient.delete(`/api/orders/${id}`);
  },
  updateStatus: (id, orderStatusRequest) => {
    return axiosClient.put(`/api/orders/${id}/status`, orderStatusRequest);
  },
  cancelOrder: (id) => {
    return axiosClient.put(`/api/orders/cancel/${id}`);
  },
  getMyOrders: () => {
    return axiosClient.get('/api/orders/my-orders');
  },
  getMyOrderDetail: (id) => {
    return axiosClient.get(`/api/orders/my-orders/${id}`);
  }
};

export default orderApi;
