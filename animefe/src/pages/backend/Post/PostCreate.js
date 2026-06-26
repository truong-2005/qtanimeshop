import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import postApi from '../../../api/postApi';
import topicApi from '../../../api/topicApi';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import SelectBox from '../../../components/common/SelectBox';
import Loading from '../../../components/common/Loading';

const PostCreate = () => {
  const [topics, setTopics] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    topicId: '',
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await topicApi.getAll();
        setTopics(res || []);
      } catch (err) {
        console.error('Failed to load topics:', err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchTopics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
    if (!formData.topicId) newErrors.topicId = 'Vui lòng chọn chủ đề';
    if (!formData.content.trim()) newErrors.content = 'Nội dung bài viết là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await postApi.create({
        title: formData.title,
        content: formData.content,
        topic: {
          id: Number(formData.topicId)
        }
      });
      navigate('/admin/posts');
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading text="Đang tải dữ liệu cấu hình..." />;

  return (
    <div className="flex flex-col gap-6 text-left max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/posts')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Tạo bài viết mới</Title>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tiêu đề bài viết"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Nhập tiêu đề..."
            required
          />

          <SelectBox
            label="Chủ đề"
            name="topicId"
            value={formData.topicId}
            onChange={handleChange}
            options={topics.map((t) => ({ value: t.id, label: t.name }))}
            placeholder="-- Chọn chủ đề --"
            error={errors.topicId}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-400">Nội dung chi tiết</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            placeholder="Viết nội dung bài viết ở đây..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-600 outline-none transition-all text-sm resize-y font-mono"
            required
          />
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/posts')}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Tạo bài viết
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostCreate;
