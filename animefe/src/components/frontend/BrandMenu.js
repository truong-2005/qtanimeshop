import React from 'react';
import { Link } from 'react-router-dom';

const BrandMenu = ({ brands = [], activeBrandId = null }) => {
  return (
    <div className="flex flex-wrap gap-2 py-4 select-none">
      <Link
        to="/products"
        className={`
          px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all duration-300
          ${!activeBrandId
            ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20'
            : 'border-purple-900/30 text-slate-400 hover:text-white hover:border-purple-500/50'
          }
        `}
      >
        Tất cả hãng sx
      </Link>
      
      {brands.map((brand) => {
        const isActive = activeBrandId === brand.id;
        return (
          <Link
            key={brand.id}
            to={`/products?brand=${brand.id}`}
            className={`
              px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all duration-300
              ${isActive
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20'
                : 'border-purple-900/30 text-slate-400 hover:text-white hover:border-purple-500/50'
              }
            `}
          >
            {brand.name}
          </Link>
        );
      })}
    </div>
  );
};

export default BrandMenu;
