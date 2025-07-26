import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const SimpleConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện thao tác này?',
  confirmText = 'Đồng ý',
  cancelText = 'Hủy',
  loading = false,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {message}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>{cancelText}</Button>
        <Button onClick={onConfirm} color="primary" variant="contained" disabled={loading}>
          {loading ? 
            <>
              <CircularProgress size={16} sx={{mr:1}} /> 
              Đang xử lý...
            </> : confirmText
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimpleConfirmDialog; 