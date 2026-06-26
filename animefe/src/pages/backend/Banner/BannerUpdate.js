import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bannerApi from '../../../api/bannerApi';
import BannerForm from '../../../components/backend/BannerForm';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

const BannerUpdate = () => {
  const { id } = useParams();
  const [banner, setBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await bannerApi.getById(id);
        setBanner(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await bannerApi.update(id, formData);
      navigate('/admin/banners');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading text="Đang tải dữ liệu..." />;

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/banners')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Cập nhật Banner</Title>
      </div>
      <BannerForm initialData={banner} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default BannerUpdate;
