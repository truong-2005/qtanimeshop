import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productApi from '../../../api/productApi';
import productStoreApi from '../../../api/productStoreApi';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Loading from '../../../components/common/Loading';

const ProductStore = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [addQuantity, setAddQuantity] = useState('');
  const [importPrice, setImportPrice] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const prod = await productApi.getById(id);
        setProduct(prod);
        
        // Cố gắng lấy số lượng tồn kho hiện tại từ kho
        try {
          const storeRes = await productStoreApi.getStoreByProductId(id);
          setQuantity(storeRes?.quantity || prod.quantity || 0);
        } catch (storeErr) {
           setQuantity(prod.quantity || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetch();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await productStoreApi.addStock({
        productId: id,
        quantity: parseInt(addQuantity),
        importPrice: parseFloat(importPrice)
      });
      alert('Nhập hàng vào kho thành công!');
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi nhập kho.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading />;

  return (
    <div className="flex flex-col gap-6 text-left max-w-md">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/products')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <span className="text-sm font-semibold text-slate-400">Nhập hàng</span>
      </div>
      <form onSubmit={handleUpdate} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-4">
        <h3 className="text-base font-bold text-white">Quản lý nhập kho: {product?.name}</h3>
        <Input
          label="Số lượng hiện tại trong kho"
          type="number"
          value={quantity}
          disabled
        />
        <Input
          label="Số lượng nhập thêm"
          type="number"
          placeholder="Nhập số lượng..."
          min="1"
          required
          value={addQuantity}
          onChange={(e) => setAddQuantity(e.target.value)}
        />
        <Input
          label="Giá nhập"
          type="number"
          placeholder="Nhập giá..."
          min="0"
          required
          value={importPrice}
          onChange={(e) => setImportPrice(e.target.value)}
        />
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <Button type="submit" variant="primary" isLoading={isLoading}>Xác nhận nhập kho</Button>
        </div>
      </form>
    </div>
  );
};

export default ProductStore;
