import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import postApi from '../../../api/postApi';
import Title from '../../../components/common/Title';
import Loading from '../../../components/common/Loading';
import { formatDate, getImageUrl } from '../../../utils';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostAndRelated = async () => {
      setLoading(true);
      try {
        let postData = null;
        try {
          postData = await postApi.getBySlug(id);
        } catch {
          postData = await postApi.getById(id);
        }
        
        if (postData) {
          setPost(postData);
          
          // Fetch all posts for recent & related
          const allPosts = await postApi.getAll();
          
          // Filter recent posts (excluding current post)
          const recent = (allPosts || []).filter(p => p.id !== postData.id).slice(0, 5);
          setRecentPosts(recent);
          
          // Filter related posts (same topic, excluding current post)
          const related = (allPosts || []).filter(p => p.id !== postData.id && p.topic?.id === postData.topic?.id).slice(0, 4);
          setRelatedPosts(related.length > 0 ? related : (allPosts || []).filter(p => p.id !== postData.id).slice(0, 4));
        }
      } catch (err) {
        console.error('Lỗi tải bài viết:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostAndRelated();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen pt-20"><Loading text="Đang tải bài viết..." /></div>;
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Title subtitle="Lỗi">Không tìm thấy bài viết</Title>
        <Link to="/posts" className="text-indigo-600 hover:text-indigo-500 font-bold">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen text-left">
      {/* Breadcrumbs */}
      <nav className="bg-white border border-slate-200 rounded-lg p-3 px-5 text-sm text-slate-500 shadow-sm flex items-center gap-2 mb-6">
        <Link to="/" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Trang chủ</Link>
        <span className="text-slate-300">/</span>
        <Link to="/posts" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Tin tức</Link>
        {post.topic && (
          <>
            <span className="text-slate-300">/</span>
            <Link to={`/posts?topicId=${post.topic.id}`} className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">{post.topic.name}</Link>
          </>
        )}
        <span className="text-slate-300">/</span>
        <span className="text-slate-400 truncate max-w-[200px] md:max-w-xs">{post.title}</span>
      </nav>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Post Content */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-950 italic leading-tight mb-2">
              {post.title}
            </h1>
            <p className="text-xs text-slate-400 italic">
              Đăng bởi: <span className="font-bold text-slate-500">Admin</span> - {formatDate(post.createdAt, { hour: undefined, minute: undefined })}
            </p>
          </div>

          {post.thumbnail && (
            <div className="w-full aspect-[21/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <img src={getImageUrl(post.thumbnail)} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Detailed Content */}
          <article 
            className="prose prose-slate max-w-none 
              prose-headings:text-indigo-950 prose-headings:font-bold 
              prose-h2:border-l-4 prose-h2:border-indigo-500 prose-h2:pl-3 prose-h2:text-xl prose-h2:mt-6 prose-h2:prose-headings:mb-4
              prose-h3:border-l-4 prose-h3:border-indigo-500 prose-h3:pl-3 prose-h3:text-lg prose-h3:mt-5 prose-h3:prose-headings:mb-3
              prose-p:text-slate-650 prose-p:leading-relaxed prose-p:mb-4 
              prose-li:text-slate-650 prose-li:mb-1
              prose-a:text-indigo-650 prose-a:no-underline hover:prose-a:text-indigo-500 hover:prose-a:underline
              prose-strong:text-slate-900 prose-strong:font-bold
              prose-img:rounded-xl prose-img:shadow-sm prose-img:border prose-img:border-slate-200"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span>Cảm ơn bạn đã đọc bài viết!</span>
            <Link to="/posts" className="text-indigo-600 hover:underline font-bold">Quay lại danh sách →</Link>
          </div>
        </div>

        {/* Right Column: Sidebar Widgets */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Widget 1: Bài viết mới nhất */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
            <h4 className="text-xs font-black tracking-wider text-indigo-950 uppercase border-b border-slate-100 pb-2 mb-3">
              Bài viết mới nhất
            </h4>
            <ul className="flex flex-col gap-2.5">
              {recentPosts.map(p => (
                <li key={p.id} className="border-b border-slate-100/60 pb-2.5 last:border-0 last:pb-0">
                  <Link 
                    to={`/post/${p.id}`} 
                    className="text-xs text-slate-600 hover:text-indigo-600 font-medium transition-colors line-clamp-2 leading-relaxed"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
              {recentPosts.length === 0 && (
                <span className="text-xs text-slate-400">Không có bài viết mới</span>
              )}
            </ul>
          </div>

          {/* Widget 2: Có thể bạn quan tâm */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
            <h4 className="text-xs font-black tracking-wider text-indigo-950 uppercase border-b border-slate-100 pb-2 mb-3">
              Có thể bạn quan tâm
            </h4>
            <ul className="flex flex-col gap-2.5">
              {relatedPosts.slice(0, 5).map(p => (
                <li key={p.id} className="border-b border-slate-100/60 pb-2.5 last:border-0 last:pb-0">
                  <Link 
                    to={`/post/${p.id}`} 
                    className="text-xs text-slate-600 hover:text-indigo-600 font-medium transition-colors line-clamp-2 leading-relaxed"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
              {relatedPosts.length === 0 && (
                <span className="text-xs text-slate-400">Đang cập nhật...</span>
              )}
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Section: Related Posts */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <h3 className="text-lg font-extrabold text-indigo-950 mb-6 flex items-center gap-2">
          Bài viết liên quan:
        </h3>
        
        {relatedPosts.length === 0 ? (
          <span className="text-sm text-slate-400">Không có bài viết liên quan.</span>
        ) : (
          <div className="relative group/carousel">
            {/* Grid display of related posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPosts.slice(0, 4).map(p => {
                const date = new Date(p.createdAt || Date.now());
                const day = String(date.getDate()).padStart(2, '0');
                const monthYear = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                
                return (
                  <div key={p.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
                    <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative shrink-0">
                      {/* Date Badge */}
                      <div className="absolute top-2 left-2 bg-indigo-600 text-white rounded p-1.5 px-2 flex flex-col items-center justify-center min-w-[36px] shadow-sm z-10 font-sans">
                        <span className="text-xs font-black leading-none">{day}</span>
                        <span className="text-[7px] mt-0.5 leading-none font-bold opacity-90">{monthYear}</span>
                      </div>
                      
                      <Link to={`/post/${p.id}`}>
                        <img 
                          src={getImageUrl(p.thumbnail, 'https://placehold.co/300x180?text=No+Image')} 
                          alt={p.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      </Link>
                    </div>
                    
                    <div className="p-4 flex flex-col flex-1">
                      <Link 
                        to={`/post/${p.id}`}
                        className="text-xs font-bold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-2"
                      >
                        {p.title}
                      </Link>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mt-auto">
                        {p.description || 'Chi tiết bài viết...'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Navigation controls (Arrows style like carousel) */}
            <button className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow hover:bg-slate-50 transition-colors opacity-0 group-hover/carousel:opacity-100 z-10">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow hover:bg-slate-50 transition-colors opacity-0 group-hover/carousel:opacity-100 z-10">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
