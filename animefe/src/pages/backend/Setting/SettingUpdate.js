import React, { useState, useEffect } from 'react';
import settingApi from '../../../api/settingApi';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Loading from '../../../components/common/Loading';

const SettingUpdate = () => {
  const [formData, setFormData] = useState({
    siteName: '',
    email: '',
    hotline: '',
    address: '',
    slogan: ''
  });
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await settingApi.getSetting();
        if (res) {
          setFormData({
            siteName: res.siteName || '',
            email: res.email || '',
            hotline: res.hotline || '',
            address: res.address || '',
            slogan: res.slogan || ''
          });
        }
      } catch (err) {
        console.error('Lỗi tải cấu hình:', err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchSetting();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await settingApi.updateSetting(formData);
      alert('Cập nhật cấu hình website thành công!');
    } catch (err) {
      console.error('Lỗi khi cập nhật cấu hình:', err);
      alert('Đã xảy ra lỗi khi cập nhật cấu hình.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading text="Đang tải cấu hình hệ thống..." />;

  return (
    <div className="flex flex-col gap-6 text-left max-w-2xl">
      <div className="flex items-center gap-3">
        <Title size="sm">Cấu hình chung Website</Title>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-5">
        <Input
          label="Tên Website (Site Name)"
          name="siteName"
          value={formData.siteName}
          onChange={handleChange}
          placeholder="Ví dụ: AnimeStore"
          required
        />
        <Input
          label="Slogan"
          name="slogan"
          value={formData.slogan}
          onChange={handleChange}
          placeholder="Ví dụ: Mô hình chính hãng Nhật Bản"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Email liên hệ"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ví dụ: contact@animestore.vn"
          />
          <Input
            label="Hotline"
            name="hotline"
            value={formData.hotline}
            onChange={handleChange}
            placeholder="Ví dụ: 1900 xxxx"
          />
        </div>
        <Input
          label="Địa chỉ cửa hàng"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Ví dụ: 123 Đường ABC, Quận XYZ, TP.HCM"
        />

        <div className="flex justify-end pt-4 border-t border-slate-800 mt-2">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingUpdate;
