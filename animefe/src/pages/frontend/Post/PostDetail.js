import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import postApi from '../../../api/postApi';
import Title from '../../../components/common/Title';
import Loading from '../../../components/common/Loading';
import { formatDate } from '../../../utils';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Try getting by slug first, if fails try id
        try {
          const res = await postApi.getBySlug(id);
          setPost(res);
        } catch {
          const res2 = await postApi.getById(id);
          setPost(res2);
        }
      } catch (err) {
        console.error('Lỗi tải bài viết:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen pt-20"><Loading text="Đang tải bài viết..." /></div>;
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Title subtitle="Lỗi">Không tìm thấy bài viết</Title>
        <Link to="/posts" className="text-indigo-400 hover:text-indigo-300">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-6">
        <Link to="/posts" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-indigo-400 transition-colors mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách
        </Link>
        
        {post.topic && (
          <div className="mb-4">
            <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {post.topic.name}
            </span>
          </div>
        )}
        
        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-slate-500 border-b border-purple-900/30 pb-6 mb-8">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.createdAt, { hour: undefined, minute: undefined })}
          </span>
        </div>
      </div>

      {post.thumbnail && (
        <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-10 shadow-2xl">
          <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content Rendering */}
      <div 
        className="prose prose-invert prose-purple max-w-none 
          prose-headings:font-black prose-headings:text-slate-100 
          prose-p:text-slate-300 prose-p:leading-relaxed 
          prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300 
          prose-strong:text-white prose-strong:font-bold
          prose-img:rounded-xl prose-img:shadow-lg"
        dangerouslySetInnerHTML={{ __html: post.details || post.description }}
      />
      
      {/* Footer tags or info */}
      <div className="mt-16 pt-8 border-t border-purple-900/30 flex justify-between items-center">
        <span className="text-slate-400 text-sm">Cảm ơn bạn đã đọc bài viết!</span>
      </div>
    </div>
  );
};

export default PostDetail;
