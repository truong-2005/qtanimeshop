import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productApi from '../../../api/productApi';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { formatCurrency, getImageUrl } from '../../../utils';

const ProductShow = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await productApi.getById(id);
        setProduct(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) return <Loading />;
  if (!product) return <div className="text-slate-400">Không tìm thấy sản phẩm</div>;

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 max-w-xl text-left flex flex-col gap-4">
      <h3 className="text-lg font-bold text-white">Chi tiết sản phẩm</h3>
      <img
        src={getImageUrl(product.thumbnail, 'https://placehold.co/128x160?text=No+Image')}
        alt={product.name}
        className="w-32 h-40 object-cover rounded border border-slate-800 bg-slate-950"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/128x160?text=No+Image';
        }}
      />
      <div className="flex flex-col gap-2 text-sm text-slate-300 mt-2">
        <p><span className="font-semibold text-slate-500">ID:</span> #{product.id}</p>
        <p><span className="font-semibold text-slate-500">Tên:</span> {product.name}</p>
        <p><span className="font-semibold text-slate-500">Slug:</span> {product.slug}</p>
        <p><span className="font-semibold text-slate-500">Giá:</span> {formatCurrency(product.price)}</p>
        <p><span className="font-semibold text-slate-500">Mô tả:</span> {product.description || 'Không có mô tả'}</p>
        <p><span className="font-semibold text-slate-500">Thương hiệu:</span> {product.brandName}</p>
        <p><span className="font-semibold text-slate-500">Danh mục:</span> {product.categoryName}</p>
        <p><span className="font-semibold text-slate-500">Trạng thái:</span> {product.status}</p>
      </div>
      <Button variant="secondary" onClick={() => navigate('/admin/products')} className="mt-4">
        Trở lại
      </Button>
    </div>
  );
};

export default ProductShow;
