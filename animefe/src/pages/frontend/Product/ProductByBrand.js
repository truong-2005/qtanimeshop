import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import brandApi from '../../../api/brandApi';
import ProductAll from './ProductAll';
import Title from '../../../components/common/Title';
import Loading from '../../../components/common/Loading';

const ProductByBrand = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentBrandId = searchParams.get('brandId');
    if (currentBrandId !== id) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('brandId', id);
      newParams.set('page', '0');
      setSearchParams(newParams, { replace: true });
    }

    const fetchBrand = async () => {
      try {
        const brand = await brandApi.getById(id);
        setBrandName(brand?.name || 'Thương hiệu');
      } catch (err) {
        setBrandName('Thương hiệu không tồn tại');
      } finally {
        setLoading(false);
      }
    };
    fetchBrand();
  }, [id, searchParams, setSearchParams]);

  if (loading) {
    return <div className="min-h-screen pt-20"><Loading text="Đang tải thương hiệu..." /></div>;
  }

  return (
    <div className="pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rose-900/30 border border-rose-500/30 rounded-2xl p-8 mb-[-30px] shadow-lg shadow-rose-900/20 text-center">
          <Title subtitle="Sản phẩm chính hãng từ" className="justify-center text-rose-100">{brandName}</Title>
        </div>
      </div>
      <ProductAll />
    </div>
  );
};

export default ProductByBrand;
