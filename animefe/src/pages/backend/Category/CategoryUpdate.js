import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import categoryApi from '../../../api/categoryApi';
import CategoryForm from '../../../components/backend/CategoryForm';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

const CategoryUpdate = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await categoryApi.getById(id);
        setCategory(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      await categoryApi.update(id, data);
      navigate('/admin/categories');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading text="Đang tải dữ liệu..." />;

  return (
    <div className="flex flex-col gap-6 max-w-xl text-left">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/categories')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Cập nhật danh mục</Title>
      </div>
      <CategoryForm initialData={category} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CategoryUpdate;
