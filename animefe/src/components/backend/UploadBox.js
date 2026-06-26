import React, { useState } from 'react';
import Button from '../common/Button';

const UploadBox = ({
  onUpload,
  accept = 'image/*',
  multiple = false,
  isLoading = false,
  label = 'Kéo thả tệp tin hoặc click để chọn',
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(multiple ? files : [files[0]]);
  };

  const handleUploadClick = () => {
    if (selectedFiles.length === 0 || !onUpload) return;
    
    if (multiple) {
      onUpload(selectedFiles, () => setSelectedFiles([]));
    } else {
      onUpload(selectedFiles[0], () => setSelectedFiles([]));
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all min-h-[150px]
          ${isDragOver ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 bg-slate-950/20 hover:border-slate-700'}
        `}
      >
        <svg className="w-10 h-10 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <label className="cursor-pointer">
          <span className="text-xs font-semibold text-slate-400 block">{label}</span>
          <span className="text-[10px] text-slate-600 mt-1 block">Chấp nhận tệp định dạng {accept}</span>
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {selectedFiles.length > 0 && (
          <div className="mt-4 text-xs font-semibold text-indigo-400">
            Đã chọn {selectedFiles.length} tệp: {selectedFiles.map(f => f.name).join(', ')}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleUploadClick}
          variant="primary"
          disabled={selectedFiles.length === 0}
          isLoading={isLoading}
        >
          Bắt đầu tải lên
        </Button>
      </div>
    </div>
  );
};

export default UploadBox;
