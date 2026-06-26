import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import bannerApi from '../../../api/bannerApi';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import SearchBox from '../../../components/common/SearchBox';
import Pagination from '../../../components/common/Pagination';
import Title from '../../../components/common/Title';
import { getImageUrl } from '../../../utils';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
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

  useEffect(() => {
    const fil = banners.filter((b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFiltered(fil);
    setCurrentPage(1);
  }, [searchQuery, banners]);

  const handleSort = (config) => {
    setSortConfig(config);
    const sorted = [...filtered].sort((a, b) => {
      if (a[config.key] < b[config.key]) return config.direction === 'asc' ? -1 : 1;
      if (a[config.key] > b[config.key]) return config.direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFiltered(sorted);
  };

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

  const headers = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'image', label: 'Ảnh' },
    { key: 'title', label: 'Tiêu đề', sortable: true },
    { key: 'link', label: 'Liên kết', sortable: true },
    { key: 'active', label: 'Trạng thái', sortable: true },
    { key: 'actions', label: 'Thao tác' },
  ];

  const renderRow = (banner) => (
    <tr key={banner.id} className="hover:bg-slate-900/40 border-b border-slate-900 transition-colors">
      <td className="px-6 py-4 font-semibold text-slate-400">#{banner.id}</td>
      <td className="px-6 py-4">
        <img src={getImageUrl(banner.image, 'https://placehold.co/100x50?text=No+Image')} alt="Banner" className="w-16 h-8 object-cover rounded border border-slate-800" />
      </td>
      <td className="px-6 py-4 font-bold text-slate-200">{banner.title}</td>
      <td className="px-6 py-4 text-xs font-mono text-slate-500">{banner.link}</td>
      <td className="px-6 py-4">
        {banner.active ? (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">Active</span>
        ) : (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-500 rounded-full">Inactive</span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/banners/edit/${banner.id}`}
            className="p-1.5 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={() => handleDelete(banner.id)}
            className="p-1.5 rounded bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
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

      <Table
        headers={headers}
        data={paginated}
        isLoading={isLoading}
        sortConfig={sortConfig}
        onSort={handleSort}
        renderRow={renderRow}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default BannerList;
