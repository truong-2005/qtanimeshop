import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import topicApi from '../../../api/topicApi';
import TopicForm from '../../../components/backend/TopicForm';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';

const TopicCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      await topicApi.create(data);
      navigate('/admin/topics');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl text-left">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/topics')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Tạo chủ đề mới</Title>
      </div>
      <TopicForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default TopicCreate;
