import React from 'react';
import Table from '../common/Table';
import { formatCurrency, formatDate } from '../../utils';

const OrderTable = ({
  orders = [],
  onViewDetails,
  onUpdateStatus,
  isLoading = false,
}) => {
  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
      CONFIRMED: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
      SHIPPING: 'bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20',
      DELIVERED: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
      CANCELLED: 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20',
    };
    const labels = {
      PENDING: 'Chờ duyệt',
      CONFIRMED: 'Đã xác nhận',
      SHIPPING: 'Đang giao hàng',
      DELIVERED: 'Đã giao hàng',
      CANCELLED: 'Đã hủy',
    };
    return (
      <span className={`px-2 py-1 text-xs font-bold rounded-full ${badges[status] || badges.PENDING}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const badges = {
      UNPAID: 'bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20',
      PAID: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
      FAILED: 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20',
      REFUNDED: 'bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20',
    };
    const labels = {
      UNPAID: 'Chưa thanh toán',
      PAID: 'Đã thanh toán',
      FAILED: 'Thất bại',
      REFUNDED: 'Hoàn tiền',
    };
    return (
      <span className={`px-2 py-1 text-xs font-bold rounded-full ${badges[status] || badges.UNPAID}`}>
        {labels[status] || status}
      </span>
    );
  };

  const headers = [
    { key: 'id', label: 'Mã ĐH' },
    { key: 'receiverName', label: 'Khách hàng' },
    { key: 'createdAt', label: 'Ngày đặt' },
    { key: 'totalPrice', label: 'Tổng tiền' },
    { key: 'paymentMethod', label: 'PTTT' },
    { key: 'paymentStatus', label: 'Thanh toán' },
    { key: 'orderStatus', label: 'Trạng thái' },
    { key: 'actions', label: 'Thao tác' },
  ];

  const renderRow = (order) => (
    <tr key={order.orderId} className="hover:bg-slate-900/40 border-b border-slate-900 transition-colors">
      <td className="px-6 py-4 font-bold text-slate-300">#{order.orderId}</td>
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold text-slate-200">{order.receiverName}</p>
          <p className="text-xs text-slate-500">{order.phone}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-xs text-slate-400">
        {order.createdAt ? formatDate(order.createdAt) : '-'}
      </td>
      <td className="px-6 py-4 font-bold text-indigo-400">
        {order.totalPrice ? formatCurrency(order.totalPrice) : '0 đ'}
      </td>
      <td className="px-6 py-4 text-xs font-semibold text-slate-400">{order.paymentMethod}</td>
      <td className="px-6 py-4">{getPaymentBadge(order.paymentStatus)}</td>
      <td className="px-6 py-4">{getStatusBadge(order.orderStatus)}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {/* View detail */}
          <button
            onClick={() => onViewDetails && onViewDetails(order.orderId)}
            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="Xem chi tiết"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          {/* Quick status progress actions */}
          {order.orderStatus === 'PENDING' && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus(order.orderId, 'CONFIRMED')}
              className="px-2 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
            >
              Duyệt đơn
            </button>
          )}
          {order.orderStatus === 'CONFIRMED' && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus(order.orderId, 'SHIPPING')}
              className="px-2 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
            >
              Giao hàng
            </button>
          )}
          {order.orderStatus === 'SHIPPING' && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus(order.orderId, 'DELIVERED')}
              className="px-2 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors"
            >
              Hoàn tất
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <Table
      headers={headers}
      data={orders}
      isLoading={isLoading}
      renderRow={renderRow}
      emptyMessage="Không tìm thấy đơn hàng nào"
    />
  );
};

export default OrderTable;
