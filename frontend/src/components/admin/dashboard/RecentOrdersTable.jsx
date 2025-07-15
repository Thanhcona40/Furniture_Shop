import React from 'react';
import { statusColor, statusLabel, statusBg } from '../../../utils/orderConstants';

const RecentOrdersTable = ({ orders }) => (
    <div className="bg-white rounded shadow p-4">
      <div className="font-semibold mb-2">Đơn hàng mới nhất</div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Mã đơn</th>
            <th className="text-left">Khách hàng</th>
            <th className="text-left">Tổng tiền</th>
            <th className="text-left">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={order._id || idx} className="border-t">
              <td>{order.order_code}</td>
              <td>{order.user_id?.full_name || 'Ẩn danh'}</td>
              <td>{order.total?.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</td>
              <td>
                <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusBg[statusColor[order.status]] || statusBg.default}`}>
                  {statusLabel[order.status] || order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

export default RecentOrdersTable;
