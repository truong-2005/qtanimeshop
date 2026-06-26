import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductAll from './ProductAll';
import Title from '../../../components/common/Title';

const ProductNew = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const sortBy = searchParams.get('sortBy');
    if (sortBy !== 'id') {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('sortBy', 'id');
      newParams.set('sortDirection', 'desc');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-2xl p-8 mb-[-30px] shadow-lg shadow-emerald-900/20 text-center">
          <Title subtitle="Khám phá ngay" className="justify-center text-emerald-100">Hàng Mới Về</Title>
        </div>
      </div>
      <ProductAll />
    </div>
  );
};

export default ProductNew;
