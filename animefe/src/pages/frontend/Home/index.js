import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../../../components/frontend/HeroBanner';
import CategoryMenu from '../../../components/frontend/CategoryMenu';
import BrandMenu from '../../../components/frontend/BrandMenu';
import FlashSale from '../../../components/frontend/FlashSale';
import ProductGrid from '../../../components/frontend/ProductGrid';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import productApi from '../../../api/productApi';

const Home = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await productApi.getAll({ sortBy: 'id', sortDirection: 'desc', size: 8 });
        setLatestProducts(res.content || []);
      } catch (err) {
        console.error('Failed to fetch latest products:', err);
      } finally {
        setLoadingLatest(false);
      }
    };
    fetchLatestProducts();
  }, []);

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Immersive Hero Banner */}
      <HeroBanner />

      {/* Flash Sale */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <FlashSale />
      </section>

      {/* Categories & Brands & New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Menus */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <CategoryMenu />
            <BrandMenu />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <Title subtitle="Bộ sưu tập mới">Hàng Mới Về</Title>
              <Link to="/products/new">
                <Button variant="outline" className="text-sm">Xem tất cả</Button>
              </Link>
            </div>
            <ProductGrid products={latestProducts} isLoading={loadingLatest} />
          </div>
        </div>
      </section>

      {/* Categories Banner */}
      <section className="bg-indigo-50 border-y border-indigo-100 py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 mb-6">
            Đắm chìm vào thế giới Anime
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-10">
            Khám phá hàng ngàn mô hình Figure chính hãng từ các thương hiệu hàng đầu Nhật Bản. Chất lượng tinh xảo, giá cả cạnh tranh.
          </p>
          <Link to="/products">
            <Button variant="primary" className="px-8 py-3 text-lg rounded-full shadow-lg shadow-indigo-500/25">
              Khám phá ngay
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
