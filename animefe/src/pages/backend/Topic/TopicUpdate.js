import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import topicApi from '../../../api/topicApi';
import TopicForm from '../../../components/backend/TopicForm';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

const TopicUpdate = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await topicApi.getById(id);
        setTopic(res);
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
      await topicApi.update(id, data);
      navigate('/admin/topics');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading text="Đang tải dữ liệu..." />;

  return (
    <div className="flex flex-col gap-6 max-w-xl text-left">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/topics')} className="px-3 py-2">
          ← Trở lại
        </Button>
        <Title size="sm">Cập nhật chủ đề</Title>
      </div>
      <TopicForm initialData={topic} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default TopicUpdate;
