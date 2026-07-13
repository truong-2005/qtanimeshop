import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import postApi from '../../../api/postApi';
import topicApi from '../../../api/topicApi';
import uploadService from '../../../services/uploadService';
import { getImageUrl } from '../../../utils';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import SelectBox from '../../../components/common/SelectBox';
import Loading from '../../../components/common/Loading';

const PostUpdate = () => {
  const { id } = useParams();
  const [topics, setTopics] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    topicId: '',
    description: '',
    thumbnail: '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadPostAndTopics = async () => {
      try {
        const postRes = await postApi.getById(id);
        const topicsRes = await topicApi.getAll();
        setTopics(topicsRes || []);
        
        if (postRes) {
          setFormData({
            title: postRes.title || '',
            content: postRes.content || '',
            topicId: postRes.topic?.id || '',
            description: postRes.description || '',
            thumbnail: postRes.thumbnail || '',
          });
          if (postRes.thumbnail) {
            setImagePreview(getImageUrl(postRes.thumbnail));
          }
        }
      } catch (err) {
        console.error('Failed to load post/topics details:', err);
      } finally {
        setIsFetching(false);
      }
    };
    loadPostAndTopics();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = uploadService.validateImage(file);
      if (!validation.valid) {
        setErrors((prev) => ({ ...prev, thumbnail: validation.message }));
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setIsUploading(true);
      try {
        const res = await uploadService.uploadFile(file);
        if (res && res.message) {
          const uploadedPath = `/uploads/${res.message}`;
          setFormData((prev) => ({ ...prev, thumbnail: uploadedPath }));
          setErrors((prev) => ({ ...prev, thumbnail: '' }));
        }
      } catch (err) {
        console.error('Upload failed:', err);
        setErrors((prev) => ({ ...prev, thumbnail: 'Không thể upload hình ảnh lên server' }));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
    if (!formData.topicId) newErrors.topicId = 'Vui lòng chọn chủ đề';
    if (!formData.description.trim()) newErrors.description = 'Mô tả ngắn là bắt buộc';
    if (!formData.thumbnail) newErrors.thumbnail = 'Ảnh đại diện là bắt buộc';
    if (!formData.content.trim()) newErrors.content = 'Nội dung bài viết là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await postApi.update(id, {
        title: formData.title,
        content: formData.content,
        description: formData.description,
        thumbnail: formData.thumbnail,
        topic: {
          id: Number(formData.topicId)
        }
      });
      navigate('/admin/posts');
    } catch (err) {
      console.error('Failed to update post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading text="Đang tải dữ liệu bài viết..." />;

  return (
    <div className="flex flex-col gap-6 text-left max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/posts')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Chỉnh sửa bài viết</Title>
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
          <label className="text-sm font-semibold text-slate-400">Mô tả ngắn</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Nhập mô tả ngắn tóm tắt nội dung..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-600 outline-none transition-all text-sm resize-y"
            required
          />
          {errors.description && <span className="text-xs text-rose-500">{errors.description}</span>}
        </div>

        {/* Thumbnail Image Upload */}
        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-slate-300">Hình ảnh đại diện (Thumbnail)</label>
          <div className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 min-h-[200px] text-center transition-all ${
            errors.thumbnail ? 'border-rose-500/50 bg-rose-950/5' : 'border-slate-800 bg-slate-950/20 hover:border-indigo-500/50'
          }`}>
            {imagePreview ? (
              <div className="relative w-full max-w-md flex flex-col gap-3">
                <img
                  src={imagePreview}
                  alt="Post preview"
                  className="w-full h-48 object-cover rounded-lg border border-slate-800 shadow"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                    setFormData((prev) => ({ ...prev, thumbnail: '' }));
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-rose-500 hover:bg-slate-950 transition-colors shadow"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-8">
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-indigo-400">Đang tải ảnh lên...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-10 h-10 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-semibold text-slate-400">Chọn hoặc kéo thả ảnh vào đây</span>
                    <span className="text-[10px] text-slate-600 mt-1">Hỗ trợ JPG, PNG, WEBP, GIF (Tối đa 5MB)</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            )}
          </div>
          {errors.thumbnail && (
            <span className="text-xs text-rose-500 mt-1">{errors.thumbnail}</span>
          )}
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
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostUpdate;
