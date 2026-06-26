import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ isCollapsed = false }) => {
  const activeClass = 'flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-slate-800 border-l-4 border-indigo-500 transition-all duration-300';
  const inactiveClass = 'flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border-l-4 border-transparent transition-all duration-300';

  const menuGroups = [
    {
      title: 'Hệ thống',
      items: [
        {
          label: 'Dashboard',
          path: '/admin',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          tag: 'NEW',
        },
      ],
    },
    {
      title: 'Quản lý Catalog',
      items: [
        {
          label: 'Sản phẩm',
          path: '/admin/products',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
        },
        {
          label: 'Danh mục',
          path: '/admin/categories',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          ),
        },
        {
          label: 'Thương hiệu',
          path: '/admin/brands',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Giao dịch & Khách hàng',
      items: [
        {
          label: 'Đơn hàng',
          path: '/admin/orders',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          ),
        },
        {
          label: 'Thành viên',
          path: '/admin/users',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
        },
        {
          label: 'Thanh toán',
          path: '/admin/payments',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Truyền thông & Tin tức',
      items: [
        {
          label: 'Bài viết',
          path: '/admin/posts',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2m2 2v6a2 2 0 01-2 2H9M9 11h3m-3 4h6" />
            </svg>
          ),
        },
        {
          label: 'Chủ đề',
          path: '/admin/topics',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          label: 'Banners',
          path: '/admin/banners',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Cài đặt',
      items: [
        {
          label: 'Giao diện Menu',
          path: '/admin/menus',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          ),
        },
        {
          label: 'Thông báo',
          path: '/admin/notifications',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          ),
        },
        {
          label: 'Cài đặt chung',
          path: '/admin/settings',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          label: 'Tải File Độc Lập',
          path: '/admin/uploads',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <aside
      className={`
        bg-[#111827] text-slate-100 flex flex-col h-screen border-r border-slate-800 transition-all duration-300 select-none
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800 bg-slate-950/40">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/40">
              A
            </span>
            <span className="font-extrabold text-lg tracking-wider text-white">
              ANIME<span className="text-indigo-500">STORE</span>
            </span>
          </div>
        )}
        {isCollapsed && (
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white mx-auto">
            A
          </span>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-800">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-5">
            {!isCollapsed && (
              <h5 className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {group.title}
              </h5>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item, itemIdx) => (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="flex-1 truncate leading-none">{item.label}</span>
                  )}
                  {!isCollapsed && item.tag && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-400 rounded ring-1 ring-indigo-500/30">
                      {item.tag}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/20 text-center text-xs text-slate-600">
        {!isCollapsed ? 'Admin Control Panel v1.0' : 'ACP'}
      </div>
    </aside>
  );
};

export default AdminSidebar;
