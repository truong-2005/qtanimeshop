import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getImageUrl, formatRelativeTime } from '../../utils';
import notificationApi from '../../api/notificationApi';

const AdminHeader = ({ onToggleSidebar }) => {
  const { adminUser, adminLogout } = useAuth() || {};
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationApi.getNotifications();
        const list = Array.isArray(data) ? data : [];
        setNotifications(list);
        
        const lastReadId = parseInt(localStorage.getItem('lastReadAdminNotificationId') || '0', 10);
        const unread = list.filter(n => n.id > lastReadId).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAllRead = () => {
    if (notifications.length > 0) {
      const maxId = Math.max(...notifications.map(n => n.id));
      localStorage.setItem('lastReadAdminNotificationId', maxId.toString());
      setUnreadCount(0);
    }
  };

  const handleLogout = async () => {
    if (adminLogout) {
      try {
        await adminLogout();
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    navigate('/admin/login');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-6 shadow-md shadow-slate-950/20 select-none">
      {/* Left items */}
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
          <Link to="/admin" className="text-slate-500 hover:text-slate-300">Dashboard</Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-medium">Overview</span>
        </nav>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden lg:block">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-48 bg-slate-950 border border-slate-800 rounded-lg text-xs pl-9 pr-4 py-2 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Quick action icons */}
        <div className="flex items-center gap-2">
          {/* Messages */}
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-all relative">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-slate-900 animate-pulse" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-all relative"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-rose-500 ring-2 ring-slate-900 text-[9px] font-bold text-white flex items-center justify-center px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-2 border-b border-slate-800 mb-2">
                  <h3 className="text-slate-200 font-bold text-sm">Thông báo</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
                
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-slate-500 text-sm">
                      Không có thông báo nào.
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notif) => (
                      <div key={notif.id} className="px-4 py-3 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 last:border-0 cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notif.id > parseInt(localStorage.getItem('lastReadAdminNotificationId') || '0', 10) ? 'bg-indigo-500' : 'bg-transparent'}`} />
                          <div>
                            <p className="text-sm text-slate-200 font-medium line-clamp-1">{notif.title}</p>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{notif.message}</p>
                            <p className="text-[10px] text-slate-500 mt-2">{formatRelativeTime(notif.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="border-t border-slate-800 p-2 text-center bg-slate-900/50 mt-1">
                  <Link 
                    to="/admin/notifications" 
                    onClick={() => setIsNotifOpen(false)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Xem tất cả
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vertical divider */}
        <div className="w-px h-6 bg-slate-800" />

        {/* User avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">
                {adminUser?.fullName || 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider text-right">
                {adminUser?.role || 'Admin'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-white text-xs select-none">
              {adminUser?.avatar ? (
                <img
                  src={getImageUrl(adminUser.avatar)}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                'A'
              )}
            </div>
          </button>

          {/* Floating Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1.5 z-50 text-sm text-slate-300">
              <Link
                to="/admin/users/me"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Thông tin cá nhân</span>
              </Link>
              <Link
                to="/admin/users/change-password"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m-5-3a3 3 0 11-6 0 3 3 0 016 0zM4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Đổi mật khẩu</span>
              </Link>
              <div className="border-t border-slate-800 my-1.5" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-rose-500 hover:bg-slate-800 hover:text-rose-400 transition-colors text-left font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

