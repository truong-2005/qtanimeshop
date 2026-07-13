import React, { useState, useEffect } from 'react';
import commentApi from '../../../api/commentApi';
import useAuth from '../../../hooks/useAuth';
import CommentForm from '../../../components/frontend/CommentForm';
import { formatDate, getImageUrl } from '../../../utils';

const CommentList = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await commentApi.getCommentsByProduct(productId);
      const dataList = res?.content || res || [];
      setComments(Array.isArray(dataList) ? dataList : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchComments();
    }
  }, [productId]);

  const handleCreateComment = async (data) => {
    try {
      await commentApi.createComment({ ...data, productId });
      fetchComments();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleReplyComment = async (data, parentId) => {
    try {
      await commentApi.replyComment({ ...data, parentId });
      setReplyingTo(null);
      fetchComments();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="space-y-6">
      {/* Root Comment Form */}
      {isAuthenticated ? (
        <CommentForm onSubmit={handleCreateComment} placeholder="Viết bình luận của bạn..." />
      ) : (
        <div className="bg-slate-900/50 border border-purple-900/20 p-4 rounded-xl text-center text-sm text-slate-400">
          Vui lòng đăng nhập để bình luận.
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4 mt-8">
        {loading ? (
          <div className="text-center text-sm text-slate-500 py-4 animate-pulse">Đang tải bình luận...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-sm text-slate-500 py-4">Chưa có bình luận nào. Trở thành người đầu tiên!</div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-slate-900/40 p-4 rounded-xl border border-purple-900/10">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-900 overflow-hidden">
                    {comment.user?.avatar ? (
                      <img src={getImageUrl(comment.user.avatar)} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-cyan-400">
                        {comment.user?.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{comment.user?.username || 'Ẩn danh'}</p>
                    <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
                  </div>
                </div>
                {isAuthenticated && (
                  <button 
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                  >
                    Phản hồi
                  </button>
                )}
              </div>
              <p className="text-sm text-slate-300 ml-13 pl-13 mb-3">{comment.content}</p>
              
              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="ml-13 pl-13 mt-3">
                  <CommentForm 
                    onSubmit={(data) => handleReplyComment(data, comment.id)} 
                    placeholder="Viết phản hồi..." 
                    buttonText="Gửi phản hồi"
                  />
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-13 pl-13 mt-4 space-y-3 border-l-2 border-purple-900/20">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-300">{reply.user?.username || 'Ẩn danh'}</span>
                        <span className="text-[10px] text-slate-500">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-400">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;
