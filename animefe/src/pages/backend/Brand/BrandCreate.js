import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import brandApi from '../../../api/brandApi';
import BrandForm from '../../../components/backend/BrandForm';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';

const BrandCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      await brandApi.create(data);
      navigate('/admin/brands');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl text-left">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/brands')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Tạo thương hiệu mới</Title>
      </div>
      <BrandForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default BrandCreate;
