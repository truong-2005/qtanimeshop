import React from 'react';
import SelectBox from '../common/SelectBox';
import Button from '../common/Button';

const ProductFilter = ({
  categories = [],
  brands = [],
  filters = {},
  onChange,
  onReset,
}) => {
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (onChange) {
      onChange({ [name]: value });
    }
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const parsed = value ? parseFloat(value) : '';
    if (onChange) {
      onChange({ [name]: parsed });
    }
  };

  const sortOptions = [
    { value: 'price,asc', label: 'Giá thấp đến cao' },
    { value: 'price,desc', label: 'Giá cao đến thấp' },
    { value: 'id,desc', label: 'Mới nhất' },
    { value: 'name,asc', label: 'Tên A - Z' },
  ];

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));
  const brandOptions = brands.map(b => ({ value: b.id, label: b.name }));

  const currentSort = filters.sortBy
    ? `${filters.sortBy},${filters.sortDirection || 'asc'}`
    : '';

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (onChange) {
      if (value) {
        const [sortBy, sortDirection] = value.split(',');
        onChange({ sortBy, sortDirection });
      } else {
        onChange({ sortBy: '', sortDirection: '' });
      }
    }
  };

  return (
    <div className="bg-[#0f0e24]/40 border border-purple-900/20 rounded-xl p-5 flex flex-col gap-5 text-left shadow-lg">
      <h3 className="text-sm font-extrabold uppercase tracking-wider text-white border-b border-purple-900/30 pb-3 flex justify-between items-center">
        <span>Bộ lọc sản phẩm</span>
        <button
          type="button"
          onClick={onReset}
          className="text-xxs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest cursor-pointer"
        >
          Xóa lọc
        </button>
      </h3>

      {/* Categories */}
      <SelectBox
        label="Danh mục"
        name="categoryId"
        value={filters.categoryId || ''}
        onChange={handleSelectChange}
        options={categoryOptions}
        placeholder="Tất cả danh mục"
      />

      {/* Brands */}
      <SelectBox
        label="Thương hiệu"
        name="brandId"
        value={filters.brandId || ''}
        onChange={handleSelectChange}
        options={brandOptions}
        placeholder="Tất cả thương hiệu"
      />

      {/* Price filter inputs */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-300">Khoảng giá (đ)</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice || ''}
            onChange={handlePriceChange}
            placeholder="Min"
            className="w-full bg-slate-900/80 border border-purple-950/40 text-slate-100 rounded-lg text-xs px-3 py-2 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all"
          />
          <span className="text-slate-600 font-bold">-</span>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || ''}
            onChange={handlePriceChange}
            placeholder="Max"
            className="w-full bg-slate-900/80 border border-purple-950/40 text-slate-100 rounded-lg text-xs px-3 py-2 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>
      </div>

      {/* Sort order */}
      <SelectBox
        label="Sắp xếp theo"
        name="sort"
        value={currentSort}
        onChange={handleSortChange}
        options={sortOptions}
        placeholder="Mặc định"
      />
    </div>
  );
};

export default ProductFilter;
