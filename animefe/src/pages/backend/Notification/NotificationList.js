import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationApi from '../../../api/notificationApi';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import SearchBox from '../../../components/common/SearchBox';
import Pagination from '../../../components/common/Pagination';
import Title from '../../../components/common/Title';
import { formatDate } from '../../../utils';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const navigate = useNavigate();

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationApi.getNotifications();
      // API returns list of notifications
      const list = Array.isArray(response) ? response : [];
      setNotifications(list);
      setFilteredNotifications(list);
    } catch (err) {
      console.error('Lỗi khi tải thông báo:', err);
      setNotifications([]);
      setFilteredNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Filter effect
  useEffect(() => {
    let result = Array.isArray(notifications) ? [...notifications] : [];

    if (searchKeyword) {
      result = result.filter((n) =>
        (n.title || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (n.message || '').toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setFilteredNotifications(result);
    setCurrentPage(1);
  }, [searchKeyword, notifications]);

  const totalPages = Math.ceil((filteredNotifications || []).length / pageSize);
  const paginatedNotifications = (filteredNotifications || []).slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Tiêu đề' },
    { key: 'message', label: 'Nội dung thông báo' },
    { key: 'sentAt', label: 'Thời gian gửi' },
  ];

  const renderRow = (n) => (
    <tr key={n.id} className="hover:bg-slate-900/40 border-b border-slate-900 transition-colors text-slate-300">
      <td className="px-6 py-4 font-semibold text-slate-500">#{n.id}</td>
      <td className="px-6 py-4 font-bold text-slate-200">{n.title}</td>
      <td className="px-6 py-4 text-slate-400 text-sm max-w-md truncate">{n.message}</td>
      <td className="px-6 py-4 text-slate-500 font-semibold text-xs">
        {n.createdAt ? formatDate(n.createdAt) : 'Mới đây'}
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center">
        <Title subtitle="Lịch sử thông báo đẩy gửi đến người dùng hệ thống">
          Thông báo Push
        </Title>
        <Button variant="primary" size="sm" onClick={() => navigate('/admin/notifications/send')}>
          Gửi thông báo mới
        </Button>
      </div>

      <div className="bg-slate-900/40 p-4 border border-slate-800/80 rounded-xl max-w-md">
        <SearchBox placeholder="Tìm tiêu đề hoặc nội dung..." onSearch={setSearchKeyword} className="max-w-none" />
      </div>

      <Table
        headers={headers}
        data={paginatedNotifications}
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

export default NotificationList;
