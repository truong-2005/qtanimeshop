import React, { useState } from 'react';
import userApi from '../../../api/userApi';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!oldPassword) err.oldPassword = 'Mật khẩu cũ là bắt buộc';
    if (!newPassword || newPassword.length < 6) err.newPassword = 'Mật khẩu mới phải dài từ 6 ký tự';
    if (newPassword !== confirmPassword) err.confirmPassword = 'Xác nhận mật khẩu không trùng khớp';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await userApi.changePassword({ oldPassword, newPassword });
      alert('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      alert('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-md">
      <Title subtitle="Đổi mật khẩu tài khoản quản trị">Đổi mật khẩu</Title>
      
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-4">
        <Input
          label="Mật khẩu cũ"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          error={errors.oldPassword}
        />
        <Input
          label="Mật khẩu mới"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.newPassword}
        />
        <Input
          label="Xác nhận mật khẩu mới"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />
        <div className="flex justify-end pt-2 border-t border-slate-800 mt-2">
          <Button type="submit" variant="primary" isLoading={isLoading}>Lưu mật khẩu mới</Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
