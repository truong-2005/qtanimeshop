import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import couponApi from '../../../api/couponApi';
import Title from '../../../components/common/Title';
import Input from '../../../components/common/Input';
import SelectBox from '../../../components/common/SelectBox';
import Button from '../../../components/common/Button';
import { toast } from 'react-toastify';

const CouponForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENT',
    discountValue: '',
    minOrderValue: '',
    quantity: '',
    startDate: '',
    endDate: '',
    active: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : null,
        quantity: formData.quantity ? Number(formData.quantity) : null,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
      };

      await couponApi.create(data);
      toast.success('Đã tạo mã giảm giá mới');
      navigate('/admin/coupons');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Title subtitle="Thêm mã giảm giá mới vào hệ thống">Tạo Mã Giảm Giá</Title>
      
      <form onSubmit={handleSubmit} className="bg-slate-900/40 p-6 rounded-xl border border-slate-800/80 flex flex-col gap-4">
        <Input
          label="Mã giảm giá"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
          placeholder="Ví dụ: SUMMER2024"
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectBox
            label="Loại giảm giá"
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            options={[
              { value: 'PERCENT', label: 'Theo phần trăm (%)' },
              { value: 'FIXED_AMOUNT', label: 'Theo số tiền (VND)' }
            ]}
          />
          <Input
            label="Giá trị giảm"
            type="number"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleChange}
            required
            placeholder={formData.discountType === 'PERCENT' ? 'Ví dụ: 10' : 'Ví dụ: 50000'}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Đơn hàng tối thiểu (VND)"
            type="number"
            name="minOrderValue"
            value={formData.minOrderValue}
            onChange={handleChange}
            placeholder="Để trống nếu không yêu cầu"
          />
          <Input
            label="Số lượng tối đa"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Để trống nếu không giới hạn"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ngày bắt đầu"
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          <Input
            label="Ngày kết thúc"
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
          />
          <label htmlFor="active" className="text-sm text-slate-300">Kích hoạt mã</label>
        </div>

        <div className="flex gap-4 mt-4">
          <Button type="submit" isLoading={isSubmitting}>Lưu mã giảm giá</Button>
          <Button variant="secondary" onClick={() => navigate('/admin/coupons')} type="button">Hủy</Button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
