import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authApi from '../../../api/authApi';
import Title from '../../../components/common/Title';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await authApi.forgotPassword({ email });
      setSuccess('Yêu cầu khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn để nhận mã khôi phục.');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800">
        <div className="text-center mb-8">
          <Title subtitle="Khôi phục tài khoản" className="justify-center">Quên Mật Khẩu</Title>
        </div>
        
        {success ? (
          <div className="text-center space-y-6">
            <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
              {success}
            </div>
            <Link to="/reset-password">
              <Button variant="primary" className="w-full justify-center">
                Nhập mã khôi phục
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-slate-400 text-center">
              Vui lòng nhập địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi một mã thông báo để đặt lại mật khẩu.
            </p>

            <Input
              label="Địa chỉ Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
            />

            {error && <div className="text-rose-500 text-sm font-medium bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg text-center">{error}</div>}

            <Button type="submit" variant="primary" className="w-full justify-center" isLoading={isLoading}>
              Gửi mã khôi phục
            </Button>
            
            <div className="text-center text-sm text-slate-400">
              <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300">
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
