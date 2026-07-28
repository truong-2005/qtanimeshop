import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authApi from '../../../api/authApi';
import Title from '../../../components/common/Title';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const ResetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialToken = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    token: initialToken,
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.token || !formData.newPassword || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ các thông tin');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        token: formData.token,
        newPassword: formData.newPassword
      });
      alert('Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Mã khôi phục không hợp lệ hoặc đã hết hạn.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800">
        <div className="text-center mb-8">
          <Title subtitle="Khôi phục tài khoản" className="justify-center">Đặt Lại Mật Khẩu</Title>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Mã khôi phục (Token)"
            name="token"
            value={formData.token}
            onChange={handleChange}
            placeholder="Nhập mã bạn nhận được trong email"
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
            placeholder="Nhập lại mật khẩu mới"
            required
          />

          {error && <div className="text-rose-500 text-sm font-medium bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg text-center">{error}</div>}

          <Button type="submit" variant="primary" className="w-full justify-center" isLoading={isLoading}>
            Đặt lại mật khẩu
          </Button>
          
          <div className="text-center text-sm text-slate-400">
            <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300">
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
