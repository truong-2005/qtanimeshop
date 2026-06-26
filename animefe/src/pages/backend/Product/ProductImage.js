import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productApi from '../../../api/productApi';
import productImageApi from '../../../api/productImageApi';
import ProductImageUpload from '../../../components/backend/ProductImageUpload';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

const ProductImage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const res = await productApi.getById(productId);
      setProduct(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [productId]);

  const handleUpload = async (formData, successCallback) => {
    setIsLoading(true);
    try {
      await productImageApi.addImage(productId, formData);
      await loadData();
      if (successCallback) successCallback();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi bộ sưu tập?')) {
      setIsLoading(true);
      try {
        await productImageApi.deleteImage(imageId);
        await loadData();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isFetching) return <Loading text="Đang tải danh sách ảnh..." />;

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/products')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <span className="text-sm font-semibold text-slate-400">Sản phẩm: {product?.name}</span>
      </div>
      <ProductImageUpload
        images={product?.images || []}
        onUpload={handleUpload}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductImage;
