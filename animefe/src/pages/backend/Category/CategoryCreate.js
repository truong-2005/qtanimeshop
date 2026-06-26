import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryApi from '../../../api/categoryApi';
import CategoryForm from '../../../components/backend/CategoryForm';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';

const CategoryCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      await categoryApi.create(data);
      navigate('/admin/categories');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl text-left">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/categories')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Tạo danh mục mới</Title>
      </div>
      <CategoryForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CategoryCreate;
