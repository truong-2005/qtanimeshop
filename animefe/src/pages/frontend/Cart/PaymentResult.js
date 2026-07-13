import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import vnPayApi from '../../../api/vnPayApi';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

import useCart from '../../../hooks/useCart';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null); // { success: true/false, message: '' }
  const { refreshCart } = useCart() || {};

  useEffect(() => {
    const processPayment = async () => {
      const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
      const mockStatus = searchParams.get('status');
      const orderId = searchParams.get('orderId');

      if (mockStatus) {
        // COD
        if (mockStatus === '00' || mockStatus === 'success') {
          setResult({ success: true, message: 'Đặt hàng thành công! Đơn hàng của bạn sẽ được thanh toán khi nhận hàng.', orderId });
          if (refreshCart) refreshCart();
        } else {
          setResult({ success: false, message: 'Đặt hàng thất bại.' });
        }
        setLoading(false);
        return;
      }

      if (vnp_ResponseCode) {
        // VNPAY Callback
        try {
          const paramsObj = Object.fromEntries([...searchParams]);
          const res = await vnPayApi.paymentCallback(paramsObj);
          
          if (vnp_ResponseCode === '00') {
             setResult({ success: true, message: res?.message || 'Thanh toán qua VNPAY thành công!', orderId: searchParams.get('vnp_TxnRef') });
             if (refreshCart) refreshCart();
          } else {
             setResult({ success: false, message: 'Thanh toán VNPAY thất bại hoặc bị hủy.' });
          }
        } catch (err) {
          console.error(err);
          setResult({ success: false, message: 'Có lỗi xảy ra khi xác thực thanh toán VNPAY.' });
        } finally {
          setLoading(false);
        }
        return;
      }

      setResult({ success: false, message: 'Không tìm thấy thông tin giao dịch.' });
      setLoading(false);
    };

    processPayment();
  }, [searchParams]);

  if (loading) {
    return <div className="min-h-screen pt-20"><Loading text="Đang xử lý kết quả giao dịch..." /></div>;
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-lg w-full bg-[#110e2d]/60 p-8 rounded-2xl shadow-2xl border ${result?.success ? 'border-emerald-500/30' : 'border-rose-500/30'} text-center`}>
        {result?.success ? (
          <>
            <div className="w-20 h-20 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <Title subtitle="Hoàn tất" className="justify-center mb-4 text-emerald-400">Giao dịch thành công</Title>
            <p className="text-slate-300 mb-8">{result.message}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={`/my-orders/${result.orderId || ''}`}>
                <Button variant="primary" className="w-full justify-center">Xem đơn hàng</Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" className="w-full justify-center">Tiếp tục mua sắm</Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto bg-rose-500/20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <Title subtitle="Lỗi" className="justify-center mb-4 text-rose-400">Giao dịch thất bại</Title>
            <p className="text-slate-300 mb-8">{result?.message}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cart">
                <Button variant="primary" className="w-full justify-center">Quay lại giỏ hàng</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
