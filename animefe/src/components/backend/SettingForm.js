import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const SettingForm = ({ initialData = null, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    siteName: '',
    email: '',
    hotline: '',
    address: '',
    slogan: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        siteName: initialData.siteName || '',
        email: initialData.email || '',
        hotline: initialData.hotline || '',
        address: initialData.address || '',
        slogan: initialData.slogan || '',
      });
    }
  }, [initialData]);

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

  const validate = () => {
    const newErrors = {};
    if (!formData.siteName.trim()) newErrors.siteName = 'Tên website là bắt buộc';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

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
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Site Name */}
        <Input
          label="Tên Website / Cửa hàng"
          name="siteName"
          value={formData.siteName}
          onChange={handleChange}
          error={errors.siteName}
          placeholder="Ví dụ: Anime Figure Store"
        />

        {/* Slogan */}
        <Input
          label="Slogan khẩu hiệu"
          name="slogan"
          value={formData.slogan}
          onChange={handleChange}
          error={errors.slogan}
          placeholder="Ví dụ: Thiên đường mô hình chính hãng"
        />

        {/* Email */}
        <Input
          label="Email hỗ trợ"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="support@animestore.vn"
        />

        {/* Hotline */}
        <Input
          label="Hotline liên hệ"
          name="hotline"
          value={formData.hotline}
          onChange={handleChange}
          error={errors.hotline}
          placeholder="0912345678"
        />
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-300">Địa chỉ văn phòng / cửa hàng</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-sm px-4 py-2.5 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 resize-none"
          placeholder="Nhập địa chỉ cụ thể..."
        />
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Lưu cấu hình hệ thống
        </Button>
      </div>
    </form>
  );
};

export default SettingForm;
