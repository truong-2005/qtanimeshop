import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import orderApi from '../../../api/orderApi';
import Title from '../../../components/common/Title';
import Pagination from '../../../components/common/Pagination';
import Loading from '../../../components/common/Loading';
import { formatCurrency, formatDate } from '../../../utils';

const statusMap = {
  PENDING: { label: 'Chờ xác nhận', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  PROCESSING: { label: 'Đang xử lý', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  SHIPPING: { label: 'Đang giao hàng', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
  DELIVERED: { label: 'Đã giao', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  CANCELLED: { label: 'Đã hủy', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' }
};

const MyOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 0 });

  const page = parseInt(searchParams.get('page') || '0', 10);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await orderApi.getMyOrders({ page, size: 10 });
        setOrders(res.content || []);
        setPageData({ page: res.number, totalPages: res.totalPages });
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <Title subtitle="Lịch sử mua hàng">Đơn Hàng Của Tôi</Title>

      {loading ? (
        <div className="py-20"><Loading text="Đang tải danh sách đơn hàng..." /></div>
      ) : orders.length === 0 ? (
        <div className="bg-[#0f0e24]/40 border border-purple-900/20 rounded-2xl p-10 text-center shadow-xl mt-8">
          <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-slate-400">Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-[#110e2d]/60 border border-purple-900/30 rounded-2xl overflow-hidden shadow-xl hover:border-purple-500/30 transition-all">
              <div className="bg-slate-900/50 px-6 py-4 border-b border-purple-900/20 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-200">Mã ĐH: #{order.id}</span>
                  <span className="text-sm text-slate-400">{formatDate(order.createdAt, { hour: undefined, minute: undefined })}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${statusMap[order.orderStatus]?.color || 'text-slate-400 border-slate-700'}`}>
                    {statusMap[order.orderStatus]?.label || order.orderStatus}
                  </span>
                  <Link to={`/my-orders/${order.id}`} className="text-sm font-bold text-indigo-400 hover:text-indigo-300">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
              <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1 text-sm text-slate-300 space-y-2">
                  <p><span className="text-slate-500 w-24 inline-block">Người nhận:</span> <span className="font-medium text-slate-200">{order.receiverName}</span></p>
                  <p><span className="text-slate-500 w-24 inline-block">Điện thoại:</span> <span className="font-medium text-slate-200">{order.phone}</span></p>
                  <p><span className="text-slate-500 w-24 inline-block">Địa chỉ:</span> <span className="font-medium text-slate-200">{order.address}</span></p>
                </div>
                <div className="text-right border-t md:border-t-0 md:border-l border-purple-900/20 pt-4 md:pt-0 md:pl-6">
                  <p className="text-slate-500 text-sm mb-1">Tổng tiền</p>
                  <p className="text-2xl font-black text-purple-400">{formatCurrency(order.totalAmount)}</p>
                  <p className="text-xs text-slate-500 mt-2">Thanh toán: <span className="font-medium text-slate-300">{order.paymentMethod}</span></p>
                </div>
              </div>
            </div>
          ))}

          {pageData.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination currentPage={pageData.page} totalPages={pageData.totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
