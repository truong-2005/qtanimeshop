import axiosClient from './axiosClient';

const uploadApi = {
  uploadFile: (formData) => {
    return axiosClient.post('/api/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteFile: (fileName) => {
    return axiosClient.delete('/api/uploads', { params: { fileName } });
  }
};

export default uploadApi;
