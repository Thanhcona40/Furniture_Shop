import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const statusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

const UserOrderStatusModal = ({ open, onClose, user, orderStatusCount }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Đơn hàng của {user?.name || user?.full_name || 'Người dùng'}</DialogTitle>
      <DialogContent>
        {orderStatusCount ? (
          <div className="flex flex-col gap-2 mt-2">
            {Object.keys(statusLabels).map((status) => (
              <div key={status} className="flex justify-between items-center border-b pb-1">
                <span>{statusLabels[status]}</span>
                <span className="font-bold text-blue-600">{orderStatusCount[status]}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center"><CircularProgress size={20} /></div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserOrderStatusModal; 