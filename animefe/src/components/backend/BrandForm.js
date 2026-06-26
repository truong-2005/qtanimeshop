import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const BrandForm = ({ initialData = null, onSubmit, isLoading = false }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Tên thương hiệu là bắt buộc');
      return;
    }
    setError('');
    if (onSubmit) {
      onSubmit({ name });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-5 max-w-lg">
      <Input
        label="Tên thương hiệu"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError('');
        }}
        error={error}
        placeholder="Ví dụ: Good Smile Company"
      />
      <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
};

export default BrandForm;
