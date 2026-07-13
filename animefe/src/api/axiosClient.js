import axios from 'axios';
import tokenService from '../services/tokenService';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8083';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isAdminRequest = () => {
  return window.location.pathname.startsWith('/admin');
};

axiosClient.interceptors.request.use(
  (config) => {
    const token = isAdminRequest() 
      ? tokenService.getAdminAccessToken() 
      : tokenService.getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // IMPORTANT: Fix Axios multipart/form-data boundary bug
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      if (config.headers.common) {
        delete config.headers.common['Content-Type'];
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const isAdmin = isAdminRequest();
      const refreshToken = isAdmin 
        ? tokenService.getAdminRefreshToken() 
        : tokenService.getRefreshToken();
        
      if (refreshToken) {
        try {
          // Call refresh API directly to avoid standard client interceptors
          const response = await axios.post(`${baseURL}/api/refresh-token`, { refreshToken });
          const authData = response.data?.data;
          
          if (authData && authData.accessToken) {
            if (isAdmin) {
              tokenService.setAdminAccessToken(authData.accessToken);
              if (authData.refreshToken) {
                tokenService.setAdminRefreshToken(authData.refreshToken);
              }
            } else {
              tokenService.setAccessToken(authData.accessToken);
              if (authData.refreshToken) {
                tokenService.setRefreshToken(authData.refreshToken);
              }
            }
            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${authData.accessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${authData.accessToken}`;
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          if (isAdmin) {
            tokenService.clearAdmin();
            window.dispatchEvent(new Event('admin-logout'));
          } else {
            tokenService.clearClient();
            window.dispatchEvent(new Event('auth-logout'));
          }
          return Promise.reject(refreshError);
        }
      }
      if (isAdmin) {
        tokenService.clearAdmin();
        window.dispatchEvent(new Event('admin-logout'));
      } else {
        tokenService.clearClient();
        window.dispatchEvent(new Event('auth-logout'));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
