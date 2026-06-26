import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import Title from '../../../components/common/Title';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import SelectBox from '../../../components/common/SelectBox';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    gender: 'MALE'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <Title subtitle="AnimeStore" className="justify-center">Đăng Ký Tài Khoản</Title>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Tên đăng nhập"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ví dụ: otaku99"
              required
            />
            <Input
              label="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="abc@gmail.com"
              required
            />
            <Input
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0912345678"
              required
            />
          </div>

          <SelectBox
            label="Giới tính"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={[
              { value: 'MALE', label: 'Nam' },
              { value: 'FEMALE', label: 'Nữ' },
              { value: 'OTHER', label: 'Khác' },
            ]}
          />

          <Input
            type="password"
            label="Mật khẩu"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="•••••••• (Tối thiểu 6 ký tự)"
            required
          />

          {error && <div className="text-rose-500 text-sm font-medium bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg text-center">{error}</div>}

          <Button type="submit" variant="primary" className="w-full justify-center mt-6" isLoading={isLoading}>
            Tạo tài khoản
          </Button>

          <div className="text-center text-sm text-slate-600 mt-4">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-bold text-purple-600 hover:text-purple-500">
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
