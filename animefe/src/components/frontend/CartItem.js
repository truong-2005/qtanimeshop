import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, getImageUrl } from '../../utils';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleIncrease = () => {
    if (onUpdateQuantity) {
      onUpdateQuantity(item.cartItemId, item.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1 && onUpdateQuantity) {
      onUpdateQuantity(item.cartItemId, item.quantity - 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-purple-900/10 rounded-xl bg-[#0f0e24]/40 hover:border-purple-500/20 transition-all select-none">
      {/* Product Details info */}
      <div className="flex items-center gap-4 flex-1">
        <div className="w-16 h-20 rounded-lg overflow-hidden border border-purple-900/20 bg-slate-950 flex-shrink-0">
          <img
            src={getImageUrl(item.thumbnail, 'https://placehold.co/80x100')}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-left flex-1">
          <Link
            to={`/product/${item.productId}`}
            className="font-bold text-slate-100 hover:text-purple-400 transition-colors line-clamp-1 text-sm md:text-base"
          >
            {item.productName}
          </Link>
          <p className="text-xs text-indigo-400 font-bold mt-1">
            {item.price ? formatCurrency(item.price) : '0 đ'}
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-purple-900/20">
        {/* Quantity selectors */}
        <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-1 border border-purple-900/20">
          <button
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
            className="w-7 h-7 flex items-center justify-center font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded transition-colors"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-8 text-center text-xs font-bold text-slate-100">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrease}
            className="w-7 h-7 flex items-center justify-center font-bold text-slate-400 hover:text-white rounded transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Sum details */}
        <div className="text-right min-w-[100px]">
          <span className="text-xs text-slate-500 block font-medium">Tổng tiền</span>
          <span className="font-extrabold text-sm md:text-base text-purple-400">
            {item.totalPrice ? formatCurrency(item.totalPrice) : '0 đ'}
          </span>
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove && onRemove(item.cartItemId)}
          className="p-2 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
          title="Xóa khỏi giỏ hàng"
          aria-label="Remove item"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
