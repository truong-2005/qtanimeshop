import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postApi from '../../../api/postApi';
import topicApi from '../../../api/topicApi';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { formatDate, getImageUrl } from '../../../utils';

const PostShow = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [topicName, setTopicName] = useState('Chưa phân loại');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const postData = await postApi.getById(id);
        setPost(postData);
        if (postData && postData.topicId) {
          const topics = await topicApi.getAll();
          const foundTopic = topics.find(t => String(t.id) === String(postData.topicId));
          if (foundTopic) {
            setTopicName(foundTopic.name);
          }
        }
      } catch (err) {
        console.error('Failed to load post details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (isLoading) return <Loading text="Đang tải chi tiết bài viết..." />;
  if (!post) return <div className="text-slate-400 text-left">Không tìm thấy bài viết</div>;

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 max-w-3xl text-left flex flex-col gap-5 shadow-xl">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-white">Chi tiết bài viết #{post.id}</h3>
        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
          post.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
        }`}>
          {post.status || 'ACTIVE'}
        </span>
      </div>

      {post.thumbnail && (
        <div className="w-full h-64 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
          <img src={getImageUrl(post.thumbnail, 'https://placehold.co/800x400?text=No+Image')} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-extrabold text-white leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <p><span className="font-semibold text-slate-400">Chủ đề:</span> <span className="text-indigo-400 font-semibold">{topicName}</span></p>
          {post.createdAt && (
            <p><span className="font-semibold text-slate-400">Ngày tạo:</span> {formatDate(post.createdAt, { hour: undefined, minute: undefined })}</p>
          )}
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-850 rounded-lg p-4 text-sm text-slate-400 italic">
        <span className="font-semibold text-slate-300 block mb-1">Mô tả ngắn:</span>
        {post.description || 'Không có mô tả ngắn.'}
      </div>

      <div className="text-slate-300 text-sm leading-relaxed border-t border-slate-800 pt-4 whitespace-pre-wrap min-h-[150px]">
        {post.content}
      </div>

      <div className="flex justify-end pt-2 border-t border-slate-800 mt-4">
        <Button variant="secondary" onClick={() => navigate('/admin/posts')}>
          Quay lại danh sách
        </Button>
      </div>
    </div>
  );
};

export default PostShow;
