import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bannerApi from '../../api/bannerApi';

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await bannerApi.getAll();
        const activeBanners = res.filter(b => b.active);
        setBanners(activeBanners);
      } catch (err) {
        console.error('Lỗi khi tải banner:', err);
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8083${imagePath}`;
  };

  if (banners.length === 0) {
    return (
      <section className="relative w-full h-[400px] md:h-[500px] bg-slate-50 overflow-hidden flex items-center">
        {/* Background Gradient & Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-white to-purple-50 z-0"></div>
        
        {/* Mystical glowing circles */}
        <div className="absolute top-[20%] left-[5%] w-96 h-96 bg-purple-200/50 rounded-full blur-[120px] z-0"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-pink-200/50 rounded-full blur-[150px] z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-8 md:pt-12">
          <div className="flex flex-col gap-6 max-w-xl">
            <div className="flex flex-col gap-2">
              <h1 className="font-cinzel text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-tight tracking-wide drop-shadow-md">
                Anime Shop
              </h1>
            </div>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-lg mt-4 border-l-2 border-brand-pink/50 pl-4">
              Khám phá thế giới mô hình anime cực chất với hàng ngàn sản phẩm độc quyền và giới hạn dành cho các tín đồ Wibu.
            </p>

            <div className="flex items-center gap-4 mt-8">
              <Link to="/products" className="px-8 py-3.5 bg-gradient-to-r from-brand-pink to-[#8a1c5e] hover:from-[#d12c8f] hover:to-[#a82272] text-white rounded-full font-bold shadow-[0_0_20px_rgba(180,38,123,0.5)] hover:shadow-[0_0_30px_rgba(180,38,123,0.8)] transition-all duration-300 active:scale-95 text-center">
                Mua Sắm Ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <section className="relative w-full h-[300px] md:h-[450px] lg:h-[500px] bg-slate-100 overflow-hidden flex items-center group">
      
      {/* Banner Slider */}
      {banners.map((banner, idx) => (
        <div 
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
        >
          {/* Banner Image */}
          <Link to={banner.link || "#"} className="block w-full h-full cursor-pointer">
            <img 
              src={getImageUrl(banner.image)} 
              alt={banner.title} 
              className="w-full h-full object-cover object-center"
            />
          </Link>
        </div>
      ))}

      {/* Navigation Controls (Visible on Hover) */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 hover:bg-brand-pink transition-all backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 hover:bg-brand-pink transition-all backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
          
          {/* Slider dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
            {banners.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-brand-pink shadow-[0_0_10px_#ff2a85]' : 'bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroBanner;
