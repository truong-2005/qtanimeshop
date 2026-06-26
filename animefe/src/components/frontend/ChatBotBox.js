import React, { useState, useRef, useEffect } from 'react';
import chatbotApi from '../../api/chatbotApi';

const ChatBotBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Tôi là trợ lý AI của Anime Store. Tôi có thể giúp gì cho bạn?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userMsg = question.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await chatbotApi.ask({ question: userMsg });
      const answer = response?.answer || response?.data?.answer || 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.';
      setMessages((prev) => [...prev, { sender: 'bot', text: answer }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Có lỗi kết nối xảy ra. Vui lòng kiểm tra lại đường truyền.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] select-none font-sans">
      {/* Chat Toggler Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Open AI Chatbot"
        >
          <svg className="w-6.5 h-6.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Floating Chat Box Panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-[#0c0a1a] border border-purple-900/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-purple-950 to-indigo-950 border-b border-purple-900/30 flex justify-between items-center text-left">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Trợ lý AI</h4>
                <p className="text-[9px] text-slate-400">Hỗ trợ khách hàng trực tuyến</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Close Chat"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-purple-950">
            {messages.map((msg, index) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={index}
                  className={`max-w-[80%] flex flex-col ${isBot ? 'self-start text-left' : 'self-end text-right'}`}
                >
                  <div
                    className={`
                      px-3.5 py-2.5 text-xs rounded-2xl leading-relaxed
                      ${isBot
                        ? 'bg-slate-900/80 text-slate-100 rounded-tl-none border border-purple-950/20'
                        : 'bg-purple-600 text-white rounded-tr-none shadow shadow-purple-500/10'
                      }
                    `}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="self-start text-left max-w-[80%]">
                <div className="px-4 py-3 bg-slate-900/80 border border-purple-950/20 text-slate-100 text-xs rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input text footer */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-purple-900/20 bg-slate-950/50 flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 bg-slate-900 border border-purple-950/40 text-slate-100 rounded-xl text-xs px-3.5 py-2 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 disabled:hover:bg-purple-600 transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
              aria-label="Send Message"
            >
              <svg className="w-4 h-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBotBox;
