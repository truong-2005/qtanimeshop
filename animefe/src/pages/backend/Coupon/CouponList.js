import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import couponApi from '../../../api/couponApi';
import Title from '../../../components/common/Title';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { toast } from 'react-toastify';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await couponApi.getAll();
      setCoupons(res);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải mã giảm giá');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xóa mã giảm giá này?')) {
      try {
        await couponApi.remove(id);
        toast.success('Đã xóa mã giảm giá');
        loadCoupons();
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi xóa mã giảm giá');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Title subtitle="Quản lý các mã giảm giá cho khách hàng">
          Mã Giảm Giá
        </Title>
        <Button onClick={() => navigate('/admin/coupons/create')}>
          + Tạo mã mới
        </Button>
      </div>

      <div className="bg-slate-900/40 p-4 border border-slate-800/80 rounded-xl overflow-x-auto">
        {isLoading ? (
          <Loading text="Đang tải..." />
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Loại</th>
                <th className="px-4 py-3">Giá trị</th>
                <th className="px-4 py-3">Đã dùng/Tối đa</th>
                <th className="px-4 py-3">Ngày bắt đầu</th>
                <th className="px-4 py-3">Ngày kết thúc</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((item) => (
                <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="px-4 py-3 font-semibold text-blue-400">{item.code}</td>
                  <td className="px-4 py-3">
                    {item.discountType === 'PERCENT' ? '%' : 'VND'}
                  </td>
                  <td className="px-4 py-3">
                    {item.discountType === 'PERCENT' ? `${item.discountValue}%` : `${item.discountValue.toLocaleString()}đ`}
                  </td>
                  <td className="px-4 py-3">
                    {item.usedCount} / {item.quantity || '∞'}
                  </td>
                  <td className="px-4 py-3">
                    {item.startDate ? new Date(item.startDate).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {item.endDate ? new Date(item.endDate).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {item.active ? (
                      <span className="text-emerald-400">Hoạt động</span>
                    ) : (
                      <span className="text-rose-400">Đã khóa</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-rose-400 hover:text-rose-300 font-medium"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                    Chưa có mã giảm giá nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CouponList;
