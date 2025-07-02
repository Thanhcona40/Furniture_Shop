import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { statusColor, statusLabel } from './constants';

const AdminOrderTable = ({ orders, loading, onViewDetail }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <CircularProgress />
      </div>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã đơn</TableCell>
            <TableCell>Khách hàng</TableCell>
            <TableCell>Tổng tiền</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map(order => (
            <TableRow key={order._id}>
              <TableCell>{order.order_code}</TableCell>
              <TableCell>{order.user_id?.full_name}</TableCell>
              <TableCell>{order.total.toLocaleString('vi-VN')}đ</TableCell>
              <TableCell>
                <Chip 
                  label={statusLabel[order.status] || order.status} 
                  color={statusColor[order.status]} 
                  variant="filled" 
                  sx={{ fontWeight: 300, fontSize: 15 }} 
                />
              </TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleString('vi-VN')}</TableCell>
              <TableCell>
                <Button 
                  variant="contained" 
                  size="small" 
                  startIcon={<VisibilityIcon />} 
                  onClick={() => onViewDetail(order._id)}
                  sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 500, px: 2, py: 0.5 }}
                >
                  Xem chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminOrderTable; 