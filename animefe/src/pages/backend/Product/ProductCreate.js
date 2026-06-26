import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productApi from '../../../api/productApi';
import categoryApi from '../../../api/categoryApi';
import brandApi from '../../../api/brandApi';
import ProductForm from '../../../components/backend/ProductForm';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

const ProductCreate = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const catRes = await categoryApi.getAll();
        const brRes = await brandApi.getAll();
        setCategories(catRes || []);
        setBrands(brRes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await productApi.create(formData);
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      const errorData = err.response?.data;
      const errorMsg = errorData?.message || errorData?.error || err.message;
      alert("Lỗi từ máy chủ: " + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading text="Đang tải dữ liệu cấu hình..." />;

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/products')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Tạo sản phẩm mới</Title>
      </div>
      <ProductForm categories={categories} brands={brands} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default ProductCreate;
