import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import menuApi from '../../../api/menuApi';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Loading from '../../../components/common/Loading';

const MenuUpdate = () => {
  const { id } = useParams();
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Form State matching OpenAPI Menu spec
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    sortOrder: 0,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const detail = await menuApi.getById(id);
        if (detail) {
          setFormData({
            name: detail.name || '',
            link: detail.link || '',
            sortOrder: detail.sortOrder || 0,
          });
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết menu:', err);
      } finally {
        setIsFetching(false);
      }
    };
    loadDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên menu là bắt buộc';
    if (!formData.link.trim()) newErrors.link = 'Đường dẫn liên kết là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await menuApi.update(id, {
        name: formData.name,
        link: formData.link,
        sortOrder: Number(formData.sortOrder),
      });
      navigate('/admin/menus');
    } catch (err) {
      console.error('Lỗi cập nhật menu:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading text="Đang tải dữ liệu menu..." />;

  return (
    <div className="flex flex-col gap-6 text-left max-w-xl">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/menus')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Cập nhật Menu</Title>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-5">
        <Input
          label="Tên Menu"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Ví dụ: Trang chủ, Khuyến mãi"
          required
        />

        <Input
          label="Liên kết (Link)"
          name="link"
          value={formData.link}
          onChange={handleChange}
          error={errors.link}
          placeholder="Ví dụ: /, /san-pham, /khuyen-mai"
          required
        />

        <Input
          label="Thứ tự sắp xếp (sortOrder)"
          name="sortOrder"
          type="number"
          value={formData.sortOrder}
          onChange={handleChange}
          placeholder="0"
        />

        <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/menus')}>
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

export default MenuUpdate;
