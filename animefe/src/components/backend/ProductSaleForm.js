import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { formatCurrency } from '../../utils';

const ProductSaleForm = ({
  productPrice = 0,
  initialData = null,
  onSubmit,
  onRemove,
  isLoading = false,
}) => {
  const [salePercent, setSalePercent] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setSalePercent(initialData.salePercent || 0);
      setSalePrice(initialData.salePrice || 0);
      setStartDate(initialData.startDate ? initialData.startDate.substring(0, 16) : '');
      setEndDate(initialData.endDate ? initialData.endDate.substring(0, 16) : '');
    } else {
      setSalePercent(0);
      setSalePrice(productPrice);
      setStartDate('');
      setEndDate('');
    }
  }, [initialData, productPrice]);

  const handlePercentChange = (e) => {
    const pct = Math.min(Math.max(parseInt(e.target.value) || 0, 0), 100);
    setSalePercent(pct);
    // Auto-calculate discount price
    const calculatedPrice = productPrice - (productPrice * pct) / 100;
    setSalePrice(calculatedPrice);
    if (errors.salePercent || errors.salePrice) {
      setErrors((prev) => ({ ...prev, salePercent: '', salePrice: '' }));
    }
  };

  const handlePriceChange = (e) => {
    const price = Math.max(parseFloat(e.target.value) || 0, 0);
    setSalePrice(price);
    // Auto-calculate percent
    if (productPrice > 0) {
      const pct = Math.round(((productPrice - price) / productPrice) * 100);
      setSalePercent(Math.min(Math.max(pct, 0), 100));
    }
    if (errors.salePercent || errors.salePrice) {
      setErrors((prev) => ({ ...prev, salePercent: '', salePrice: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (salePercent <= 0) newErrors.salePercent = 'Vui lòng nhập phần trăm giảm giá lớn hơn 0';
    if (salePrice >= productPrice) newErrors.salePrice = 'Giá khuyến mãi phải nhỏ hơn giá gốc';
    if (!startDate) newErrors.startDate = 'Thời gian bắt đầu là bắt buộc';
    if (!endDate) newErrors.endDate = 'Thời gian kết thúc là bắt buộc';
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      newErrors.endDate = 'Thời gian kết thúc phải sau thời gian bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (onSubmit) {
      onSubmit({
        salePercent: parseInt(salePercent),
        salePrice: parseFloat(salePrice),
        startDate: startDate.length === 16 ? `${startDate}:00` : startDate,
        endDate: endDate.length === 16 ? `${endDate}:00` : endDate,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
      <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
        <span>Thiết lập khuyến mãi (Sale Off)</span>
        <span className="text-xs font-semibold px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
          Giá gốc: {formatCurrency(productPrice)}
        </span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Phần trăm giảm (%)"
          type="number"
          value={salePercent}
          onChange={handlePercentChange}
          error={errors.salePercent}
          min="0"
          max="100"
        />
        <Input
          label="Giá sau khi giảm (VND)"
          type="number"
          value={salePrice}
          onChange={handlePriceChange}
          error={errors.salePrice}
          min="0"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Thời gian bắt đầu"
          type="datetime-local"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: '' }));
          }}
          error={errors.startDate}
        />
        <Input
          label="Thời gian kết thúc"
          type="datetime-local"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: '' }));
          }}
          error={errors.endDate}
        />
      </div>

      <div className="flex justify-between items-center border-t border-slate-800 pt-4 mt-2">
        <div>
          {initialData && onRemove && (
            <Button type="button" variant="danger" onClick={onRemove} isLoading={isLoading}>
              Xóa khuyến mãi
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? 'Cập nhật khuyến mãi' : 'Áp dụng khuyến mãi'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProductSaleForm;
