import React, { useState } from 'react';
import uploadService from '../../../services/uploadService';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadedPath, setUploadedPath] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setUploadResult(null);
    setUploadedPath('');
    setCopied(false);

    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    const validation = uploadService.validateImage(selectedFile);
    if (!validation.valid) {
      setError(validation.message);
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError('');
    setUploadResult(null);
    setUploadedPath('');
    setCopied(false);

    try {
      const res = await uploadService.uploadFile(file);
      if (res && res.message) {
        const path = `/uploads/${res.message}`;
        setUploadedPath(path);
        setUploadResult('Tải file thành công!');
      } else {
        setUploadResult('Tải file thành công!');
      }
    } catch (err) {
      setError('Lỗi tải file lên máy chủ.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!uploadedPath) return;
    navigator.clipboard.writeText(uploadedPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-2xl">
      <Title size="sm">Công cụ tải tệp tin (Upload)</Title>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-5">
        <p className="text-sm text-slate-400">Tải lên các tệp tin hình ảnh một cách độc lập không gắn với sản phẩm.</p>
        
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-slate-200">Chọn file ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600/10 file:text-indigo-400 hover:file:bg-indigo-600/20 cursor-pointer border border-slate-800 rounded-xl bg-slate-950 p-1"
          />
          {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
        </div>

        {previewUrl && (
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-xs font-semibold text-slate-500">Xem trước:</span>
            <div className="w-48 h-48 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-2">
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
            <span className="text-xs text-slate-500">{file?.name} ({(file?.size / 1024).toFixed(2)} KB)</span>
          </div>
        )}

        {uploadResult && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg flex flex-col gap-2">
            <div>{uploadResult}</div>
            {uploadedPath && (
              <div className="mt-1 flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <code className="text-xs text-indigo-400 flex-1 font-mono break-all">{uploadedPath}</code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-500 active:scale-95 transition-all shrink-0"
                >
                  {copied ? 'Đã copy!' : 'Sao chép'}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-800 mt-2">
          <Button variant="primary" onClick={handleUpload} disabled={!file} isLoading={isLoading}>
            Tải lên máy chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
