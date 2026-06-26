import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import tokenService from '../../../services/tokenService';
import userApi from '../../../api/userApi';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../../components/common/Loading';

const GoogleLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateProfileState } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      alert('Đăng nhập Google thất bại!');
      navigate('/login');
      return;
    }

    if (token) {
      tokenService.setAccessToken(token);
      
      // Lấy thông tin user hiện tại
      userApi.getMyProfile()
        .then((res) => {
          tokenService.setUser(res);
          updateProfileState(res);
          navigate('/');
        })
        .catch((err) => {
          console.error(err);
          alert('Không thể lấy thông tin người dùng.');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, updateProfileState]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Loading text="Đang xác thực thông tin từ Google..." />
    </div>
  );
};

export default GoogleLogin;
