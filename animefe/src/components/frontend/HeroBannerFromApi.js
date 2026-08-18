import React, { useEffect, useState } from 'react';
import { getImageUrl } from '../../utils/getImageUrl';
import { Link } from 'react-router-dom';

// Backend URL from environment variable
const BANNERS_API = `${process.env.REACT_APP_BACKEND_URL || ''}/api/banners`;

// Placeholder image (beautiful Unsplash)
const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=80';

const HeroBannerFromApi = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const resp = await fetch(BANNERS_API);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        const first = Array.isArray(data) ? data[0] : data;
        setBanner(first);
      } catch (e) {
        console.error('fetch banner error', e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
        <span className="text-slate-200 text-lg">Đang tải banner…</span>
      </div>
    );
  }

  const imgSrc = banner?.imageUrl ? getImageUrl(banner.imageUrl, PLACEHOLDER_IMG) : PLACEHOLDER_IMG;

  return (
    <section className="relative w-full overflow-hidden">
      <img
        src={imgSrc}
        alt={banner?.title ?? 'Banner'}
        className="w-full h-[70vh] object-cover transition-opacity duration-500"
        onError={e => {
          e.target.src = PLACEHOLDER_IMG;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">{banner?.title ?? 'Welcome to Anime Store'}</h1>
        {banner?.description && (
          <p className="mt-4 max-w-xl text-lg text-white/90 drop-shadow">{banner.description}</p>
        )}
        <Link
          to="/products"
          className="mt-8 inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transform transition"
        >
          Xem tất cả sản phẩm
        </Link>
      </div>
    </section>
  );
};

export default HeroBannerFromApi;
