import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderApi from '../../../api/orderApi';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import vnPayApi from '../../../api/vnPayApi';
import { formatCurrency, formatDate } from '../../../utils';

const statusMap = {
  PENDING: { label: 'Chờ xác nhận', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', step: 1 },
  CONFIRMED: { label: 'Đã xác nhận', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', step: 2 },
  SHIPPING: { label: 'Đang giao hàng', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', step: 3 },
  DELIVERED: { label: 'Đã giao', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', step: 4 },
  CANCELLED: { label: 'Đã hủy', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', step: -1 }
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderApi.getMyOrderDetail(id);
        setOrder(res);
      } catch (err) {
        console.error('Failed to fetch order detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        await orderApi.cancelOrder(id);
        alert('Hủy đơn hàng thành công');
        const res = await orderApi.getMyOrderDetail(id);
        setOrder(res);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng');
      }
    }
  };

  const handleRetryPayment = async () => {
    try {
      setLoading(true);
      const paymentRes = await vnPayApi.createPayment({
        amount: order.totalPrice,
        orderId: order.orderId || order.id
      });
      
      const paymentUrl = paymentRes.paymentUrl || paymentRes.message;
      if (paymentUrl && paymentUrl.startsWith('http')) {
        window.location.href = paymentUrl;
      } else {
        alert('Lỗi tạo thanh toán VNPAY');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi tạo thanh toán mới');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-20"><Loading text="Đang tải chi tiết đơn hàng..." /></div>;
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Title subtitle="Lỗi">Không tìm thấy đơn hàng</Title>
        <Link to="/my-orders"><Button variant="outline">Quay lại danh sách</Button></Link>
      </div>
    );
  }

  const currentStep = statusMap[order.orderStatus]?.step || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/my-orders" className="text-slate-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <Title subtitle="Chi tiết đơn hàng" className="mb-0">Đơn hàng #{order.id}</Title>
      </div>

      <div className="bg-[#110e2d]/60 border border-purple-900/30 rounded-2xl p-8 shadow-xl mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-purple-900/20 pb-6 mb-6">
          <div>
            <p className="text-slate-400 text-sm">Ngày đặt: <span className="text-slate-200 font-medium">{formatDate(order.createdAt)}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded-full border ${statusMap[order.orderStatus]?.color || 'text-slate-400 border-slate-700'}`}>
              {statusMap[order.orderStatus]?.label || order.orderStatus}
            </span>
            {order.orderStatus === 'PENDING' && (
              <Button variant="danger" className="text-xs" onClick={handleCancelOrder}>
                Hủy đơn
              </Button>
            )}
          </div>
        </div>

        {/* Status Stepper */}
        {order.orderStatus !== 'CANCELLED' && (
          <div className="relative flex justify-between items-center mb-12 mt-8 px-4 sm:px-12">
            <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-1 bg-slate-800 rounded-full z-0"></div>
            <div className={`absolute left-[10%] top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full z-0 transition-all duration-500`} style={{ width: `${((currentStep - 1) / 3) * 80}%` }}></div>
            
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${currentStep >= step ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                  {currentStep > step ? '✓' : step}
                </div>
                <span className={`absolute top-10 text-xs font-bold whitespace-nowrap ${currentStep >= step ? 'text-indigo-300' : 'text-slate-600'}`}>
                  {step === 1 ? 'Xác nhận' : step === 2 ? 'Xử lý' : step === 3 ? 'Giao hàng' : 'Đã giao'}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-purple-900/20 pt-8 mt-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider mb-4">Thông tin nhận hàng</h3>
            <div className="space-y-3 text-sm text-slate-300 bg-slate-900/50 p-5 rounded-xl border border-purple-900/10">
              <p><span className="text-slate-500 inline-block w-24">Người nhận:</span> <span className="font-medium text-slate-200">{order.receiverName}</span></p>
              <p><span className="text-slate-500 inline-block w-24">Điện thoại:</span> <span className="font-medium text-slate-200">{order.phone}</span></p>
              <p><span className="text-slate-500 inline-block w-24">Địa chỉ:</span> <span className="font-medium text-slate-200 leading-relaxed">{order.address}</span></p>
              {order.note && (
                <p><span className="text-slate-500 inline-block w-24">Ghi chú:</span> <span className="font-medium text-amber-200/80">{order.note}</span></p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider mb-4">Phương thức thanh toán</h3>
            <div className="space-y-3 text-sm text-slate-300 bg-slate-900/50 p-5 rounded-xl border border-purple-900/10 h-[calc(100%-2rem)]">
              <p className="font-medium text-indigo-300 text-lg mb-2">{order.paymentMethod}</p>
              <div className="text-slate-500">
                {order.paymentMethod === 'COD' 
                  ? <p>Thanh toán bằng tiền mặt khi nhận hàng.</p>
                  : (
                    <div>
                      <p>Thanh toán qua cổng VNPAY.</p>
                      <p className="mt-1">
                        Trạng thái:{' '}
                        <span className={order.paymentStatus === 'PAID' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                          {order.paymentStatus === 'PAID' ? 'Đã nhận tiền' : 'Chưa thanh toán'}
                        </span>
                      </p>
                      {order.paymentStatus !== 'PAID' && order.orderStatus === 'PENDING' && (
                        <Button variant="primary" className="mt-4 w-full justify-center" onClick={handleRetryPayment}>
                          Thanh toán lại
                        </Button>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#110e2d]/60 border border-purple-900/30 rounded-2xl p-8 shadow-xl">
        <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider mb-6 border-b border-purple-900/20 pb-4">Sản phẩm đã đặt</h3>
        <div className="space-y-6">
          {order.orderDetails?.map(item => (
            <div key={item.id} className="flex gap-4 p-4 bg-slate-900/40 rounded-xl border border-purple-900/10 hover:border-purple-500/20 transition-colors">
              <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-950">
                <img src={item.thumbnail} alt={item.productName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <Link to={`/product/${item.productId}`} className="font-bold text-slate-200 hover:text-purple-400 transition-colors text-base line-clamp-2">
                  {item.productName}
                </Link>
                <div className="flex justify-between items-end mt-2">
                  <div className="text-sm">
                    <p className="text-slate-500 mb-1">Đơn giá: <span className="text-indigo-400 font-bold">{formatCurrency(item.price)}</span></p>
                    <p className="text-slate-500">Số lượng: <span className="text-slate-200 font-bold">{item.quantity}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-xs mb-1">Thành tiền</p>
                    <p className="text-lg font-black text-purple-400">{formatCurrency(item.totalPrice)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-8 border-t border-purple-900/20 pt-6">
          <div className="w-full md:w-1/2 space-y-3">
             <div className="flex justify-between text-sm text-slate-400">
                <span>Tạm tính</span>
                <span>{formatCurrency(order.totalPrice || 0)}</span>
             </div>
             <div className="flex justify-between text-sm text-slate-400">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
             </div>
             <div className="flex justify-between font-black text-2xl text-emerald-400 mt-4 pt-4 border-t border-purple-900/20">
                <span>Tổng cộng</span>
                <span>{formatCurrency(order.totalPrice || 0)}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
