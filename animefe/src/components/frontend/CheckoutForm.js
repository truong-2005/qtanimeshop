import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const CheckoutForm = ({ onSubmit, isLoading = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    receiverName: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'COD',
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        receiverName: initialData.receiverName || prev.receiverName,
        phone: initialData.phone || prev.phone,
        address: initialData.address || prev.address,
      }));
    }
  }, [initialData]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const selectPayment = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.receiverName.trim()) newErrors.receiverName = 'Tên người nhận là bắt buộc';
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc';
    if (!formData.address.trim()) newErrors.address = 'Địa chỉ giao hàng là bắt buộc';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#110e2d]/60 border border-purple-900/30 rounded-2xl p-6 shadow-xl flex flex-col gap-5 text-left">
      <h3 className="text-base font-bold text-slate-100 border-b border-purple-900/20 pb-3 uppercase tracking-wider">
        Thông tin giao hàng
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tên người nhận"
          name="receiverName"
          value={formData.receiverName}
          onChange={handleChange}
          error={errors.receiverName}
          placeholder="Nhập họ và tên..."
        />
        <Input
          label="Số điện thoại"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="Ví dụ: 0987654321"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-300">Địa chỉ cụ thể</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          className={`
            w-full bg-slate-900 border text-slate-100 rounded-lg text-sm px-4 py-2.5 placeholder:text-slate-600 focus:outline-none resize-none transition-all duration-300
            ${errors.address
              ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
              : 'border-purple-950/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
            }
          `}
          placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
        />
        {errors.address && (
          <span className="text-xs text-rose-500">{errors.address}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-300">Ghi chú thêm</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows="2"
          className="w-full bg-slate-900 border border-purple-950/40 text-slate-100 rounded-lg text-sm px-4 py-2.5 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 resize-none"
          placeholder="Lưu ý giao hàng, thời gian nhận..."
        />
      </div>

      {/* Payment Selectors */}
      <div className="flex flex-col gap-2.5 mt-2">
        <label className="text-sm font-medium text-slate-300">Phương thức thanh toán</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* COD Card */}
          <div
            onClick={() => selectPayment('COD')}
            className={`
              border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all duration-300
              ${formData.paymentMethod === 'COD'
                ? 'border-purple-500 bg-purple-500/10 shadow-lg'
                : 'border-purple-900/10 bg-slate-950/30 hover:border-purple-500/30'
              }
            `}
          >
            <span className="w-5 h-5 rounded-full border-2 border-purple-500 flex items-center justify-center flex-shrink-0">
              {formData.paymentMethod === 'COD' && (
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              )}
            </span>
            <div className="text-left select-none">
              <p className="text-xs font-bold text-slate-200">COD (Thanh toán khi nhận)</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Thanh toán bằng tiền mặt khi giao hàng</p>
            </div>
          </div>

          {/* VNPAY Card */}
          <div
            onClick={() => selectPayment('VNPAY')}
            className={`
              border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all duration-300
              ${formData.paymentMethod === 'VNPAY'
                ? 'border-purple-500 bg-purple-500/10 shadow-lg'
                : 'border-purple-900/10 bg-slate-950/30 hover:border-purple-500/30'
              }
            `}
          >
            <span className="w-5 h-5 rounded-full border-2 border-purple-500 flex items-center justify-center flex-shrink-0">
              {formData.paymentMethod === 'VNPAY' && (
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              )}
            </span>
            <div className="text-left select-none">
              <p className="text-xs font-bold text-slate-200">Ví VNPay / Ngân hàng</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Thanh toán qua ví điện tử VNPay quét mã QR</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Order */}
      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-extrabold text-xs uppercase shadow-lg shadow-purple-500/30 mt-3"
      >
        Đặt hàng ngay
      </Button>
    </form>
  );
};

export default CheckoutForm;
