import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userApi from '../../../api/userApi';
import useAuth from '../../../hooks/useAuth';
import Title from '../../../components/common/Title';
import Input from '../../../components/common/Input';
import SelectBox from '../../../components/common/SelectBox';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { getImageUrl } from '../../../utils';

const Profile = () => {
  const { updateProfileState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    gender: 'MALE',
    avatarFile: null,
  });

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.getMyProfile();
        setUserInfo(res);
        setFormData({
          fullName: res.fullName || '',
          phone: res.phone || '',
          address: res.address || '',
          gender: res.gender || 'MALE',
          avatarFile: null,
        });
        setAvatarPreview(res.avatar);
      } catch (err) {
        console.error('Lỗi lấy profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatarFile: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Vì backend updateProfile dùng multipart/form-data
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('gender', formData.gender);
      if (formData.avatarFile) {
        data.append('avatar', formData.avatarFile);
      }

      const res = await userApi.updateProfile(data);
      updateProfileState(res);
      alert('Cập nhật hồ sơ thành công!');
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-20"><Loading text="Đang tải hồ sơ..." /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b border-purple-900/30 pb-4">
        <Title subtitle="Quản lý tài khoản" className="mb-0">Hồ Sơ Cá Nhân</Title>
        <Link to="/change-password">
          <Button variant="outline" className="text-xs">Đổi mật khẩu</Button>
        </Link>
      </div>

      <div className="bg-[#110e2d]/60 border border-purple-900/30 rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10">
          {/* Avatar column */}
          <div className="flex flex-col items-center gap-6 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-purple-900/20 pb-8 md:pb-0 md:pr-8">
            <div className="w-40 h-40 rounded-full border-4 border-slate-800 overflow-hidden bg-slate-900 shadow-xl shadow-purple-900/20 relative group">
              <img
                src={getImageUrl(avatarPreview, 'https://placehold.co/150')}
                alt="Avatar"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Đổi Ảnh</span>
              </div>
            </div>
            
            <div className="w-full relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" type="button" className="w-full justify-center text-xs">
                Chọn ảnh mới
              </Button>
            </div>

            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-slate-200">{userInfo.username}</p>
              <p className="text-xs text-slate-500">{userInfo.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full">
                {userInfo.role}
              </span>
            </div>
          </div>

          {/* Form column */}
          <div className="flex-1 space-y-5">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Thông tin liên hệ</h3>
            
            <Input
              label="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên..."
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập SĐT liên hệ..."
              />
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
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Địa chỉ</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full bg-slate-900 border border-purple-950/40 text-slate-100 rounded-lg text-sm px-4 py-2.5 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 resize-none"
                placeholder="Địa chỉ nhận hàng mặc định..."
              />
            </div>

            <div className="pt-4 border-t border-purple-900/20 mt-6">
              <Button type="submit" variant="primary" className="px-8" isLoading={submitting}>
                Lưu Thay Đổi
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
