import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { formatCurrency, getImageUrl } from '../../utils';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart() || {};

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart) {
      addToCart(product.id, 1);
    }
  };

  // Check discount criteria
  const hasSale = product.salePrice !== undefined && product.salePrice !== null && product.salePrice < product.price;
  const discountPercent = hasSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-purple-300 transition-all duration-300 select-none">
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-slate-50">
        {/* Discount Badge */}
        {hasSale && (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-1 text-[10px] font-black tracking-wider bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded shadow-md animate-pulse">
            -{discountPercent}%
          </span>
        )}

        {/* Thumbnail Image */}
        <img
          src={getImageUrl(product.thumbnail, 'https://placehold.co/200x250')}
          alt={product.name}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick Add to Cart Hover overlay */}
        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold uppercase rounded-lg shadow-lg active:scale-95 transition-all duration-300"
          >
            Add to Cart
          </button>
        </div>
      </Link>

      {/* Card Info Details */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-white">
        <div className="flex flex-col gap-1 text-left">
          {/* Category / Brand label */}
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">
            {product.categoryName || product.category?.name || 'Anime Figure'}
          </span>
          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="text-sm font-bold text-slate-800 line-clamp-2 hover:text-purple-600 transition-colors"
          >
            {product.name}
          </Link>
        </div>

        <div className="flex items-center gap-2 text-left justify-start">
          {hasSale ? (
            <>
              <span className="text-base font-extrabold text-rose-600">
                {formatCurrency(product.salePrice)}
              </span>
              <span className="text-xs text-slate-500 line-through">
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <span className="text-base font-extrabold text-slate-900">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
