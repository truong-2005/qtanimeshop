import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import bannerApi from '../../api/bannerApi';

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await bannerApi.getAll();
        const items = res?.content || res || [];
        const activeBanners = items.filter(b => b.active !== false);
        setBanners(activeBanners);
      } catch (err) {
        console.error('Failed to load banners:', err);
      }
    };
    fetchBanners();
  }, []);

  if (!banners || banners.length === 0) return null;

  const current = banners[currentIndex];

  return (
    <section className="relative bg-[#0d0c1d] min-h-[400px] md:min-h-[500px] flex items-center overflow-hidden rounded-2xl border border-purple-900/30 shadow-2xl p-6 md:p-12 select-none group">
      {/* Dynamic Background Blur using the current image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={current.image || 'https://via.placeholder.com/1200x800'} 
          alt="blur background" 
          className="w-full h-full object-cover opacity-20 filter blur-3xl transform scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c1d] via-[#0d0c1d]/90 to-transparent" />
      </div>

      {/* Visual Neon Drops */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[200px] h-[200px] bg-pink-500/10 rounded-full filter blur-[90px] pointer-events-none" />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full relative z-10">
        {/* Left Info Column */}
        <div className="lg:col-span-7 flex flex-col items-start gap-4 text-left">
          {/* Badge */}
          <span className="px-3 py-1 text-[10px] font-extrabold tracking-widest text-pink-400 bg-pink-500/10 rounded-full border border-pink-500/20 uppercase animate-pulse">
            Sự Kiện Nổi Bật
          </span>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-wide drop-shadow-[0_2px_10px_rgba(168,85,247,0.3)] leading-tight line-clamp-2">
            {current.title}
          </h1>

          {/* Description */}
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl font-light line-clamp-3">
            {current.description}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <Button
              variant="primary"
              onClick={() => navigate(current.link || '/products')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-extrabold text-sm uppercase shadow-lg shadow-purple-500/30 active:scale-95 transition-all"
            >
              Xem Chi Tiết
            </Button>
          </div>
        </div>

        {/* Right Art Column */}
        <div className="lg:col-span-5 relative flex items-center justify-center h-full min-h-[250px] lg:min-h-[350px]">
          {/* Glow rings */}
          <div className="absolute w-[120%] h-[120%] rounded-full border border-purple-500/20 animate-spin-slow pointer-events-none" />
          
          {/* Main Banner Graphic */}
          <div className="relative z-10 w-full aspect-[4/3] rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl shadow-purple-500/20 bg-slate-950/50">
            <img
              src={current.image || 'https://via.placeholder.com/800x600'} 
              alt={current.title}
              className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c1d]/60 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Slide Index Dot Selectors */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${currentIndex === idx
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-8 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                  : 'bg-slate-700 hover:bg-slate-500 w-2'
                }
              `}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BannerSlider;
