import axiosClient from './axiosClient';

const couponApi = {
  getAll() {
    const url = '/api/coupons';
    return axiosClient.get(url);
  },

  getByCode(code) {
    const url = `/api/coupons/${code}`;
    return axiosClient.get(url);
  },

  create(data) {
    const url = '/api/coupons';
    return axiosClient.post(url, data);
  },

  update(id, data) {
    const url = `/api/coupons/${id}`;
    return axiosClient.put(url, data);
  },

  remove(id) {
    const url = `/api/coupons/${id}`;
    return axiosClient.delete(url);
  },

  apply(data) {
    const url = '/api/coupons/apply';
    return axiosClient.post(url, data);
  }
};

export default couponApi;
