import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bannerApi from '../../../api/bannerApi';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { getImageUrl } from '../../../utils';

const BannerShow = () => {
  const { id } = useParams();
  const [banner, setBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await bannerApi.getById(id);
        setBanner(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) return <Loading />;
  if (!banner) return <div className="text-slate-400">Không tìm thấy banner</div>;

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 max-w-lg text-left flex flex-col gap-4">
      <h3 className="text-lg font-bold text-white">Chi tiết Banner</h3>
      <img src={getImageUrl(banner.image, 'https://placehold.co/800x400?text=No+Image')} alt="Banner detail" className="w-full h-40 object-cover rounded border border-slate-800" />
      <div className="flex flex-col gap-2 text-sm text-slate-300 mt-2">
        <p><span className="font-semibold text-slate-500">ID:</span> #{banner.id}</p>
        <p><span className="font-semibold text-slate-500">Tiêu đề:</span> {banner.title}</p>
        <p><span className="font-semibold text-slate-500">Mô tả:</span> {banner.description || 'Không có mô tả'}</p>
        <p><span className="font-semibold text-slate-500">Liên kết (Link):</span> {banner.link}</p>
        <p><span className="font-semibold text-slate-500">Hiển thị:</span> {banner.active ? 'Đang bật' : 'Đang tắt'}</p>
      </div>
      <Button variant="secondary" onClick={() => navigate('/admin/banners')} className="mt-4">
        Trở lại
      </Button>
    </div>
  );
};

export default BannerShow;
