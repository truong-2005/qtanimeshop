import React from 'react';
import { NavLink } from 'react-router-dom';
import FrontendLayout from './FrontendLayout';

const ProfileLayout = ({ children }) => {
  const activeClass = 'flex items-center gap-3 px-4 py-3 text-sm font-bold text-white bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg transition-all duration-300';
  const inactiveClass = 'flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-purple-950/10 border-l-4 border-transparent transition-all duration-300';

  return (
    <FrontendLayout>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 bg-[#0f0e24]/40 border border-purple-900/20 rounded-xl p-4 flex flex-col gap-1.5 shadow-lg select-none text-left h-fit">
            <h3 className="px-4 py-2 text-xs font-black uppercase text-slate-500 tracking-widest border-b border-purple-900/20 mb-2">
              Tài khoản của tôi
            </h3>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
              Thông tin cá nhân
            </NavLink>
            <NavLink to="/my-orders" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
              Đơn hàng đã đặt
            </NavLink>
            <NavLink to="/change-password" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
              Đổi mật khẩu
            </NavLink>
          </div>

          {/* Content Slot */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default ProfileLayout;
