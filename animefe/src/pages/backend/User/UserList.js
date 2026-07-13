import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import userApi from '../../../api/userApi';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import SearchBox from '../../../components/common/SearchBox';
import Pagination from '../../../components/common/Pagination';
import Title from '../../../components/common/Title';
import { getImageUrl } from '../../../utils';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  const navigate = useNavigate();

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await userApi.getAll();
      setUsers(res || []);
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
    const fil = users.filter((u) =>
      (u.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFiltered(fil);
    setCurrentPage(1);
  }, [searchQuery, users]);

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
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      try {
        await userApi.delete(id);
        load();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xóa thành viên');
      }
    }
  };

  const headers = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'fullName', label: 'Họ tên', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Vai trò' },
    { key: 'avatar', label: 'Avatar' },
    { key: 'actions', label: 'Thao tác' },
  ];

  const renderRow = (user) => (
    <tr key={user.id} className="hover:bg-slate-900/40 border-b border-slate-900 transition-colors">
      <td className="px-6 py-4 font-semibold text-slate-400">#{user.id}</td>
      <td className="px-6 py-4 font-bold text-slate-300">{user.username}</td>
      <td className="px-6 py-4 font-semibold text-slate-200">{user.fullName}</td>
      <td className="px-6 py-4 text-xs text-slate-400">{user.email}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
          user.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400'
        }`}>
          {user.role || 'CUSTOMER'}
        </span>
      </td>
      <td className="px-6 py-4">
        {user.avatar ? (
          <img src={getImageUrl(user.avatar)} alt={user.username} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
            {user.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/users/show/${user.id}`}
            className="p-1.5 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
          <Link
            to={`/admin/users/edit/${user.id}`}
            className="p-1.5 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={() => handleDelete(user.id)}
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
        <Title subtitle="Quản lý danh sách thành viên và tài khoản quản trị">
          Thành viên ({filtered.length})
        </Title>
        <Button variant="primary" size="sm" onClick={() => navigate('/admin/users/create')}>
          Thêm thành viên
        </Button>
      </div>

      <div className="flex justify-start">
        <SearchBox placeholder="Tìm kiếm thành viên..." onSearch={setSearchQuery} />
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

export default UserList;
