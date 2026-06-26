import React from 'react';
import ProductAll from './ProductAll';
import Title from '../../../components/common/Title';

const ProductBestSale = () => {
  return (
    <div className="pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-orange-900/30 border border-orange-500/30 rounded-2xl p-8 mb-[-30px] shadow-lg shadow-orange-900/20 text-center">
          <Title subtitle="Top Trending" className="justify-center text-orange-100">Bán Chạy Nhất</Title>
        </div>
      </div>
      <ProductAll />
    </div>
  );
};

export default ProductBestSale;
