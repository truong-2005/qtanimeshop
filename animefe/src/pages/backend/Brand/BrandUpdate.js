import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import brandApi from '../../../api/brandApi';
import BrandForm from '../../../components/backend/BrandForm';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

const BrandUpdate = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await brandApi.getById(id);
        setBrand(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchBrand();
  }, [id]);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      await brandApi.update(id, data);
      navigate('/admin/brands');
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
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/brands')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Cập nhật thương hiệu</Title>
      </div>
      <BrandForm initialData={brand} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default BrandUpdate;
