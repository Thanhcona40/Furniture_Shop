import React from 'react';
import { statusColor, statusLabel } from '../../../utils/orderConstants';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

const statusBg = {
  default: 'bg-gray-200 text-gray-800',
  primary: 'bg-blue-600 text-white',
  warning: 'bg-yellow-400 text-white',
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
};

const AdminOrderTable = ({ orders, loading, onViewDetail }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span>Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
        <thead>
          <tr>
            <th scope='col' className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Mã đơn</th>
            <th scope='col' className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Khách hàng</th>
            <th scope='col' className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Tổng tiền</th>
            <th scope='col' className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Trạng thái</th>
            <th scope='col' className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Ngày tạo</th>
            <th scope='col' className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map(order => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{order.order_code}</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.user_id?.full_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.total.toLocaleString('vi-VN')}đ</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusBg[statusColor[order.status]] || statusBg.default}`}>
                  {statusLabel[order.status] || order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button 
                  className="bg-blue-600 text-sm text-white rounded px-3 py-1 font-medium hover:bg-blue-700 transition flex items-center gap-2"
                  onClick={() => onViewDetail(order._id)}
                >
                  <RemoveRedEyeOutlinedIcon />
                  <span>Xem chi tiết</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderTable; 