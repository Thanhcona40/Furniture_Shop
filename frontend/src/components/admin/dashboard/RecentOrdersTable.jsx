import React from 'react';
import { statusColor, statusLabel } from '../../../utils/orderConstants';
import { Chip } from '@mui/material';

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
                <Chip
                  label={statusLabel[order.status]}
                  color={statusColor[order.status]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

export default RecentOrdersTable;
