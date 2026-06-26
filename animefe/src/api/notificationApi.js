import axiosClient from './axiosClient';

const notificationApi = {
  getNotifications: () => {
    return axiosClient.get('/api/notifications');
  },
  sendNotification: (data) => {
    return axiosClient.post('/api/notifications/send', data);
  }
};

export default notificationApi;
