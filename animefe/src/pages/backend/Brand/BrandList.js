import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import brandApi from '../../../api/brandApi';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import SearchBox from '../../../components/common/SearchBox';
import Pagination from '../../../components/common/Pagination';
import Title from '../../../components/common/Title';
import useAuth from '../../../hooks/useAuth';
import { formatDate } from '../../../utils';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  const navigate = useNavigate();

  const loadBrands = async () => {
    setIsLoading(true);
    try {
      const response = await brandApi.getAll();
      setBrands(response || []);
      setFilteredBrands(response || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  // Search filtering
  useEffect(() => {
    const filtered = brands.filter((b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBrands(filtered);
    setCurrentPage(1);
  }, [searchQuery, brands]);

  // Sorting
  const handleSort = (config) => {
    setSortConfig(config);
    const sorted = [...filteredBrands].sort((a, b) => {
      if (a[config.key] < b[config.key]) return config.direction === 'asc' ? -1 : 1;
      if (a[config.key] > b[config.key]) return config.direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredBrands(sorted);
  };

  // Pagination
  const pageSize = 5;
  const totalPages = Math.ceil(filteredBrands.length / pageSize);
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      try {
        await brandApi.delete(id);
        loadBrands();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const headers = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Tên thương hiệu', sortable: true },
    { key: 'createdAt', label: 'Ngày tạo', sortable: true },
    { key: 'actions', label: 'Thao tác' },
  ];

  const renderRow = (brand) => (
    <tr key={brand.id} className="hover:bg-slate-900/40 border-b border-slate-900 transition-colors">
      <td className="px-6 py-4 font-semibold text-slate-400">#{brand.id}</td>
      <td className="px-6 py-4 font-bold text-slate-200">{brand.name}</td>
      <td className="px-6 py-4 text-xs text-slate-500">
        {brand.createdAt ? formatDate(brand.createdAt) : '-'}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/brands/edit/${brand.id}`}
            className="p-1.5 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={() => handleDelete(brand.id)}
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
        <Title subtitle="Quản lý các đối tác sản xuất mô hình figure">
          Thương hiệu ({filteredBrands.length})
        </Title>
        <Button variant="primary" size="sm" onClick={() => navigate('/admin/brands/create')}>
          Thêm thương hiệu
        </Button>
      </div>

      <div className="flex justify-start">
        <SearchBox placeholder="Tìm kiếm thương hiệu..." onSearch={setSearchQuery} />
      </div>

      <Table
        headers={headers}
        data={paginatedBrands}
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

export default BrandList;
