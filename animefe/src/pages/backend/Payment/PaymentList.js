import React, { useState, useEffect } from 'react';
import paymentApi from '../../../api/paymentApi';
import PaymentTable from '../../../components/backend/PaymentTable';
import SearchBox from '../../../components/common/SearchBox';
import Pagination from '../../../components/common/Pagination';
import Title from '../../../components/common/Title';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
    const fil = payments.filter(
      (p) =>
        (p.transactionCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.paymentMethod || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFiltered(fil);
    setCurrentPage(1);
  }, [searchQuery, payments]);

  const pageSize = 5;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-6">
      <Title subtitle="Nhật ký các giao dịch thanh toán qua cổng điện tử hoặc COD">
        Danh sách giao dịch
      </Title>

      <div className="flex justify-start">
        <SearchBox placeholder="Tìm kiếm phương thức hoặc mã GD..." onSearch={setSearchQuery} />
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
