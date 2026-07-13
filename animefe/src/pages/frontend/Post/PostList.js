import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import postApi from '../../../api/postApi';
import topicApi from '../../../api/topicApi';
import Title from '../../../components/common/Title';
import Pagination from '../../../components/common/Pagination';
import Loading from '../../../components/common/Loading';
import { formatDate, getImageUrl } from '../../../utils';

const PostList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 0 });

  const page = Math.max(0, parseInt(searchParams.get('page') || '1', 10) - 1);
  const topicId = searchParams.get('topicId') || '';

  useEffect(() => {
    topicApi.getAll().then(res => setTopics(res || [])).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = { page, size: 9 };
        if (topicId) params.topicId = topicId;
        
        const res = await postApi.getAll(params);
        if (Array.isArray(res)) {
          // If it's a flat list, filter and paginate on client-side
          const filtered = topicId 
            ? res.filter(p => p.topic?.id === Number(topicId))
            : res;
          
          const size = 9;
          const start = page * size;
          const paginated = filtered.slice(start, start + size);
          
          setPosts(paginated);
          setPageData({ 
            page, 
            totalPages: Math.ceil(filtered.length / size) 
          });
        } else {
          // If it's a standard Page response
          setPosts(res.content || []);
          setPageData({ page: res.number, totalPages: res.totalPages });
        }
      } catch (err) {
        console.error('Lỗi tải bài viết:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page, topicId]);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const handleTopicClick = (id) => {
    if (id) {
      setSearchParams({ topicId: id, page: '1' });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-10 text-center">
        <Title subtitle="AnimeStore Blog" className="justify-center">Tin Tức & Khám Phá</Title>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <button
          onClick={() => handleTopicClick('')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${!topicId ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
        >
          Tất cả
        </button>
        {topics.map(topic => (
          <button
            key={topic.id}
            onClick={() => handleTopicClick(topic.id.toString())}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${topicId === topic.id.toString() ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            {topic.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20"><Loading text="Đang tải danh sách bài viết..." /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          Chưa có bài viết nào.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link key={post.id} to={`/post/${post.slug || post.id}`} className="group bg-[#110e2d]/60 border border-purple-900/30 rounded-2xl overflow-hidden shadow-xl hover:border-purple-500/50 transition-all hover:-translate-y-1">
                <div className="aspect-video bg-slate-900 overflow-hidden relative">
                  {post.topic && (
                    <span className="absolute top-3 left-3 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                      {post.topic.name}
                    </span>
                  )}
                  {post.thumbnail ? (
                     <img src={getImageUrl(post.thumbnail)} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <span className="text-slate-600">No Image</span>
                     </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-100 mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                    {post.description || 'Đang cập nhật...'}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-medium text-slate-500">
                      {formatDate(post.createdAt, { hour: undefined, minute: undefined })}
                    </span>
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1 group-hover:text-indigo-300">
                      Đọc tiếp
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {pageData.totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination currentPage={pageData.page + 1} totalPages={pageData.totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostList;
