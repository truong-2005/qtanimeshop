import axiosClient from './axiosClient';

const chatbotApi = {
  ask: (chatRequest) => {
    return axiosClient.post('/api/chatbot/ask', chatRequest);
  }
};

export default chatbotApi;
