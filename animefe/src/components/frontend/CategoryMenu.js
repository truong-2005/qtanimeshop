import React from 'react';
import { Link } from 'react-router-dom';

const CategoryMenu = ({ categories = [], activeCategoryId = null }) => {
  return (
    <div className="flex flex-wrap gap-2 py-4 select-none">
      <Link
        to="/products"
        className={`
          px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all duration-300
          ${!activeCategoryId
            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
            : 'border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50'
          }
        `}
      >
        Tất cả danh mục
      </Link>
      
      {categories.map((category) => {
        const isActive = activeCategoryId === category.id;
        return (
          <Link
            key={category.id}
            to={`/products?category=${category.id}`}
            className={`
              px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all duration-300
              ${isActive
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50'
              }
            `}
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryMenu;
