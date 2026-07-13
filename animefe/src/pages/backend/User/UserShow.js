import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userApi from '../../../api/userApi';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { getImageUrl } from '../../../utils';

const UserShow = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await userApi.getById(id);
        setUser(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) return <Loading />;
  if (!user) return <div className="text-slate-400">Không tìm thấy thông tin tài khoản</div>;

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 max-w-md text-left flex flex-col gap-4">
      <h3 className="text-lg font-bold text-white">Chi tiết thành viên</h3>
      <div className="flex flex-col gap-2 text-sm text-slate-300">
        <p><span className="font-semibold text-slate-500">ID:</span> #{user.id}</p>
        <p><span className="font-semibold text-slate-500">Tên tài khoản:</span> {user.username}</p>
        <p><span className="font-semibold text-slate-500">Họ và tên:</span> {user.fullName}</p>
        <p><span className="font-semibold text-slate-500">Email:</span> {user.email}</p>
        <p><span className="font-semibold text-slate-500">Số điện thoại:</span> {user.phone}</p>
        {user.avatar && (
          <div className="mb-2">
            <img 
              src={getImageUrl(user.avatar)} 
              alt={user.username} 
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-700"
            />
          </div>
        )}
        <p><span className="font-semibold text-slate-500">Quyền:</span> {user.role}</p>
        <p><span className="font-semibold text-slate-500">Giới tính:</span> {user.gender}</p>
      </div>
      <Button variant="secondary" onClick={() => navigate('/admin/users')} className="mt-4">
        Trở lại
      </Button>
    </div>
  );
};

export default UserShow;
