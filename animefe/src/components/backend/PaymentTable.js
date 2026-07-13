import React from 'react';
import Table from '../common/Table';
import { formatCurrency } from '../../utils';

const PaymentTable = ({ payments = [], isLoading = false }) => {
  const getStatusBadge = (status) => {
    const badges = {
      PAID: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
      UNPAID: 'bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20',
      FAILED: 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20',
      REFUNDED: 'bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20',
    };
    const labels = {
      PAID: 'Đã nhận tiền',
      UNPAID: 'Chưa thanh toán',
      FAILED: 'Thất bại',
      REFUNDED: 'Đã hoàn tiền',
    };
    return (
      <span className={`px-2 py-1 text-xs font-bold rounded-full ${badges[status] || badges.UNPAID}`}>
        {labels[status] || status}
      </span>
    );
  };

  const headers = [
    { key: 'paymentId', label: 'Mã GD' },
    { key: 'paymentMethod', label: 'Phương thức' },
    { key: 'transactionCode', label: 'Mã tham chiếu (VNPAY)' },
    { key: 'amount', label: 'Số tiền thanh toán' },
    { key: 'paymentStatus', label: 'Trạng thái giao dịch' },
  ];

  const renderRow = (pay) => (
    <tr key={pay.paymentId} className="hover:bg-slate-900/40 border-b border-slate-900 transition-colors">
      <td className="px-6 py-4 font-bold text-slate-300">#{pay.paymentId}</td>
      <td className="px-6 py-4 text-xs font-bold text-slate-200 uppercase tracking-wide">
        {pay.paymentMethod}
      </td>
      <td className="px-6 py-4 font-mono text-xs text-slate-500">
        {pay.transactionCode || 'N/A'}
      </td>
      <td className="px-6 py-4 font-bold text-indigo-400">
        {pay.amount ? formatCurrency(pay.amount) : '0 đ'}
      </td>
      <td className="px-6 py-4">{getStatusBadge(pay.paymentStatus)}</td>
    </tr>
  );

  return (
    <Table
      headers={headers}
      data={payments}
      isLoading={isLoading}
      renderRow={renderRow}
      emptyMessage="Chưa ghi nhận giao dịch thanh toán nào"
    />
  );
};

export default PaymentTable;
