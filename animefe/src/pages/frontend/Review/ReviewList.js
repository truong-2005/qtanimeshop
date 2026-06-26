import React, { useState, useEffect } from 'react';
import reviewApi from '../../../api/reviewApi';
import useAuth from '../../../hooks/useAuth';
import ReviewForm from '../../../components/frontend/ReviewForm';
import { formatDate } from '../../../utils';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewApi.getReviewsByProduct(productId);
      const dataList = res?.content || res || [];
      setReviews(Array.isArray(dataList) ? dataList : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleCreateReview = async (data) => {
    try {
      await reviewApi.createReview({ ...data, productId });
      alert('Cảm ơn bạn đã đánh giá!');
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="space-y-6">
      {/* Review Form */}
      {isAuthenticated ? (
        <ReviewForm onSubmit={handleCreateReview} />
      ) : (
        <div className="bg-slate-900/50 border border-purple-900/20 p-4 rounded-xl text-center text-sm text-slate-400">
          Vui lòng đăng nhập để gửi đánh giá.
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4 mt-8">
        {loading ? (
          <div className="text-center text-sm text-slate-500 py-4 animate-pulse">Đang tải đánh giá...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-sm text-slate-500 py-4">Chưa có đánh giá nào cho sản phẩm này.</div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="bg-slate-900/40 p-4 rounded-xl border border-purple-900/10">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-900 overflow-hidden">
                    {review.user?.avatar ? (
                      <img src={review.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-indigo-400">
                        {review.user?.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{review.user?.username || 'Ẩn danh'}</p>
                    <div className="flex items-center text-amber-400 text-xs">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500">{formatDate(review.createdAt, { hour: undefined, minute: undefined })}</span>
              </div>
              <p className="text-sm text-slate-300 ml-13 pl-13">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewList;
