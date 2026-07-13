import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../../../hooks/useCart';
import orderApi from '../../../api/orderApi';
import vnPayApi from '../../../api/vnPayApi';
import userApi from '../../../api/userApi';
import CheckoutForm from '../../../components/frontend/CheckoutForm';
import Title from '../../../components/common/Title';
import Loading from '../../../components/common/Loading';
import { formatCurrency, getImageUrl } from '../../../utils';

const Checkout = () => {
  const { cartItems: items, loading: cartLoading, cartTotal } = useCart() || {};
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartLoading && (!items || items.length === 0)) {
      alert('Giỏ hàng trống!');
      navigate('/cart');
    }
  }, [items, cartLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.getMyProfile();
        setProfile(res);
      } catch (err) {
        console.error('Lỗi lấy profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleCheckout = async (formData) => {
    setSubmitting(true);
    try {
      // 1. Create order
      const orderRes = await orderApi.create(formData);
      
      // 2. Handle Payment
      if (formData.paymentMethod === 'VNPAY') {
        const paymentRes = await vnPayApi.createPayment({
          amount: cartTotal,
          orderId: orderRes.orderId
        });
        
        const paymentUrl = paymentRes.paymentUrl || paymentRes.message;
        
        if (paymentUrl && paymentUrl.startsWith('http')) {
          window.location.href = paymentUrl;
        } else {
          alert('Lỗi tạo thanh toán VNPAY');
          navigate(`/my-orders/${orderRes.orderId}`);
        }
      } else {
        // COD
        navigate('/payment-result?status=00&orderId=' + orderRes.orderId);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng');
      setSubmitting(false);
    }
  };

  if (cartLoading && (!items || items.length === 0)) {
    return <div className="min-h-screen pt-20"><Loading text="Đang chuẩn bị thanh toán..." /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <Title subtitle="Hoàn tất đơn hàng">Thanh Toán</Title>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        <div className="lg:col-span-2">
          <CheckoutForm 
            onSubmit={handleCheckout} 
            isLoading={submitting} 
            initialData={profile ? {
              receiverName: profile.fullName || '',
              phone: profile.phone || '',
              address: profile.address || '',
            } : null}
          />
        </div>
        
        <div className="lg:col-span-1">
           <div className="bg-[#110e2d]/60 border border-purple-900/30 rounded-2xl p-6 shadow-xl sticky top-24">
              <h3 className="text-base font-bold text-slate-100 border-b border-purple-900/20 pb-3 uppercase tracking-wider mb-4">
                Đơn hàng ({items.reduce((acc, item) => acc + item.quantity, 0)} SP)
              </h3>
              
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.cartItemId} className="flex gap-3">
                    <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-slate-900">
                      <img src={getImageUrl(item.thumbnail, 'https://placehold.co/48x64?text=No+Image')} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="text-slate-200 line-clamp-2 font-medium">{item.productName}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-slate-500 text-xs">x {item.quantity}</span>
                        <span className="text-purple-400 font-bold">{formatCurrency(item.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-purple-900/30 mt-6 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between font-black text-xl text-emerald-400 mt-2 pt-2 border-t border-purple-900/20">
                  <span>Thành tiền</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
