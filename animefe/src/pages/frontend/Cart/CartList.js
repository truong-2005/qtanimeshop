import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import couponApi from '../../../api/couponApi';
import useCart from '../../../hooks/useCart';
import useAuth from '../../../hooks/useAuth';
import CartItem from '../../../components/frontend/CartItem';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { formatCurrency } from '../../../utils';

const CartList = () => {
  const { isAuthenticated } = useAuth();
  const {
    cartItems: items,
    loading,
    updateQuantity,
    removeItem,
    clearCart,
    cartTotal,
  } = useCart() || {};

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    try {
      await updateQuantity(cartItemId, quantity);
    } catch (err) {
      console.error(err);
      alert('Lỗi cập nhật số lượng');
    }
  };

  const handleRemove = async (cartItemId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      try {
        await removeItem(cartItemId);
      } catch (err) {
        console.error(err);
        alert('Lỗi xóa sản phẩm');
      }
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      try {
        await clearCart();
      } catch (err) {
        console.error(err);
        alert('Lỗi xóa giỏ hàng');
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    try {
      const res = await couponApi.apply({
        code: couponCode,
        totalOrderValue: cartTotal
      });
      setAppliedCoupon(res);
      alert(res.message || 'Áp dụng mã giảm giá thành công!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Mã giảm giá không hợp lệ');
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (loading && (!items || items.length === 0)) {
    return <div className="min-h-screen pt-20"><Loading text="Đang tải giỏ hàng..." /></div>;
  }

  if (!items) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <Title subtitle="Giỏ hàng của bạn">Giỏ Hàng</Title>
        {items.length > 0 && (
          <Button variant="danger" className="text-xs" onClick={handleClearCart}>
            Xóa tất cả
          </Button>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="bg-[#0f0e24]/40 border border-purple-900/20 rounded-2xl p-10 text-center shadow-xl">
          <svg className="w-20 h-20 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="text-xl font-bold text-slate-300 mb-2">Vui lòng đăng nhập để xem giỏ hàng</h3>
          <p className="text-slate-500 mb-6 text-sm">Bạn cần đăng nhập để quản lý và thanh toán các sản phẩm trong giỏ.</p>
          <Link to="/login">
            <Button variant="primary">Đăng nhập ngay</Button>
          </Link>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#0f0e24]/40 border border-purple-900/20 rounded-2xl p-10 text-center shadow-xl">
          <svg className="w-20 h-20 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="text-xl font-bold text-slate-300 mb-2">Giỏ hàng trống</h3>
          <p className="text-slate-500 mb-6 text-sm">Bạn chưa chọn sản phẩm nào để mua.</p>
          <Link to="/products">
            <Button variant="primary">Tiếp tục mua sắm</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <CartItem
                key={item.cartItemId}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#0f0e24]/40 border border-purple-900/20 rounded-2xl p-6 shadow-xl sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-purple-900/30 pb-3">Tóm tắt đơn hàng</h3>
              <div className="flex justify-between text-sm text-slate-300 mb-2">
                <span>Tổng sản phẩm</span>
                <span>{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-300 mb-2">
                <span>Tạm tính</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>

              {/* Coupon Input Area */}
              <div className="flex gap-2 items-start mt-4 pt-4 border-t border-purple-900/20">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Mã giảm giá..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                {!appliedCoupon ? (
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition disabled:opacity-50"
                  >
                    {applyingCoupon ? '...' : 'Áp dụng'}
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                    className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 text-sm rounded-lg transition"
                  >
                    Hủy mã
                  </button>
                )}
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-sm text-emerald-400 pt-3">
                  <span>Giảm giá ({appliedCoupon.code})</span>
                  <span>-{formatCurrency(appliedCoupon.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between font-extrabold text-xl text-purple-400 mt-4 pt-4 border-t border-purple-900/30">
                <span>Tổng cộng</span>
                <span>{formatCurrency(appliedCoupon ? appliedCoupon.finalTotal : cartTotal)}</span>
              </div>
              
              <Link to="/checkout" state={{ appliedCoupon }} className="block mt-6">
                <Button variant="primary" className="w-full justify-center py-3">
                  Tiến hành thanh toán
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartList;
