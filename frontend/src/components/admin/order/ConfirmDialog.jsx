import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { statusLabel } from './constants';

const ConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  confirmType, 
  pendingStatus 
}) => {
  const getMessage = () => {
    if (confirmType === 'cancel') {
      return 'Bạn có chắc muốn hủy đơn hàng này không?';
    }
    return `Bạn có chắc muốn chuyển trạng thái sang "${statusLabel[pendingStatus?.status] || ''}" không?`;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận cập nhật trạng thái?</DialogTitle>
      <DialogContent>
        {getMessage()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 