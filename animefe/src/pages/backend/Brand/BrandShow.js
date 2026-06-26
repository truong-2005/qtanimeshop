import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import brandApi from '../../../api/brandApi';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { formatDate } from '../../../utils';

const BrandShow = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await brandApi.getById(id);
        setBrand(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) return <Loading />;
  if (!brand) return <div className="text-slate-400">Không tìm thấy dữ liệu</div>;

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 max-w-md text-left flex flex-col gap-4">
      <h3 className="text-lg font-bold text-white">Chi tiết thương hiệu</h3>
      <div className="flex flex-col gap-2 text-sm text-slate-300">
        <p><span className="font-semibold text-slate-500">ID:</span> #{brand.id}</p>
        <p><span className="font-semibold text-slate-500">Tên:</span> {brand.name}</p>
        <p><span className="font-semibold text-slate-500">Ngày tạo:</span> {formatDate(brand.createdAt)}</p>
      </div>
      <Button variant="secondary" onClick={() => navigate('/admin/brands')} className="mt-4">
        Trở lại
      </Button>
    </div>
  );
};

export default BrandShow;
