import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    usernameOrEmail: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.usernameOrEmail.trim() || !credentials.password.trim()) {
      setError('Vui lòng điền đầy đủ Tên đăng nhập/Email và Mật khẩu.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await adminLogin({
        usernameOrEmail: credentials.usernameOrEmail,
        password: credentials.password,
      });
      // Auth data role is checked in AuthContext. Here we redirect to dashboard on success.
      if (response && response.data?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        setError('Tài khoản của bạn không có quyền truy cập trang quản trị.');
      }
    } catch (err) {
      console.error('Lỗi đăng nhập quản trị:', err);
      setError(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu quản trị không chính xác.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden px-4">
      {/* Abstract Glowing Neon Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl relative z-10 flex flex-col gap-6 text-left">
        {/* Brand logo & header */}
        <div className="text-center flex flex-col gap-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-purple-500/25">
            A
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-wide mt-2">ANIMEFE ADMIN</h1>
          <p className="text-xs text-slate-500">Đăng nhập cổng quản trị viên hệ thống</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Tên đăng nhập hoặc Email"
            name="usernameOrEmail"
            value={credentials.usernameOrEmail}
            onChange={handleChange}
            placeholder="admin, manager@animefe.vn..."
            required
          />

          <Input
            label="Mật khẩu"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            isLoading={isLoading} 
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-purple-500/20 font-bold"
          >
            Đăng nhập quản trị
          </Button>
        </form>

        <div className="text-center text-[10px] text-slate-600 border-t border-slate-900/60 pt-4 mt-2">
          Hệ thống giám sát bảo mật nghiêm ngặt. Truy cập trái phép sẽ bị ghi nhận IP.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
