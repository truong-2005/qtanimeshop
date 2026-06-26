import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import Title from '../../../components/common/Title';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const Login = () => {
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.usernameOrEmail || !formData.password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập/email và mật khẩu');
      return;
    }

    setIsLoading(true);
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <Title subtitle="AnimeStore" className="justify-center">Đăng Nhập Khách Hàng</Title>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Tên đăng nhập hoặc Email"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            placeholder="animefan99 / abc@gmail.com"
            required
          />
          
          <div className="space-y-1">
            <Input
              type="password"
              label="Mật khẩu"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-purple-600 hover:text-purple-500 font-medium transition-colors">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          {error && <div className="text-rose-500 text-sm font-medium bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg text-center">{error}</div>}

          <Button type="submit" variant="primary" className="w-full justify-center" isLoading={isLoading}>
            Đăng nhập
          </Button>
          
          <div className="mt-4 text-center">
            <a href="http://localhost:8083/oauth2/authorization/google" className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Đăng nhập bằng Google
            </a>
          </div>

          <div className="text-center text-sm text-slate-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-purple-600 hover:text-purple-500">
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
