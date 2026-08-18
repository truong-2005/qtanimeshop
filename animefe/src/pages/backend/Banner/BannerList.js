import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bannerApi from '../../../api/bannerApi';
import Button from '../../../components/common/Button';
import SearchBox from '../../../components/common/SearchBox';
import Pagination from '../../../components/common/Pagination';
import Title from '../../../components/common/Title';
import Loading from '../../../components/common/Loading';
import BannerCard from '../../../components/backend/BannerCard';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await bannerApi.getAll();
      setBanners(res || []);
      setFiltered(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter & search
  useEffect(() => {
    const fil = banners.filter((b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFiltered(fil);
    setCurrentPage(1);
  }, [searchQuery, banners]);

  const pageSize = 5;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      try {
        await bannerApi.delete(id);
        load();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const renderCards = (items) => (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((banner) => (
        <BannerCard
          key={banner.id}
          banner={banner}
          onEdit={() => navigate(`/admin/banners/edit/${banner.id}`)}
          onDelete={() => handleDelete(banner.id)}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Title subtitle="Quản lý các banner quảng cáo trên slider">
          Banners ({filtered.length})
        </Title>
        <Button variant="primary" size="sm" onClick={() => navigate('/admin/banners/create')}>
          Thêm Banner
        </Button>
      </div>

      <div className="flex justify-start">
        <SearchBox placeholder="Tìm kiếm banner..." onSearch={setSearchQuery} />
      </div>

      {isLoading ? <Loading /> : renderCards(paginated)}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default BannerList;
