import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paymentApi from '../../../api/paymentApi';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { formatCurrency } from '../../../utils';

const PaymentShow = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const detail = await paymentApi.getById(id);
        setPayment(detail);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết giao dịch:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (isLoading) return <Loading text="Đang tải thông tin giao dịch..." />;
  if (!payment) return <div className="text-slate-400 text-left">Không tìm thấy giao dịch thanh toán</div>;

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 max-w-xl text-left flex flex-col gap-5 shadow-xl">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-white">Chi tiết giao dịch #{payment.paymentId || payment.id}</h3>
        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
          payment.paymentStatus === 'PAID' 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : payment.paymentStatus === 'FAILED'
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }`}>
          {payment.paymentStatus || 'UNPAID'}
        </span>
      </div>

      <div className="flex flex-col gap-3 text-sm text-slate-300">
        <p>
          <span className="font-semibold text-slate-500 w-40 inline-block">Đơn hàng liên kết:</span>
          <span className="text-white font-bold">#{payment.orderId || payment.order?.id || 'Chưa liên kết'}</span>
        </p>
        <p>
          <span className="font-semibold text-slate-500 w-40 inline-block">Phương thức:</span>
          <span className="text-slate-200 bg-slate-800 px-2 py-0.5 rounded text-xs font-semibold">{payment.paymentMethod}</span>
        </p>
        <p>
          <span className="font-semibold text-slate-500 w-40 inline-block">Mã giao dịch:</span>
          <span className="text-indigo-400 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-850 text-xs">
            {payment.transactionCode || 'N/A'}
          </span>
        </p>
        <p>
          <span className="font-semibold text-slate-500 w-40 inline-block">Số tiền giao dịch:</span>
          <span className="text-slate-200 font-bold text-base">
            {payment.amount ? formatCurrency(payment.amount) : '0 đ'}
          </span>
        </p>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-800 pt-4 mt-2">
        <Button variant="secondary" onClick={() => navigate('/admin/payments')}>
          Quay lại danh sách
        </Button>
        <Button variant="primary" onClick={() => navigate(`/admin/payments/edit/${payment.paymentId || payment.id}`)}>
          Chỉnh sửa
        </Button>
      </div>
    </div>
  );
};

export default PaymentShow;
