import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import productApi from '../../../api/productApi';
import productSaleApi from '../../../api/productSaleApi';
import ProductSaleForm from '../../../components/backend/ProductSaleForm';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

const ProductSale = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await productApi.getById(productId);
        setProduct(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    load();
  }, [productId]);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      await productSaleApi.createSale(productId, data);
      toast.success('Thiết lập khuyến mãi thành công!');
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      toast.error('Lỗi thiết lập khuyến mãi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Bạn có chắc chắn muốn huỷ chương trình khuyến mãi của sản phẩm này?')) {
      setIsLoading(true);
      try {
        await productSaleApi.removeSale(productId);
        toast.success('Huỷ khuyến mãi thành công!');
        navigate('/admin/products');
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi huỷ khuyến mãi');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isFetching) return <Loading text="Đang tải dữ liệu sản phẩm..." />;

  // Map existing promo data if available
  const initialSale = product.salePrice && product.salePrice < product.price ? {
    salePrice: product.salePrice,
    salePercent: Math.round(((product.price - product.salePrice) / product.price) * 100),
    startDate: '', // optional or mockup
    endDate: '',
  } : null;

  return (
    <div className="flex flex-col gap-6 text-left max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/products')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <span className="text-sm font-semibold text-slate-400">Sản phẩm: {product.name}</span>
      </div>
      <ProductSaleForm
        productPrice={product.price || 0}
        initialData={initialSale}
        onSubmit={handleSubmit}
        onRemove={handleRemove}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductSale;
