import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationApi from '../../../api/notificationApi';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

const NotificationSend = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      setError('Tiêu đề và nội dung thông báo là bắt buộc');
      return;
    }

    setIsLoading(true);
    try {
      await notificationApi.sendNotification(formData);
      alert('Gửi thông báo thành công!');
      navigate('/admin/notifications');
    } catch (err) {
      console.error('Lỗi khi gửi thông báo:', err);
      setError('Đã xảy ra lỗi khi kết nối máy chủ gửi thông báo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-xl">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/notifications')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Gửi thông báo đẩy mới</Title>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-5">
        <Input
          label="Tiêu đề thông báo"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Nhập tiêu đề (ví dụ: Ưu đãi Flash Sale)..."
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-400">Nội dung thông báo</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            placeholder="Nhập nội dung thông báo chi tiết gửi tới toàn bộ người dùng..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-600 outline-none transition-all text-sm resize-y"
            required
          />
        </div>

        {error && <p className="text-rose-500 text-xs">{error}</p>}

        <div className="flex justify-end gap-3 border-t border-slate-800 pt-4 mt-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/notifications')}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Gửi ngay
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSend;
