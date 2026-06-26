import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import categoryApi from '../../../api/categoryApi';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { formatDate } from '../../../utils';

const CategoryShow = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await categoryApi.getById(id);
        setCategory(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) return <Loading />;
  if (!category) return <div className="text-slate-400">Không tìm thấy danh mục</div>;

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 max-w-md text-left flex flex-col gap-4">
      <h3 className="text-lg font-bold text-white">Chi tiết danh mục</h3>
      <div className="flex flex-col gap-2 text-sm text-slate-300">
        <p><span className="font-semibold text-slate-500">ID:</span> #{category.id}</p>
        <p><span className="font-semibold text-slate-500">Tên danh mục:</span> {category.name}</p>
        <p><span className="font-semibold text-slate-500">Ngày tạo:</span> {formatDate(category.createdAt)}</p>
      </div>
      <Button variant="secondary" onClick={() => navigate('/admin/categories')} className="mt-4">
        Trở lại
      </Button>
    </div>
  );
};

export default CategoryShow;
