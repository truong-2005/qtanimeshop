import axiosClient from './axiosClient';

const settingApi = {
  getSetting: () => {
    return axiosClient.get('/api/settings');
  },
  updateSetting: (data) => {
    return axiosClient.put('/api/settings', data);
  }
};

export default settingApi;
