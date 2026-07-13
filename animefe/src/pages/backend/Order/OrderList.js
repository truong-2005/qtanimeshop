import React, { useState, useEffect } from 'react';
import orderApi from '../../../api/orderApi';
import OrderTable from '../../../components/backend/OrderTable';
import SearchBox from '../../../components/common/SearchBox';
import SelectBox from '../../../components/common/SelectBox';
import Pagination from '../../../components/common/Pagination';
import Title from '../../../components/common/Title';
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await orderApi.getAll();
      setOrders(res || []);
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

  // Filter orders
  useEffect(() => {
    let fil = orders;
    if (searchQuery) {
      fil = fil.filter(
        (o) =>
          (o.receiverName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (o.phone || '').includes(searchQuery)
      );
    }
    if (statusFilter) {
      fil = fil.filter((o) => o.orderStatus === statusFilter);
    }
    if (paymentFilter) {
      fil = fil.filter((o) => o.paymentStatus === paymentFilter);
    }
    setFiltered(fil);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, paymentFilter, orders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (window.confirm(`Xác nhận chuyển trạng thái đơn hàng sang ${newStatus}?`)) {
      try {
        await orderApi.updateStatus(orderId, { orderStatus: newStatus });
        load();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    if (window.confirm(`Xác nhận cập nhật thanh toán đơn hàng này?`)) {
      try {
        await orderApi.updatePaymentStatus(orderId, { paymentStatus: newStatus });
        load();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const pageSize = 5;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const statusOptions = [
    { value: 'PENDING', label: 'Chờ duyệt (PENDING)' },
    { value: 'CONFIRMED', label: 'Đã xác nhận (CONFIRMED)' },
    { value: 'SHIPPING', label: 'Đang giao (SHIPPING)' },
    { value: 'DELIVERED', label: 'Đã giao (DELIVERED)' },
    { value: 'CANCELLED', label: 'Đã hủy (CANCELLED)' },
  ];

  const paymentOptions = [
    { value: 'UNPAID', label: 'Chưa thanh toán' },
    { value: 'PAID', label: 'Đã nhận tiền' },
    { value: 'REFUNDED', label: 'Đã hoàn tiền' },
    { value: 'FAILED', label: 'Thất bại' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Title subtitle="Quản lý thông tin đơn đặt hàng từ khách hàng">
        Đơn hàng ({filtered.length})
      </Title>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/40 p-4 border border-slate-800/80 rounded-xl">
        <div className="md:col-span-2">
          <SearchBox placeholder="Tìm khách hàng hoặc SĐT..." onSearch={setSearchQuery} className="max-w-none" />
        </div>
        <SelectBox
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
          placeholder="Lọc Trạng thái đơn"
        />
        <SelectBox
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          options={paymentOptions}
          placeholder="Lọc Thanh toán"
        />
      </div>

      <OrderTable
        orders={paginated}
        isLoading={isLoading}
        onViewDetails={(id) => navigate(`/admin/orders/show/${id}`)}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default OrderList;
