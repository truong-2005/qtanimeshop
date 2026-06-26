import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productApi from '../../../api/productApi';
import categoryApi from '../../../api/categoryApi';
import brandApi from '../../../api/brandApi';
import ProductForm from '../../../components/backend/ProductForm';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

const ProductUpdate = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const prod = await productApi.getById(id);
        const catRes = await categoryApi.getAll();
        const brRes = await brandApi.getAll();
        setProduct(prod);
        setCategories(catRes || []);
        setBrands(brRes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await productApi.update(id, formData);
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading text="Đang tải dữ liệu sản phẩm..." />;

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/products')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Cập nhật sản phẩm</Title>
      </div>
      <ProductForm initialData={product} categories={categories} brands={brands} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default ProductUpdate;
