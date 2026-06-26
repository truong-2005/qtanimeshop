import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import SelectBox from '../common/SelectBox';
import Button from '../common/Button';
import { generateSlug } from '../../utils';

const ProductForm = ({
  initialData = null,
  categories = [],
  brands = [],
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    quantity: 0,
    status: 'ACTIVE',
    categoryId: '',
    brandId: '',
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        quantity: initialData.quantity || 0,
        status: initialData.status || 'ACTIVE',
        categoryId: initialData.categoryId || (initialData.category?.id || ''),
        brandId: initialData.brandId || (initialData.brand?.id || ''),
      });
      if (initialData.thumbnail) {
        setThumbnailPreview(initialData.thumbnail);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === 'name' && !initialData) {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên sản phẩm là bắt buộc';
    if (!formData.slug.trim()) newErrors.slug = 'Slug là bắt buộc';
    if (formData.price <= 0) newErrors.price = 'Giá sản phẩm phải lớn hơn 0';
    if (formData.quantity < 0) newErrors.quantity = 'Số lượng không được âm';
    if (!formData.categoryId) newErrors.categoryId = 'Vui lòng chọn danh mục';
    if (!formData.brandId) newErrors.brandId = 'Vui lòng chọn thương hiệu';
    if (!thumbnailPreview) newErrors.thumbnail = 'Hình ảnh sản phẩm là bắt buộc';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append('name', formData.name);
    data.append('slug', formData.slug);
    data.append('description', formData.description || '');
    data.append('price', parseFloat(formData.price) || 0);
    data.append('quantity', parseInt(formData.quantity) || 0);
    data.append('status', formData.status);
    
    // Map to exact DTO field names
    data.append('categoryId', formData.categoryId);
    data.append('brandId', formData.brandId);
    
    if (thumbnailFile) {
      data.append('thumbnail', thumbnailFile);
    }

    if (onSubmit) {
      onSubmit(data);
    }
  };

  const categoryOptions = categories.map((cat) => ({ value: cat.id, label: cat.name }));
  const brandOptions = brands.map((br) => ({ value: br.id, label: br.name }));

  const statusOptions = [
    { value: 'ACTIVE', label: 'Hoạt động (Active)' },
    { value: 'OUT_OF_STOCK', label: 'Hết hàng (Out of stock)' },
    { value: 'DISCONTINUED', label: 'Ngừng bán (Discontinued)' },
    { value: 'HIDDEN', label: 'Ẩn sản phẩm (Hidden)' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tên sản phẩm"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Nhập tên sản phẩm..."
            />
            <Input
              label="Đường dẫn (Slug)"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              error={errors.slug}
              placeholder="nhap-ten-san-pham"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Giá bán (VND)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
              placeholder="0"
            />
            <Input
              label="Số lượng trong kho"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              error={errors.quantity}
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectBox
              label="Danh mục"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              options={categoryOptions}
              error={errors.categoryId}
              placeholder="-- Chọn danh mục --"
            />
            <SelectBox
              label="Thương hiệu"
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              options={brandOptions}
              error={errors.brandId}
              placeholder="-- Chọn thương hiệu --"
            />
            <SelectBox
              label="Trạng thái"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
              placeholder=""
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Mô tả sản phẩm</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-sm px-4 py-2.5 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 resize-none"
              placeholder="Nhập mô tả sản phẩm..."
            />
          </div>
        </div>

        {/* Thumbnail Preview and Upload */}
        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-slate-300">Ảnh đại diện (Thumbnail)</label>
          <div className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 min-h-[220px] text-center transition-all ${
            errors.thumbnail ? 'border-rose-500/50 bg-rose-950/5' : 'border-slate-800 bg-slate-950/20 hover:border-indigo-500/50'
          }`}>
            {thumbnailPreview ? (
              <div className="relative w-full h-full flex flex-col gap-3">
                <img
                  src={thumbnailPreview}
                  alt="Product preview"
                  className="w-full h-48 object-contain bg-slate-950 rounded-lg border border-slate-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailFile(null);
                    setThumbnailPreview('');
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-rose-500 hover:bg-slate-950 transition-colors shadow"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-10">
                <svg className="w-12 h-12 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-semibold text-slate-400">Tải ảnh sản phẩm</span>
                <span className="text-[10px] text-slate-600 mt-1">Hỗ trợ JPG, PNG, WEBP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {errors.thumbnail && (
            <span className="text-xs text-rose-500 mt-1">{errors.thumbnail}</span>
          )}
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
