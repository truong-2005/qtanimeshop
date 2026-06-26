import React, { useState } from 'react';
import Button from '../common/Button';

const ProductImageUpload = ({
  images = [],
  onUpload,
  onDelete,
  isLoading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile || !onUpload) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    
    onUpload(formData, () => {
      // Clear local state on success callback
      setSelectedFile(null);
      setPreview('');
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
      <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">
        Quản lý bộ sưu tập ảnh (Gallery)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Action */}
        <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            <label className="text-sm font-medium text-slate-300">Tải lên ảnh mới</label>
            <div className="relative border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/20 rounded-xl flex flex-col items-center justify-center p-4 min-h-[160px] text-center transition-all">
              {preview ? (
                <div className="relative w-full h-full flex flex-col items-center gap-3">
                  <img
                    src={preview}
                    alt="Gallery item preview"
                    className="h-28 object-contain rounded-lg border border-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview('');
                    }}
                    className="absolute top-0 right-2 p-1.5 rounded-full bg-slate-900/80 text-rose-500 hover:bg-slate-950 transition-colors shadow"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-6">
                  <svg className="w-8 h-8 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-semibold text-slate-400">Chọn ảnh bộ sưu tập</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={!selectedFile}
            isLoading={isLoading}
            className="self-start"
          >
            Thêm vào bộ sưu tập
          </Button>
        </form>

        {/* Uploaded Gallery Images List */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-300">Ảnh hiện tại ({images.length})</label>
          {images.length === 0 ? (
            <div className="flex-1 flex items-center justify-center border border-slate-800/60 rounded-xl bg-slate-950/20 text-xs text-slate-600 min-h-[160px]">
              Chưa có ảnh phụ nào
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto max-h-[260px] p-1 pr-2 border border-slate-800 rounded-xl bg-slate-950/20">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative group aspect-square rounded-lg border border-slate-800 overflow-hidden bg-slate-950/40"
                >
                  <img
                    src={img.image}
                    alt="Product item"
                    className="w-full h-full object-cover"
                  />
                  {/* Hover delete trigger */}
                  <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onDelete && onDelete(img.id)}
                      className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow"
                      aria-label="Delete image"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImageUpload;
