import React from 'react';
import ProductAll from './ProductAll';
import Title from '../../../components/common/Title';

const ProductSale = () => {
  return (
    <div className="pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-8 mb-[-30px] shadow-lg shadow-red-900/20 text-center">
          <Title subtitle="Giảm giá siêu khủng" className="justify-center text-red-100">Khuyến Mãi Hot</Title>
        </div>
      </div>
      <ProductAll />
    </div>
  );
};

export default ProductSale;
