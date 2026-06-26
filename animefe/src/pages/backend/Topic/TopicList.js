import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import topicApi from '../../../api/topicApi';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import SearchBox from '../../../components/common/SearchBox';
import Pagination from '../../../components/common/Pagination';
import Title from '../../../components/common/Title';
import { formatDate } from '../../../utils';

const TopicList = () => {
  const [topics, setTopics] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  const navigate = useNavigate();

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await topicApi.getAll();
      setTopics(res || []);
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
    const fil = topics.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFiltered(fil);
    setCurrentPage(1);
  }, [searchQuery, topics]);

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
    if (window.confirm('Bạn có chắc chắn muốn xóa chủ đề này?')) {
      try {
        await topicApi.delete(id);
        load();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const headers = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Tên chủ đề', sortable: true },
    { key: 'createdAt', label: 'Ngày tạo', sortable: true },
    { key: 'actions', label: 'Thao tác' },
  ];

  const renderRow = (topic) => (
    <tr key={topic.id} className="hover:bg-slate-900/40 border-b border-slate-900 transition-colors">
      <td className="px-6 py-4 font-semibold text-slate-400">#{topic.id}</td>
      <td className="px-6 py-4 font-bold text-slate-200">{topic.name}</td>
      <td className="px-6 py-4 text-xs text-slate-500">
        {topic.createdAt ? formatDate(topic.createdAt) : '-'}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/topics/edit/${topic.id}`}
            className="p-1.5 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={() => handleDelete(topic.id)}
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
        <Title subtitle="Quản lý các chủ đề của bài viết tin tức">
          Chủ đề ({filtered.length})
        </Title>
        <Button variant="primary" size="sm" onClick={() => navigate('/admin/topics/create')}>
          Thêm chủ đề
        </Button>
      </div>

      <div className="flex justify-start">
        <SearchBox placeholder="Tìm kiếm chủ đề..." onSearch={setSearchQuery} />
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

export default TopicList;
