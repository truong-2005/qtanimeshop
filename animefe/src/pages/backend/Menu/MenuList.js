import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import menuApi from '../../../api/menuApi';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import SearchBox from '../../../components/common/SearchBox';
import Pagination from '../../../components/common/Pagination';
import Title from '../../../components/common/Title';

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const navigate = useNavigate();

  const loadMenus = async () => {
    setIsLoading(true);
    try {
      const response = await menuApi.getAll();
      setMenus(response || []);
      setFilteredMenus(response || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách menu:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  // Filter effect
  useEffect(() => {
    let result = [...menus];

    if (searchKeyword) {
      result = result.filter((m) =>
        (m.name || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (m.link || '').toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setFilteredMenus(result);
    setCurrentPage(1);
  }, [searchKeyword, menus]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa menu này?')) {
      try {
        await menuApi.delete(id);
        loadMenus();
      } catch (err) {
        console.error('Lỗi khi xóa menu:', err);
      }
    }
  };

  const totalPages = Math.ceil(filteredMenus.length / pageSize);
  const paginatedMenus = filteredMenus.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Tên Menu' },
    { key: 'link', label: 'Liên kết (Link)' },
    { key: 'sortOrder', label: 'Thứ tự sắp xếp' },
    { key: 'actions', label: 'Thao tác' },
  ];

  const renderRow = (menu) => (
    <tr key={menu.id} className="hover:bg-slate-900/40 border-b border-slate-900 transition-colors text-slate-300">
      <td className="px-6 py-4 font-semibold text-slate-500">#{menu.id}</td>
      <td className="px-6 py-4">
        <Link to={`/admin/menus/show/${menu.id}`} className="font-bold text-slate-200 hover:text-indigo-400 transition-colors">
          {menu.name}
        </Link>
      </td>
      <td className="px-6 py-4 font-mono text-xs text-slate-400">{menu.link}</td>
      <td className="px-6 py-4 font-semibold text-slate-400">{menu.sortOrder || 0}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/menus/edit/${menu.id}`}
            className="p-1.5 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors"
            title="Chỉnh sửa"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={() => handleDelete(menu.id)}
            className="p-1.5 rounded bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors"
            title="Xóa"
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
    <div className="flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center">
        <Title subtitle="Quản lý cấu trúc danh mục menu điều hướng website">
          Menu điều hướng
        </Title>
        <Button variant="primary" size="sm" onClick={() => navigate('/admin/menus/create')}>
          Thêm Menu
        </Button>
      </div>

      <div className="bg-slate-900/40 p-4 border border-slate-800/80 rounded-xl max-w-md">
        <SearchBox placeholder="Tìm tên menu..." onSearch={setSearchKeyword} className="max-w-none" />
      </div>

      <Table
        headers={headers}
        data={paginatedMenus}
        isLoading={isLoading}
        renderRow={renderRow}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default MenuList;
