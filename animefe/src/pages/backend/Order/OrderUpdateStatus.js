import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderApi from '../../../api/orderApi';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import SelectBox from '../../../components/common/SelectBox';
import Loading from '../../../components/common/Loading';
import { formatCurrency } from '../../../utils';

const OrderUpdateStatus = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await orderApi.getById(id);
        setOrder(res);
        if (res) {
          setStatus(res.orderStatus || '');
        }
      } catch (err) {
        console.error('Lỗi khi tải đơn hàng:', err);
      } finally {
        setIsFetching(false);
      }
    };
    loadDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!status) return;

    setIsLoading(true);
    try {
      // API request body: OrderStatusRequest { orderStatus }
      await orderApi.updateStatus(id, { orderStatus: status });
      alert('Cập nhật trạng thái đơn hàng thành công!');
      navigate('/admin/orders');
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái:', err);
      alert('Cập nhật trạng thái đơn hàng thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading text="Đang tải thông tin đơn hàng..." />;
  if (!order) return <div className="text-slate-400 text-left">Không tìm thấy đơn hàng</div>;

  const statusOptions = [
    { value: 'PENDING', label: 'Chờ duyệt (PENDING)' },
    { value: 'CONFIRMED', label: 'Đã xác nhận (CONFIRMED)' },
    { value: 'SHIPPING', label: 'Đang giao hàng (SHIPPING)' },
    { value: 'DELIVERED', label: 'Đã giao hàng (DELIVERED)' },
    { value: 'CANCELLED', label: 'Đã hủy đơn (CANCELLED)' },
  ];

  return (
    <div className="flex flex-col gap-6 text-left max-w-md">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/orders')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Cập nhật trạng thái đơn hàng</Title>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-4">
        <h3 className="text-base font-bold text-white">Đơn hàng #{order.orderId || order.id}</h3>
        
        <div className="text-sm text-slate-350 flex flex-col gap-1.5 py-2 border-y border-slate-800 my-1">
          <p><span className="text-slate-500 font-semibold">Khách hàng:</span> {order.receiverName}</p>
          <p><span className="text-slate-500 font-semibold">Tổng số tiền:</span> {formatCurrency(order.totalPrice)}</p>
          <p><span className="text-slate-500 font-semibold">Trạng thái hiện tại:</span> <span className="font-bold text-indigo-400">{order.orderStatus}</span></p>
        </div>

        <SelectBox
          label="Chọn trạng thái mới"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={statusOptions}
          placeholder=""
        />

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Cập nhật trạng thái
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrderUpdateStatus;
