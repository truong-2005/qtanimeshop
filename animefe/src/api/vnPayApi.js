import axiosClient from './axiosClient';

const vnPayApi = {
  createPayment: (data) => {
    return axiosClient.post('/api/vnpay/create-payment', data);
  },
  paymentCallback: (params) => {
    return axiosClient.get('/api/vnpay/payment-callback', { params });
  }
};

export default vnPayApi;
