import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import SelectBox from '../common/SelectBox';
import Button from '../common/Button';

const UserForm = ({ initialData = null, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    birthday: '',
    gender: 'OTHER',
    roleName: 'CUSTOMER',
    enabled: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        password: '', // blank by default for edit
        birthday: initialData.birthday || '',
        gender: initialData.gender || 'OTHER',
        roleName: initialData.role?.name || initialData.role || 'CUSTOMER',
        enabled: initialData.enabled !== undefined ? initialData.enabled : true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Tên tài khoản là bắt buộc';
    if (!formData.fullName.trim()) newErrors.fullName = 'Họ và tên là bắt buộc';
    
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc';
    
    // Password is only mandatory for new creations
    if (!initialData && !formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Map roleName back to matching API schema formatting
    const submissionData = {
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      birthday: formData.birthday || null,
      gender: formData.gender,
      enabled: formData.enabled,
      role: { name: formData.roleName },
    };

    if (formData.password) {
      submissionData.password = formData.password;
    }

    if (onSubmit) {
      onSubmit(submissionData);
    }
  };

  const genderOptions = [
    { value: 'MALE', label: 'Nam (Male)' },
    { value: 'FEMALE', label: 'Nữ (Female)' },
    { value: 'OTHER', label: 'Khác (Other)' },
  ];

  const roleOptions = [
    { value: 'CUSTOMER', label: 'Khách hàng (Customer)' },
    { value: 'ADMIN', label: 'Quản trị viên (Admin)' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Username */}
        <Input
          label="Tên tài khoản (Username)"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          disabled={!!initialData}
          placeholder="Nhập tên tài khoản..."
        />

        {/* Full Name */}
        <Input
          label="Họ và tên"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          placeholder="Nhập họ và tên..."
        />

        {/* Email */}
        <Input
          label="Địa chỉ Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="email@viettel.vn"
        />

        {/* Phone */}
        <Input
          label="Số điện thoại"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="0987654321"
        />

        {/* Password */}
        <Input
          label={initialData ? "Mật khẩu mới (Để trống nếu giữ nguyên)" : "Mật khẩu"}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
        />

        {/* Birthday */}
        <Input
          label="Ngày sinh"
          name="birthday"
          type="date"
          value={formData.birthday}
          onChange={handleChange}
          placeholder=""
        />

        {/* Gender */}
        <SelectBox
          label="Giới tính"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={genderOptions}
          placeholder=""
        />

        {/* Role */}
        <SelectBox
          label="Vai trò hệ thống"
          name="roleName"
          value={formData.roleName}
          onChange={handleChange}
          options={roleOptions}
          placeholder=""
        />
      </div>

      {/* Account Status */}
      <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-lg border border-slate-800/60">
        <div>
          <p className="text-sm font-bold text-slate-200">Trạng thái tài khoản</p>
          <p className="text-xs text-slate-500">Mở khoá hoặc tạm khoá truy cập của tài khoản này</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            name="enabled"
            checked={formData.enabled}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white" />
        </label>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Cập nhật tài khoản' : 'Tạo tài khoản'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
