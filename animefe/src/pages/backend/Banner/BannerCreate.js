import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bannerApi from '../../../api/bannerApi';
import BannerForm from '../../../components/backend/BannerForm';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';

const BannerCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await bannerApi.create(formData);
      navigate('/admin/banners');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/banners')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Tạo Banner mới</Title>
      </div>
      <BannerForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default BannerCreate;
