import React, { useState } from 'react';
import Button from '../common/Button';

const ReviewForm = ({ onSubmit, isLoading = false }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Nội dung đánh giá không được để trống');
      return;
    }
    setError('');
    if (onSubmit) {
      onSubmit({ rating, content }, () => {
        // Clear state on success callback
        setContent('');
        setRating(5);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#110e2d]/60 border border-purple-900/20 rounded-xl p-5 shadow-xl flex flex-col gap-4 text-left">
      <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
        Viết đánh giá sản phẩm
      </h3>

      {/* Stars Selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-slate-300">Đánh giá sao</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 rounded transition-transform hover:scale-110 focus:outline-none"
              aria-label={`Đánh giá ${star} sao`}
            >
              <svg
                className={`w-6 h-6 ${
                  (hoverRating || rating) >= star ? 'text-amber-400 fill-current' : 'text-slate-700'
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Comment text area */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-300">Nhận xét của bạn</label>
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
              ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
              : 'border-purple-950/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
            }
          `}
          placeholder="Chia sẻ trải nghiệm về sản phẩm của bạn (chất lượng sơn, chi tiết, khớp)..."
        />
        {error && (
          <span className="text-xxs text-rose-500 mt-0.5">{error}</span>
        )}
      </div>

      {/* Action Submit */}
      <div className="flex justify-end pt-1">
        <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
          Gửi đánh giá
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
