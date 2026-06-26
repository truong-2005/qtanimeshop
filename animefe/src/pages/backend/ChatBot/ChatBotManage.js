import React, { useState, useRef, useEffect } from 'react';
import chatbotApi from '../../../api/chatbotApi';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';

const ChatBotManage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Xin chào! Tôi là Trợ lý Anime AI. Bạn có thể hỏi tôi bất kỳ câu hỏi nào về mô hình figure để kiểm thử hành vi phản hồi của tôi.',
      time: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      sender: 'user',
      text: inputText,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // API call matching OpenAPI ChatRequest: { question }
      const response = await chatbotApi.ask({ question: userMessage.text });
      
      // API response matching OpenAPI ChatResponse: { question, answer }
      const botMessage = {
        sender: 'bot',
        text: response?.answer || response?.response || response?.reply || response || 'Tôi đã nhận được câu hỏi, nhưng không nhận được câu trả lời phản hồi phù hợp từ server.',
        time: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Lỗi kết nối API Chatbot. Vui lòng kiểm tra lại dịch vụ Spring Boot AI Chatbot!',
          time: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Bạn có chắc chắn muốn dọn dẹp lịch sử trò chuyện thử nghiệm này?')) {
      setMessages([
        {
          sender: 'bot',
          text: 'Lịch sử trò chuyện đã được dọn sạch. Bạn có thể bắt đầu phiên thử nghiệm mới!',
          time: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left h-[calc(100vh-140px)]">
      <div className="flex justify-between items-center">
        <Title subtitle="Khu vực kiểm thử phản hồi của AI Chatbot bán mô hình anime">
          Hệ thống Chatbot AI
        </Title>
        <Button variant="secondary" size="sm" onClick={handleClear}>
          Xóa lịch sử
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Chat Console container */}
        <div className="lg:col-span-3 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden min-h-0">
          {/* Chat Header */}
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-805 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
                  AI
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950"></div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Trợ lý Anime Assistant</h4>
                <p className="text-[10px] text-slate-500">Mô hình AI: Gemini-Flash-Pro / RAG Database</p>
              </div>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse text-right' : 'mr-auto'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-900/60 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                    BOT
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : msg.isError
                        ? 'bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-tl-none'
                        : 'bg-slate-950 text-slate-300 rounded-tl-none border border-slate-850'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 px-1">
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 mr-auto items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-900/60 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                  BOT
                </div>
                <div className="bg-slate-950 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-850 flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full bg-slate-600 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-600 animate-bounce delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-600 animate-bounce delay-300"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input form */}
          <form onSubmit={handleSend} className="bg-slate-950 p-4 border-t border-slate-850 flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập câu hỏi kiểm tra chatbot..."
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 outline-none transition-all text-sm"
              disabled={isLoading}
            />
            <Button type="submit" variant="primary" disabled={isLoading} className="rounded-xl px-5 py-2.5">
              Gửi
            </Button>
          </form>
        </div>

        {/* Sidebar settings info card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-xs">
          <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Thông tin cấu hình AI</h4>
          
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 font-semibold">Tên Bot:</span>
            <span className="text-slate-200">Anime Shop Assistant</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-slate-500 font-semibold">Chức năng chính:</span>
            <p className="text-slate-400 leading-relaxed">
              Tư vấn mô hình anime figure, tìm kiếm theo tên nhân vật, bộ truyện, gợi ý mức giá, kiểm tra tồn kho & hỗ trợ tra cứu mã đơn hàng.
            </p>
          </div>

          <div className="flex flex-col gap-1 border-t border-slate-800 pt-3">
            <span className="text-slate-500 font-semibold">Tài liệu RAG Indexing:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 mt-1">
              <li>Cơ sở dữ liệu danh mục & hãng</li>
              <li>Thông tin sản phẩm & giá bán</li>
              <li>Chính sách hoàn trả & vận chuyển</li>
            </ul>
          </div>

          <div className="flex flex-col gap-1 border-t border-slate-800 pt-3 text-[10px] text-slate-500">
            <p className="italic">Lưu ý: Mọi hội thoại ở đây chỉ chạy thử nghiệm trên máy quản trị, không được lưu trữ vào lịch sử mua hàng của khách hàng.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotManage;
