import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const BannerForm = ({ initialData = null, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    description: '',
    active: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  const [imageMethod, setImageMethod] = useState('upload'); // 'upload' or 'url'
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        link: initialData.link || '',
        description: initialData.description || '',
        active: initialData.active !== undefined ? initialData.active : true,
      });
      if (initialData.image) {
        if (initialData.image.startsWith('http')) {
          setImageMethod('url');
          setImageUrlInput(initialData.image);
        }
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name] : '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề banner là bắt buộc';
    
    if (imageMethod === 'upload' && !imagePreview) {
      newErrors.image = 'Hình ảnh banner là bắt buộc';
    } else if (imageMethod === 'url' && !imageUrlInput.trim()) {
      newErrors.image = 'Link hình ảnh là bắt buộc';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Build FormData
    const data = new FormData();
    data.append('title', formData.title);
    data.append('link', formData.link);
    data.append('description', formData.description);
    data.append('active', formData.active);
    
    if (imageMethod === 'upload' && imageFile) {
      data.append('file', imageFile);
    } else if (imageMethod === 'url') {
      const urlBlob = new Blob([imageUrlInput], { type: 'text/plain' });
      data.append('file', urlBlob, `URL:${imageUrlInput}`);
    }

    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Fields */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Input
            label="Tiêu đề Banner"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Ví dụ: Flash Sale Hè 2026"
          />

          <Input
            label="Đường dẫn liên kết (Link)"
            name="link"
            value={formData.link}
            onChange={handleChange}
            error={errors.link}
            placeholder="Ví dụ: /products/flash-sale"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Mô tả chi tiết</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-sm px-4 py-2.5 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 resize-none"
              placeholder="Nhập mô tả cho banner..."
            />
          </div>

          {/* Active Switch Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-lg border border-slate-800/60 mt-2">
            <div>
              <p className="text-sm font-bold text-slate-200">Kích hoạt hiển thị</p>
              <p className="text-xs text-slate-500">Cho phép banner này hiển thị trên slider trang chủ</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white" />
            </label>
          </div>
        </div>

        {/* Banner Image Upload */}
        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-slate-300">Hình ảnh Banner</label>
          
          {/* Method Selection */}
          <div className="flex gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setImageMethod('upload');
                setImagePreview(imageFile ? URL.createObjectURL(imageFile) : (initialData?.image && !initialData.image.startsWith('http') ? initialData.image : ''));
              }}
              className={`flex-1 py-1.5 rounded-md font-bold transition-all ${imageMethod === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Tải file lên
            </button>
            <button
              type="button"
              onClick={() => {
                setImageMethod('url');
                setImagePreview(imageUrlInput);
              }}
              className={`flex-1 py-1.5 rounded-md font-bold transition-all ${imageMethod === 'url' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Nhập link ảnh URL
            </button>
          </div>

          {imageMethod === 'url' ? (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Dán link ảnh banner (https://...)"
                value={imageUrlInput}
                onChange={(e) => {
                  setImageUrlInput(e.target.value);
                  setImagePreview(e.target.value);
                  if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
                }}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-sm px-4 py-2 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
              {imagePreview && (
                <div className="relative border border-slate-800 rounded-xl p-2 bg-slate-950/20">
                  <img
                    src={imagePreview}
                    alt="Banner URL preview"
                    className="w-full h-40 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x250?text=Link+Ảnh+Lỗi';
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 min-h-[200px] text-center transition-all ${
              errors.image ? 'border-rose-500/50 bg-rose-950/5' : 'border-slate-800 bg-slate-950/20 hover:border-indigo-500/50'
            }`}>
              {imagePreview ? (
                <div className="relative w-full h-full flex flex-col gap-3">
                  <img
                    src={imagePreview}
                    alt="Banner preview"
                    className="w-full h-40 object-cover rounded-lg border border-slate-800 shadow"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-rose-500 hover:bg-slate-950 transition-colors shadow"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-8">
                  <svg className="w-10 h-10 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-semibold text-slate-400">Chọn hoặc kéo thả ảnh vào đây</span>
                  <span className="text-[10px] text-slate-600 mt-1">Hỗ trợ JPG, PNG, WEBP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}
          {errors.image && (
            <span className="text-xs text-rose-500 mt-1">{errors.image}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Cập nhật Banner' : 'Tạo Banner mới'}
        </Button>
      </div>
    </form>
  );
};

export default BannerForm;
