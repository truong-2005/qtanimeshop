import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import categoryApi from '../../api/categoryApi';
import brandApi from '../../api/brandApi';
import { formatCurrency, getImageUrl } from '../../utils';

const Header = () => {
  const { user, logout } = useAuth() || {};
  const { cartItems } = useCart() || { cartItems: [] };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryApi.getAll(),
          brandApi.getAll()
        ]);
        setCategories(catRes || []);
        setBrands(brandRes || []);
      } catch (err) {
        console.error('Failed to load categories/brands for header:', err);
      }
    };
    fetchDropdownData();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  const handleLogout = async () => {
    if (logout) {
      try {
        await logout();
      } catch (err) {
        console.error('Logout failed:', err);
      }
    }
    navigate('/login');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const totalCartValue = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 0)), 0);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavLinks = () => (
    <>
      <Link 
        to="/" 
        className={`px-4 py-1.5 rounded-full transition-all duration-300 ${isActive('/') ? 'bg-gradient-to-r from-brand-pink/10 to-brand-purple/10 text-purple-900 font-bold shadow-sm' : 'hover:bg-slate-100 hover:text-black text-slate-900 font-medium'}`}
      >
        Trang chủ
      </Link>
      
      {/* Cửa hàng Dropdown (Hover on Desktop) */}
      <div className="relative group">
        <Link 
          to="/products" 
          className={`flex items-center gap-1 px-4 py-1.5 rounded-full transition-all duration-300 ${isActive('/products') ? 'bg-gradient-to-r from-brand-pink/10 to-brand-purple/10 text-purple-900 font-bold shadow-sm' : 'hover:bg-slate-100 hover:text-black text-slate-900 font-medium'}`}
        >
          Cửa hàng
          <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </Link>
        
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1000] backdrop-blur-xl">
          <Link to="/products" className="block px-4 py-2 hover:bg-slate-50 hover:text-purple-700 transition-colors">Tất cả sản phẩm</Link>
          <Link to="/products/new" className="block px-4 py-2 hover:bg-slate-50 hover:text-purple-700 transition-colors">Hàng mới về</Link>
          <Link to="/products/best-sale" className="block px-4 py-2 hover:bg-slate-50 hover:text-purple-700 transition-colors">Bán chạy nhất</Link>
          <Link to="/products/sale" className="block px-4 py-2 hover:bg-slate-50 hover:text-pink-600 text-pink-500 font-medium transition-colors">Đang khuyến mãi</Link>
        </div>
      </div>

      {/* Danh mục Dropdown */}
      {categories.length > 0 && (
        <div className="relative group">
          <span className="flex items-center gap-1 px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-slate-100 hover:text-black text-slate-900 font-medium cursor-pointer">
            Danh mục
            <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1000] backdrop-blur-xl max-h-[60vh] overflow-y-auto custom-scrollbar">
            {categories.map(cat => (
              <Link key={cat.id} to={`/products/category/${cat.id}`} className="block px-4 py-2 hover:bg-slate-50 hover:text-purple-700 transition-colors truncate">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Thương hiệu Dropdown */}
      {brands.length > 0 && (
        <div className="relative group">
          <span className="flex items-center gap-1 px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-slate-100 hover:text-black text-slate-900 font-medium cursor-pointer">
            Thương hiệu
            <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1000] backdrop-blur-xl max-h-[60vh] overflow-y-auto custom-scrollbar">
            {brands.map(brand => (
              <Link key={brand.id} to={`/products/brand/${brand.id}`} className="block px-4 py-2 hover:bg-slate-50 hover:text-purple-700 transition-colors truncate">
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      
      
    </>
  );

  const headerBgClass = isHome && !scrolled 
    ? 'bg-transparent border-transparent' 
    : 'bg-white/95 backdrop-blur-md border-slate-200 shadow-sm';

  return (
    <header className={`sticky top-0 z-[999] border-b transition-all duration-300 px-4 md:px-8 py-4 select-none ${headerBgClass}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-800 hover:text-black p-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span className="font-cinzel font-black tracking-widest text-slate-900 text-lg md:text-xl hidden sm:block">
           <span className="text-brand-pink font-bold">Anime Shop</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium tracking-wide">
          <NavLinks />
        </nav>

        {/* Action triggers */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Global Search Button (mock) */}
          <Link to="/products/search" className="p-2 text-slate-900 hover:text-purple-600 transition-colors hidden sm:block">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {/* Shopping Cart Dropdown */}
          <div className="relative group">
            <Link
              to="/cart"
              className="p-2 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-900 hover:text-purple-600 transition-colors relative cursor-pointer"
              aria-label="View shopping cart"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 text-[10px] font-extrabold text-white rounded-full flex items-center justify-center px-1 shadow animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* Mini Cart Panel */}
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-[1000] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 backdrop-blur-xl">
              <div className="p-4 border-b border-slate-100">
                <h3 className="text-slate-900 font-bold text-sm">Giỏ hàng của bạn ({totalCartCount})</h3>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                {cartItems.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    <p>Giỏ hàng đang trống</p>
                    <Link to="/products" className="text-purple-600 hover:text-purple-500 mt-2 inline-block">Mua sắm ngay</Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {cartItems.slice(0, 5).map((item, idx) => (
                      <Link 
                        key={idx} 
                        to={`/product/${item.slug || item.productId || ''}`}
                        className="flex gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors group/item"
                      >
                        <div className="w-12 h-16 shrink-0 bg-white rounded overflow-hidden border border-slate-200">
                          <img src={getImageUrl(item.thumbnail, 'https://placehold.co/50x70')} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-center flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate group-hover/item:text-purple-600 transition-colors">
                            {item.name}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-slate-500">SL: {item.quantity}</span>
                            <span className="text-xs font-bold text-pink-600">{formatCurrency(item.price)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {cartItems.length > 5 && (
                      <div className="text-center py-2 text-xs text-slate-400 font-medium">
                        Và {cartItems.length - 5} sản phẩm khác...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-slate-500 font-medium">Tổng tiền:</span>
                    <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {formatCurrency(totalCartValue)}
                    </span>
                  </div>
                  <Link 
                    to="/cart"
                    className="block w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-center font-bold text-sm rounded-xl shadow-lg transition-all"
                  >
                    Xem giỏ hàng
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* User status trigger */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-9 h-9 rounded-full border-2 border-purple-200 overflow-hidden flex items-center justify-center bg-slate-100 text-slate-800 font-bold text-xs select-none hover:ring-2 hover:ring-purple-200 transition-all focus:outline-none ml-2"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.username?.substring(0, 1).toUpperCase() || 'U'
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-[1000] text-sm text-slate-700 backdrop-blur-xl">
                  <div className="px-4 py-3 border-b border-slate-100 mb-2">
                    <p className="text-slate-900 font-bold truncate">{user.username}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  
                  {user.roles?.includes('ADMIN') && (
                    <Link
                      to="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 hover:text-purple-700 transition-colors text-purple-600 font-medium"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Trang Quản Trị</span>
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <svg className="w-4.5 h-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Thông tin cá nhân</span>
                  </Link>
                  
                  <Link
                    to="/my-orders"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <svg className="w-4.5 h-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>Đơn hàng của tôi</span>
                  </Link>
                  
                  <div className="border-t border-slate-100 my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors text-left font-medium"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 px-6 py-2 text-sm font-bold tracking-wide bg-gradient-to-r from-brand-purple to-brand-pink hover:from-purple-800 hover:to-pink-600 text-white rounded-full shadow-[0_0_15px_rgba(180,38,123,0.4)] hover:shadow-[0_0_20px_rgba(180,38,123,0.6)] active:scale-95 transition-all duration-300"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-200 flex flex-col gap-4 pb-2 animate-slideIn bg-white shadow-xl rounded-xl p-4 absolute left-4 right-4 top-full">
          <Link to="/" className={`px-2 py-1 ${isActive('/') ? 'text-purple-600 font-bold' : 'text-slate-900 font-medium'}`}>Trang chủ</Link>
          <div className="flex flex-col gap-2 pl-2 border-l-2 border-slate-100 ml-2">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 mt-2">Cửa hàng</p>
            <Link to="/products" className={`pl-4 py-1 ${location.pathname === '/products' ? 'text-purple-600 font-bold' : 'text-slate-900 font-medium'}`}>Tất cả sản phẩm</Link>
            <Link to="/products/new" className={`pl-4 py-1 ${isActive('/products/new') ? 'text-purple-600 font-bold' : 'text-slate-900 font-medium'}`}>Hàng mới về</Link>
            <Link to="/products/best-sale" className={`pl-4 py-1 ${isActive('/products/best-sale') ? 'text-purple-600 font-bold' : 'text-slate-900 font-medium'}`}>Bán chạy nhất</Link>
            <Link to="/products/sale" className={`pl-4 py-1 ${isActive('/products/sale') ? 'text-pink-600 font-bold' : 'text-pink-600 font-medium'}`}>Đang khuyến mãi</Link>

            {categories.length > 0 && (
              <>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 mt-2">Danh mục</p>
                {categories.slice(0, 5).map(cat => (
                  <Link key={cat.id} to={`/products/category/${cat.id}`} className={`pl-4 py-1 ${isActive(`/products/category/${cat.id}`) ? 'text-purple-600 font-bold' : 'text-slate-900 font-medium'} truncate`}>{cat.name}</Link>
                ))}
              </>
            )}

            {brands.length > 0 && (
              <>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 mt-2">Thương hiệu</p>
                {brands.slice(0, 5).map(brand => (
                  <Link key={brand.id} to={`/products/brand/${brand.id}`} className={`pl-4 py-1 ${isActive(`/products/brand/${brand.id}`) ? 'text-purple-600 font-bold' : 'text-slate-900 font-medium'} truncate`}>{brand.name}</Link>
                ))}
              </>
            )}
          </div>
          <Link to="/posts" className={`px-2 py-1 ${isActive('/posts') ? 'text-purple-600 font-bold' : 'text-slate-900 font-medium'}`}>Tin tức</Link>
          <Link to="/chatbot" className={`px-2 py-1 flex items-center gap-2 ${isActive('/chatbot') ? 'text-cyan-600 font-bold' : 'text-slate-900 font-medium'}`}>
            Trợ lý AI <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
