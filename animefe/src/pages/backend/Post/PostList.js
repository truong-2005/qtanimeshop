import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import postApi from '../../../api/postApi';
import topicApi from '../../../api/topicApi';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import SearchBox from '../../../components/common/SearchBox';
import SelectBox from '../../../components/common/SelectBox';
import Pagination from '../../../components/common/Pagination';
import Title from '../../../components/common/Title';
import { formatDate, getImageUrl } from '../../../utils';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search & Filter State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const navigate = useNavigate();

  // Load Topics & Posts
  const loadData = async () => {
    setIsLoading(true);
    try {
      const postsRes = await postApi.getAll();
      const topicsRes = await topicApi.getAll();
      setPosts(postsRes || []);
      setFilteredPosts(postsRes || []);
      setTopics(topicsRes || []);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu bài viết:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [...posts];

    if (searchKeyword) {
      result = result.filter(post => 
        (post.title || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (post.content || '').toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (topicFilter) {
      result = result.filter(post => String(post.topic?.id) === String(topicFilter));
    }

    setFilteredPosts(result);
    setCurrentPage(1);
  }, [searchKeyword, topicFilter, posts]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await postApi.delete(id);
        loadData();
      } catch (err) {
        console.error('Lỗi khi xóa bài viết:', err);
      }
    }
  };

  // Pagination bounds
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const headers = [
    { key: 'id', label: 'ID', sortable: false },
    { key: 'thumbnail', label: 'Ảnh' },
    { key: 'title', label: 'Tiêu đề' },
    { key: 'topic', label: 'Chủ đề' },
    { key: 'createdAt', label: 'Ngày tạo' },
    { key: 'actions', label: 'Thao tác' },
  ];

  const renderRow = (post) => (
    <tr key={post.id} className="hover:bg-slate-900/40 border-b border-slate-900 transition-colors text-slate-300">
      <td className="px-6 py-4 font-semibold text-slate-500">#{post.id}</td>
      <td className="px-6 py-4">
        <img
          src={getImageUrl(post.thumbnail, 'https://placehold.co/80x48?text=No+Image')}
          alt="Post thumbnail"
          className="w-16 h-10 object-cover rounded border border-slate-800 bg-slate-950"
        />
      </td>
      <td className="px-6 py-4">
        <div>
          <Link to={`/admin/posts/show/${post.id}`} className="font-bold text-slate-200 hover:text-indigo-400 transition-colors">
            {post.title}
          </Link>
          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{post.description || (post.content ? post.content.substring(0, 50) + '...' : 'Không có nội dung')}</p>
        </div>
      </td>
      <td className="px-6 py-4 font-semibold text-slate-400">
        {post.topic?.name || topics.find(t => String(t.id) === String(post.topic?.id))?.name || 'Chưa phân loại'}
      </td>
      <td className="px-6 py-4 text-xs text-slate-500">
        {post.createdAt ? formatDate(post.createdAt, { hour: undefined, minute: undefined }) : '-'}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/posts/edit/${post.id}`}
            className="p-1.5 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors"
            title="Chỉnh sửa"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={() => handleDelete(post.id)}
            className="p-1.5 rounded bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors"
            title="Xóa"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center">
        <Title subtitle="Quản lý danh sách các bài viết, tin tức anime">
          Bài viết
        </Title>
        <Button variant="primary" size="sm" onClick={() => navigate('/admin/posts/create')}>
          Thêm bài viết
        </Button>
      </div>

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/40 p-4 border border-slate-800/80 rounded-xl">
        <SearchBox placeholder="Tìm kiếm bài viết..." onSearch={setSearchKeyword} className="max-w-none" />
        <SelectBox
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          options={topics.map((t) => ({ value: t.id, label: t.name }))}
          placeholder="Lọc Chủ đề"
        />
      </div>

      <Table
        headers={headers}
        data={paginatedPosts}
        isLoading={isLoading}
        renderRow={renderRow}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PostList;
