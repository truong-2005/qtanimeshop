import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userApi from '../../../api/userApi';
import Title from '../../../components/common/Title';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }
    
    setIsLoading(true);
    try {
      await userApi.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      alert('Đổi mật khẩu thành công!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng kiểm tra lại mật khẩu cũ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#110e2d]/60 p-8 rounded-2xl shadow-2xl border border-purple-900/30">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/profile" className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <Title subtitle="Bảo mật tài khoản" className="mb-0">Đổi Mật Khẩu</Title>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="password"
            label="Mật khẩu hiện tại"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            label="Mật khẩu mới"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Tối thiểu 6 ký tự"
            required
          />
          <Input
            type="password"
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && <div className="text-rose-500 text-sm font-medium bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg text-center">{error}</div>}

          <Button type="submit" variant="primary" className="w-full justify-center" isLoading={isLoading}>
            Cập nhật mật khẩu
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
