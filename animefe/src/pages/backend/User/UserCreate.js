import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../../api/userApi';
import UserForm from '../../../components/backend/UserForm';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';

const UserCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      await userApi.create(data);
      navigate('/admin/users');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/users')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Tạo thành viên mới</Title>
      </div>
      <UserForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default UserCreate;
