import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../../hooks/useCart';
import CartItem from '../../../components/frontend/CartItem';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { formatCurrency } from '../../../utils';

const CartList = () => {
  const {
    cartItems: items,
    loading,
    updateQuantity,
    removeItem,
    clearCart,
    cartTotal,
  } = useCart() || {};

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

      {items.length === 0 ? (
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
              <div className="flex justify-between font-extrabold text-xl text-purple-400 mt-4 pt-4 border-t border-purple-900/30">
                <span>Tổng cộng</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              
              <Link to="/checkout" className="block mt-6">
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
