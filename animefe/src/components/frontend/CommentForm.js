import React, { useState } from 'react';
import Button from '../common/Button';

const CommentForm = ({
  onSubmit,
  isLoading = false,
  placeholder = 'Viết bình luận của bạn...',
  buttonText = 'Gửi bình luận',
}) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Bình luận không được để trống');
      return;
    }
    setError('');
    if (onSubmit) {
      onSubmit({ content }, () => {
        setContent('');
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
      <div className="flex flex-col gap-1.5">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError('');
          }}
          rows="3"
          className={`
            w-full bg-slate-900 border text-slate-100 rounded-lg text-xs px-4 py-2.5 placeholder:text-slate-600 focus:outline-none resize-none transition-all duration-300
            ${error
              ? 'border-rose-500 focus:border-rose-500'
              : 'border-purple-950/40 focus:border-purple-500'
            }
          `}
          placeholder={placeholder}
        />
        {error && (
          <span className="text-xxs text-rose-500">{error}</span>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="secondary" size="sm" isLoading={isLoading}>
          {buttonText}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
