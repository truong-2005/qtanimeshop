import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderApi from '../../../api/orderApi';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { formatCurrency } from '../../../utils';

const OrderShow = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await orderApi.getById(id);
        setOrder(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) return <Loading />;
  if (!order) return <div className="text-slate-400">Không tìm thấy đơn hàng</div>;

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/orders')} className="px-3 py-2">
          ← Danh sách đơn hàng
        </Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
        {/* Buyer Info */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Thông tin giao nhận</h3>
          <p><span className="font-semibold text-slate-500">Mã Đơn hàng:</span> #{order.orderId || order.id}</p>
          <p><span className="font-semibold text-slate-500">Người nhận:</span> {order.receiverName}</p>
          <p><span className="font-semibold text-slate-500">Điện thoại:</span> {order.phone}</p>
          <p><span className="font-semibold text-slate-500">Địa chỉ nhận:</span> {order.address}</p>
          <p><span className="font-semibold text-slate-500">Phương thức thanh toán:</span> {order.paymentMethod}</p>
          <p><span className="font-semibold text-slate-500">Trạng thái thanh toán:</span> {order.paymentStatus}</p>
          <p><span className="font-semibold text-slate-500">Trạng thái đơn:</span> {order.orderStatus}</p>
        </div>

        {/* Order Items */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Chi tiết sản phẩm</h3>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[200px] pr-2">
            {order.orderItems?.map((item) => (
              <div key={item.id} className="flex justify-between items-center gap-4 text-xs bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                <span className="font-bold text-slate-200 line-clamp-1 flex-1">{item.product?.name}</span>
                <span className="text-slate-500 font-medium">x{item.quantity}</span>
                <span className="font-bold text-indigo-400">{formatCurrency(item.price)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-3 flex justify-between items-center mt-2">
            <span className="text-sm font-bold text-slate-400">Tổng thanh toán:</span>
            <span className="text-lg font-black text-indigo-400">
              {formatCurrency(order.totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderShow;
