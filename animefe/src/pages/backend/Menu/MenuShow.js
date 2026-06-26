import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import menuApi from '../../../api/menuApi';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

const MenuShow = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const detail = await menuApi.getById(id);
        setMenu(detail);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết menu:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (isLoading) return <Loading text="Đang tải thông tin menu..." />;
  if (!menu) return <div className="text-slate-400 text-left">Không tìm thấy menu</div>;

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 max-w-xl text-left flex flex-col gap-5 shadow-xl">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-white">Chi tiết Menu #{menu.id}</h3>
      </div>

      <div className="flex flex-col gap-3 text-sm text-slate-300">
        <p>
          <span className="font-semibold text-slate-500 w-32 inline-block">Tên Menu:</span>
          <span className="text-white font-bold text-base">{menu.name}</span>
        </p>
        <p>
          <span className="font-semibold text-slate-500 w-32 inline-block">Liên kết (Link):</span>
          <span className="text-indigo-400 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-850 text-xs">{menu.link}</span>
        </p>
        <p>
          <span className="font-semibold text-slate-500 w-32 inline-block">Thứ tự (sortOrder):</span>
          <span className="text-slate-200 font-bold">{menu.sortOrder || 0}</span>
        </p>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-800 pt-4 mt-2">
        <Button variant="secondary" onClick={() => navigate('/admin/menus')}>
          Quay lại danh sách
        </Button>
        <Button variant="primary" onClick={() => navigate(`/admin/menus/edit/${menu.id}`)}>
          Chỉnh sửa
        </Button>
      </div>
    </div>
  );
};

export default MenuShow;
