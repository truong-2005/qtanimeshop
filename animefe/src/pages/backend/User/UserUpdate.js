import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userApi from '../../../api/userApi';
import UserForm from '../../../components/backend/UserForm';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

const UserUpdate = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await userApi.getById(id);
        setUser(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      await userApi.update(id, data);
      navigate('/admin/users');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading text="Đang tải dữ liệu..." />;

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/users')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Cập nhật tài khoản</Title>
      </div>
      <UserForm initialData={user} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default UserUpdate;
