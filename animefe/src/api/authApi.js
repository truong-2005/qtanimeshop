import axiosClient from './axiosClient';

const authApi = {
  login: (data) => {
    return axiosClient.post('/api/login', data);
  },
  register: (data) => {
    return axiosClient.post('/api/register', data);
  },
  logout: (refreshToken) => {
    return axiosClient.post('/api/logout', null, { params: { refreshToken } });
  },
  refreshToken: (data) => {
    return axiosClient.post('/api/refresh-token', data);
  },
  forgotPassword: (data) => {
    return axiosClient.post('/api/forgot-password', data);
  },
  resetPassword: (data) => {
    return axiosClient.post('/api/reset-password', data);
  },
  adminLogin: (data) => {
    return axiosClient.post('/api/auth/admin/login', data);
  },
  adminRegister: (data) => {
    return axiosClient.post('/api/auth/admin/register', data);
  },
  adminLogout: (refreshToken) => {
    return axiosClient.post('/api/admin/logout', null, { params: { refreshToken } });
  },
  googleLogin: () => {
    return axiosClient.get('/api/oauth2/login/google');
  }
};

export default authApi;
