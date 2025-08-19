import React from 'react';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { statusColor, statusLabel } from '../../utils/orderConstants';
import { formatAddress } from '../../utils/formatAddress';

const OrderDetailInfo = ({ shippingAddress, subtotal, shippingFee, total, orderTrack = [] }) => (
  <>
    <div className="mb-2 text-sm text-gray-600">
      <div>
        Địa chỉ giao: { formatAddress(shippingAddress)|| <CircularProgress size={16} />}
      </div>
    </div>
    <div className="flex justify-between mt-4 text-base">
      <div>Tạm tính: {subtotal.toLocaleString('vi-VN')}đ</div>
      <div>Phí vận chuyển: {shippingFee.toLocaleString('vi-VN')}đ</div>
      <div className="font-semibold text-primary">Tổng: {total.toLocaleString('vi-VN')}đ</div>
    </div>
    <div className="mt-6">
      <div className="font-semibold mb-2">Lịch sử trạng thái đơn hàng:</div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {orderTrack.length === 0 && <li>Chưa có lịch sử trạng thái.</li>}
        {orderTrack.map(track => (
          <li key={track._id} className="mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{new Date(track.createdAt).toLocaleString('vi-VN')}</span>
              <Chip label={statusLabel[track.status] || track.status} color={statusColor[track.status]} size="small" variant="filled" />
              <span className="text-xs text-gray-500">{track.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </>
);

export default OrderDetailInfo; 