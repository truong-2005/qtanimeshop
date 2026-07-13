import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import settingApi from '../../api/settingApi';

const Footer = () => {
  const [setting, setSetting] = useState(null);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await settingApi.getSetting();
        setSetting(res);
      } catch (err) {
        console.error('Failed to load settings in footer:', err);
      }
    };
    fetchSetting();
  }, []);

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 select-none py-12 px-6 md:px-16 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white text-sm shadow-sm">
              DS
            </span>
            <span className="font-extrabold tracking-wider text-slate-900 uppercase">
              {setting?.siteName || 'ANIME STORE'}
            </span>
          </Link>
          <p className="text-xs text-slate-600 leading-relaxed font-light">
            {setting?.slogan || 'Cửa hàng phân phối mô hình nhân vật anime, manga bản quyền Nhật Bản chính hãng. Hợp tác chính thức với các studio hàng đầu.'}
          </p>
        </div>

        {/* Store Menu */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Cửa hàng</h4>
          <ul className="flex flex-col gap-2 text-xs font-medium">
            <li><Link to="/products" className="hover:text-purple-600 transition-colors">Tất cả mô hình</Link></li>
            <li><Link to="/products?sale=true" className="hover:text-purple-600 transition-colors">Khuyến mãi cực hot</Link></li>
            <li><Link to="/products?category=1" className="hover:text-purple-600 transition-colors">Nendoroid</Link></li>
            <li><Link to="/products?category=2" className="hover:text-purple-600 transition-colors">Scale Figure</Link></li>
          </ul>
        </div>

        {/* Support Menu */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Hỗ trợ khách hàng</h4>
          <ul className="flex flex-col gap-2 text-xs font-medium">
            <li><Link to="/posts" className="hover:text-purple-600 transition-colors">Tin tức mô hình</Link></li>
            <li><a href="#rules" className="hover:text-purple-600 transition-colors">Chính sách vận chuyển</a></li>
            <li><a href="#refund" className="hover:text-purple-600 transition-colors">Chính sách đổi trả hàng</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Liên hệ</h4>
          <ul className="flex flex-col gap-2 text-xs font-light space-y-1">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Hotline: {setting?.hotline || '091 234 5678'}</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email: {setting?.email || 'support@animestore.vn'}</span>
            </li>
            {setting?.address && (
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Địa chỉ: {setting.address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p>© 2026 {setting?.siteName || 'Anime Store'}. Hàng chính hãng 100%.</p>
        <p className="font-light">Thiết kế bởi Antigravity Team</p>
      </div>
    </footer>
  );
};

export default Footer;
