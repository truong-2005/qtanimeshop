import React, { useState, useEffect } from 'react';
import paymentApi from '../../../api/paymentApi';
import PaymentTable from '../../../components/backend/PaymentTable';
import SearchBox from '../../../components/common/SearchBox';
import SelectBox from '../../../components/common/SelectBox';
import Pagination from '../../../components/common/Pagination';
import Title from '../../../components/common/Title';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await paymentApi.getAll();
      setPayments(res || []);
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
    let fil = payments.filter(
      (p) =>
        (p.transactionCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.paymentMethod || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (statusFilter) {
      fil = fil.filter((p) => p.status === statusFilter);
    }
    setFiltered(fil);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, payments]);

  const pageSize = 5;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const statusOptions = [
    { value: 'UNPAID', label: 'Chưa thanh toán' },
    { value: 'PAID', label: 'Đã nhận tiền' },
    { value: 'REFUNDED', label: 'Đã hoàn tiền' },
    { value: 'FAILED', label: 'Thất bại' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Title subtitle="Nhật ký các giao dịch thanh toán qua cổng điện tử hoặc COD">
        Danh sách giao dịch
      </Title>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/40 p-4 border border-slate-800/80 rounded-xl">
        <div className="md:col-span-2">
          <SearchBox placeholder="Tìm kiếm phương thức hoặc mã GD..." onSearch={setSearchQuery} className="max-w-none" />
        </div>
        <SelectBox
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
          placeholder="Lọc trạng thái"
        />
      </div>

      <PaymentTable payments={paginated} isLoading={isLoading} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PaymentList;
