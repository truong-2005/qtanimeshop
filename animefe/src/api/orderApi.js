import axiosClient from './axiosClient';

const orderApi = {
  getAll: (params) => {
    return axiosClient.get('/api/orders', { params });
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
  updatePaymentStatus: (id, paymentStatusRequest) => {
    return axiosClient.put(`/api/orders/${id}/payment-status`, paymentStatusRequest);
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
