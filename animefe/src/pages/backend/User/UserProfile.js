import React, { useState, useEffect } from 'react';
import userApi from '../../../api/userApi';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import SelectBox from '../../../components/common/SelectBox';
import Loading from '../../../components/common/Loading';
import useAuth from '../../../hooks/useAuth';

const UserProfile = () => {
  const { updateAdminProfileState } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: 'OTHER',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await userApi.getMyProfile();
        setProfile(res);
        setFormData({
          fullName: res.fullName || '',
          phone: res.phone || '',
          gender: res.gender || 'OTHER',
        });
        if (res.avatar) setAvatarPreview(res.avatar);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetch();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('phone', formData.phone);
    data.append('gender', formData.gender);
    if (avatarFile) {
      data.append('avatar', avatarFile);
    }

    try {
      const res = await userApi.updateProfile(data);
      updateAdminProfileState(res);
      alert('Cập nhật trang cá nhân thành công!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isFetching) return <Loading />;

  return (
    <div className="flex flex-col gap-6 text-left max-w-2xl">
      <Title subtitle="Quản lý thông tin hồ sơ cá nhân quản trị viên">Thông tin cá nhân</Title>
      
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 pb-4 border-b border-slate-800">
          <div className="relative w-24 h-24 rounded-full border-2 border-indigo-500 overflow-hidden bg-slate-950 flex items-center justify-center font-bold text-white text-3xl">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              'A'
            )}
          </div>
          <label className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow cursor-pointer transition-colors">
            Thay đổi ảnh đại diện
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Tên tài khoản (Không thể sửa)" value={profile.username} disabled />
          <Input label="Địa chỉ Email (Không thể sửa)" value={profile.email} disabled />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleChange} />
          <Input label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <SelectBox
          label="Giới tính"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={[
            { value: 'MALE', label: 'Nam' },
            { value: 'FEMALE', label: 'Nữ' },
            { value: 'OTHER', label: 'Khác' },
          ]}
        />

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <Button type="submit" variant="primary" isLoading={isUpdating}>Lưu thay đổi</Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
