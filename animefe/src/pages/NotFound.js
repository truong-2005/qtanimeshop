import React from 'react';
import { Link } from 'react-router-dom';
import Title from '../components/common/Title';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0c1d] text-slate-100 p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-900/50 p-10 rounded-3xl border border-purple-900/20 shadow-2xl">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-rose-400 drop-shadow-lg">
          404
        </h1>
        <Title subtitle="Lỗi kết nối" className="justify-center text-rose-400 mb-0">Không tìm thấy trang</Title>
        <p className="text-slate-400 pb-4">
          Oof! Trang bạn đang tìm kiếm đã bị cuốn vào một lỗ hổng không gian hoặc không tồn tại.
        </p>
        <Link to="/">
          <Button variant="primary" className="w-full justify-center text-lg py-3 rounded-xl shadow-lg shadow-purple-500/20">
            Quay lại Trái Đất (Trang Chủ)
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
