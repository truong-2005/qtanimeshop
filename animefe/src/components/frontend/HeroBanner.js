import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bannerApi from '../../api/bannerApi';
import { getImageUrl } from '../../utils';

const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=80';

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await bannerApi.getAll();
        const activeBanners = (res || []).filter((b) => b.active);
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

  if (banners.length === 0) {
    return (
      <section className="relative w-full h-[300px] md:h-[450px] lg:h-[500px] bg-slate-100 overflow-hidden flex items-center">
        <img
          src={DEFAULT_BANNER}
          alt="Banner"
          className="w-full h-full object-cover object-center"
        />
      </section>
    );
  }

  return (
    <section className="relative w-full h-[300px] md:h-[450px] lg:h-[500px] bg-slate-100 overflow-hidden flex items-center group">
      {/* Banner Slider */}
      {banners.map((banner, idx) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Banner Image only */}
          <Link to={banner.link || '#'} className="block w-full h-full cursor-pointer">
            <img
              src={getImageUrl(banner.image, DEFAULT_BANNER)}
              alt={banner.title || 'Banner'}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_BANNER;
              }}
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
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 hover:bg-brand-pink transition-all backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slider dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'bg-brand-pink shadow-[0_0_10px_#ff2a85]'
                    : 'bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroBanner;
