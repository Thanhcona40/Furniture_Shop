import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { statusColor, statusLabel, nextStatus } from '../../../utils/orderConstants';

const OrderDetailModal = ({ 
  open, 
  onClose, 
  selectedOrder, 
  orderTrack, 
  modalLoading, 
  onUpdateStatus, 
  onCancelOrder 
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {selectedOrder ? `Chi tiết đơn hàng #${selectedOrder.order_code}` : 'Chi tiết đơn hàng'}
      </DialogTitle>
      <DialogContent dividers>
        {modalLoading || !selectedOrder ? (
          <div className="flex justify-center items-center h-40">
            <CircularProgress />
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <div className="font-semibold mb-2">Sản phẩm:</div>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 p-2 border rounded">
                    <img
                      src={item.variant_id?.url_media || item.product_id?.thumbnail_url}
                      alt={item.product_id?.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.product_id?.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.variant_id ? `${item.variant_id.color} - ${item.variant_id.dimensions}` : ''}
                      </div>
                      <div className="text-xs text-gray-500">Số lượng: {item.quantity}</div>
                    </div>
                    <div className="text-right font-medium">
                      {item.total.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-2 text-sm text-gray-600">
              <div>Địa chỉ giao: {selectedOrder.shipping_address?.detail || 'Đang tải...'}</div>
            </div>
            
            <div className="flex justify-between mt-4 text-base">
              <div>Tạm tính: {selectedOrder.subtotal.toLocaleString('vi-VN')}đ</div>
              <div>Phí vận chuyển: {selectedOrder.shipping_fee.toLocaleString('vi-VN')}đ</div>
              <div className="font-semibold text-primary">
                Tổng: {selectedOrder.total.toLocaleString('vi-VN')}đ
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-4">
              <Chip 
                label={statusLabel[selectedOrder.status] || selectedOrder.status} 
                color={statusColor[selectedOrder.status]} 
                variant="filled" 
                style={{ fontSize: 16 }} 
              />
              {nextStatus[selectedOrder.status] && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => onUpdateStatus(selectedOrder._id, selectedOrder.status)}
                >
                  Chuyển sang "{statusLabel[nextStatus[selectedOrder.status]]}"
                </Button>
              )}
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => onCancelOrder(selectedOrder._id)}
                >
                  Hủy đơn hàng
                </Button>
              )}
            </div>
            
            {/* Timeline trạng thái đơn hàng */}
            <div className="mt-6">
              <div className="font-semibold mb-2">Lịch sử trạng thái đơn hàng:</div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {orderTrack.length === 0 && <li>Chưa có lịch sử trạng thái.</li>}
                {orderTrack.map(track => (
                  <li key={track._id} className="mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {new Date(track.createdAt).toLocaleString('vi-VN')}
                      </span>
                      <Chip 
                        label={statusLabel[track.status] || track.status} 
                        color={statusColor[track.status]} 
                        size="small" 
                        variant="filled" 
                      />
                      <span className="text-xs text-gray-500">{track.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailModal; 