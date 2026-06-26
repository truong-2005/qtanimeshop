import axiosClient from './axiosClient';

const dashboardApi = {
  getStatistics: () => {
    return axiosClient.get('/api/dashboard');
  }
};

export default dashboardApi;
