import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({
  products = [],
  isLoading = false,
  emptyMessage = 'Không tìm thấy sản phẩm nào',
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-[#0f0e24]/40 border border-purple-900/10 rounded-xl overflow-hidden aspect-[4/5.5] flex flex-col gap-3 p-4 animate-pulse"
          >
            <div className="flex-1 bg-slate-950/60 rounded-lg" />
            <div className="h-4 w-1/3 bg-slate-950/60 rounded" />
            <div className="h-6 w-3/4 bg-slate-950/60 rounded" />
            <div className="h-5 w-1/2 bg-slate-950/60 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-[#0f0e24]/30 border border-purple-950/10 rounded-xl">
        <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <span className="text-slate-500 font-medium">{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
