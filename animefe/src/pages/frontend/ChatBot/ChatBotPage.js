import React from 'react';
import ChatBotBox from '../../../components/frontend/ChatBotBox';
import Title from '../../../components/common/Title';

const ChatBotPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-200px)]">
      <div className="text-center mb-8">
        <Title subtitle="Hỗ trợ thông minh 24/7" className="justify-center text-indigo-400">Trợ Lý Ảo AnimeStore</Title>
        <p className="text-slate-400 mt-2">Hỏi bất cứ điều gì về sản phẩm, chính sách hoặc đơn hàng của bạn.</p>
      </div>
      
      <div className="bg-[#110e2d]/60 border border-purple-900/30 rounded-2xl shadow-xl overflow-hidden h-[600px]">
        <ChatBotBox />
      </div>
    </div>
  );
};

export default ChatBotPage;
