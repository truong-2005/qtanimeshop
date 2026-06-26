import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import topicApi from '../../../api/topicApi';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { formatDate } from '../../../utils';

const TopicShow = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await topicApi.getById(id);
        setTopic(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) return <Loading />;
  if (!topic) return <div className="text-slate-400">Không tìm thấy chủ đề</div>;

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 max-w-md text-left flex flex-col gap-4">
      <h3 className="text-lg font-bold text-white">Chi tiết chủ đề</h3>
      <div className="flex flex-col gap-2 text-sm text-slate-300">
        <p><span className="font-semibold text-slate-500">ID:</span> #{topic.id}</p>
        <p><span className="font-semibold text-slate-500">Tên chủ đề:</span> {topic.name}</p>
        <p><span className="font-semibold text-slate-500">Ngày tạo:</span> {formatDate(topic.createdAt)}</p>
      </div>
      <Button variant="secondary" onClick={() => navigate('/admin/topics')} className="mt-4">
        Trở lại
      </Button>
    </div>
  );
};

export default TopicShow;
