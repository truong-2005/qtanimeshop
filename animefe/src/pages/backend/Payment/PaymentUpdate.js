import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import paymentApi from '../../../api/paymentApi';
import orderApi from '../../../api/orderApi';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import SelectBox from '../../../components/common/SelectBox';
import Loading from '../../../components/common/Loading';
import { formatCurrency } from '../../../utils';

const PaymentUpdate = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    orderId: '',
    paymentMethod: 'COD',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const detail = await paymentApi.getById(id);
        const ordersList = await orderApi.getAll();
        setOrders(ordersList || []);

        if (detail) {
          setFormData({
            orderId: detail.orderId || detail.order?.id || '',
            paymentMethod: detail.paymentMethod || 'COD',
          });
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết giao dịch thanh toán:', err);
      } finally {
        setIsFetching(false);
      }
    };
    loadDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.orderId) newErrors.orderId = 'Vui lòng chọn đơn hàng';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await paymentApi.update(id, {
        orderId: Number(formData.orderId),
        paymentMethod: formData.paymentMethod,
      });
      navigate('/admin/payments');
    } catch (err) {
      console.error('Lỗi khi cập nhật giao dịch thanh toán:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading text="Đang tải dữ liệu giao dịch..." />;

  const orderOptions = orders.map((o) => ({
    value: o.orderId || o.id,
    label: `Đơn hàng #${o.orderId || o.id} - ${o.receiverName || 'Khách hàng'} (${formatCurrency(o.totalPrice)})`,
  }));

  return (
    <div className="flex flex-col gap-6 text-left max-w-xl">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/payments')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Cập nhật giao dịch thanh toán</Title>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-5">
        <SelectBox
          label="Chọn đơn hàng"
          name="orderId"
          value={formData.orderId}
          onChange={handleChange}
          options={orderOptions}
          placeholder="-- Chọn đơn hàng thanh toán --"
          error={errors.orderId}
          required
        />

        <SelectBox
          label="Phương thức thanh toán"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          options={[
            { value: 'COD', label: 'Thanh toán COD' },
            { value: 'VNPAY', label: 'Ví điện tử VNPay' },
          ]}
          error={errors.paymentMethod}
          required
        />

        <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/payments')}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Cập nhật giao dịch
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentUpdate;
