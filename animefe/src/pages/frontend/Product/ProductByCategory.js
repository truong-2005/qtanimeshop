import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import categoryApi from '../../../api/categoryApi';
import ProductAll from './ProductAll';
import Title from '../../../components/common/Title';
import Loading from '../../../components/common/Loading';

const ProductByCategory = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inject categoryId into search params if not present or different
    const currentCatId = searchParams.get('categoryId');
    if (currentCatId !== id) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('categoryId', id);
      newParams.set('page', '0'); // reset page
      setSearchParams(newParams, { replace: true });
    }

    const fetchCat = async () => {
      try {
        const cat = await categoryApi.getById(id);
        setCategoryName(cat?.name || 'Danh mục');
      } catch (err) {
        setCategoryName('Danh mục không tồn tại');
      } finally {
        setLoading(false);
      }
    };
    fetchCat();
  }, [id, searchParams, setSearchParams]);

  if (loading) {
    return <div className="min-h-screen pt-20"><Loading text="Đang tải danh mục..." /></div>;
  }

  return (
    <div className="pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-2xl p-8 mb-[-30px] shadow-lg shadow-indigo-900/20 text-center">
          <Title subtitle="Sản phẩm theo danh mục" className="justify-center text-indigo-100">{categoryName}</Title>
        </div>
      </div>
      <ProductAll />
    </div>
  );
};

export default ProductByCategory;
