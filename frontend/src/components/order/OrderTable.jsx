import React from 'react';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const OrderTable = ({ orders, addressCache, onShowDetail, onCancelOrder, getStatusColor, getStatusText, getPaymentText }) => {
  return (
    <div className="overflow-x-auto">
      <TableContainer component={Paper} sx={{ border: '1px solid #d1d5db' }}>
        <Table>
          <TableHead>
            <TableRow className='bg-primary'>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', border: '1px solid #d1d5db', padding: '8px 16px',textAlign: 'center' }}>
                Mã đơn
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', border: '1px solid #d1d5db', padding: '8px 16px', textAlign: 'center' }}>
                Ngày tạo
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', border: '1px solid #d1d5db', padding: '8px 16px', textAlign: 'center' }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', border: '1px solid #d1d5db', padding: '8px 16px', textAlign: 'center' }}>
                TT thanh toán
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', border: '1px solid #d1d5db', padding: '8px 16px', textAlign: 'center' }}>
                Tổng tiền
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', border: '1px solid #d1d5db', padding: '8px 16px', textAlign: 'center' }}>
                Địa chỉ giao
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', border: '1px solid #d1d5db', padding: '8px 16px', textAlign: 'center' }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                <TableCell sx={{ fontWeight: 'medium', textAlign: 'center', border: '1px solid #d1d5db', padding: '8px 16px', color: 'blue' }}>
                  #{order.order_code}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', border: '1px solid #d1d5db', padding: '8px 16px' }}>
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', border: '1px solid #d1d5db', padding: '8px 16px' }}>
                  <Chip 
                    label={getStatusText(order.status)} 
                    color={getStatusColor(order.status)} 
                    variant="filled"
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', border: '1px solid #d1d5db', padding: '8px 16px' }}>
                  {getPaymentText(order)}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', border: '1px solid #d1d5db', padding: '8px 16px' }}>
                  {order.total.toLocaleString('vi-VN')}đ
                </TableCell>
                <TableCell sx={{ textAlign: 'center', border: '1px solid #d1d5db', padding: '8px 16px' }}>
                  {addressCache[order._id] || order.shipping_address.detail || 'Đang tải...'}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', border: '1px solid #d1d5db', padding: '8px 16px' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <Button 
                        variant="outlined" 
                        color="error" 
                        size="small" 
                        onClick={() => onCancelOrder(order._id)}
                        sx={{ 
                          minWidth: '60px',
                          height: '28px',
                          fontSize: '0.75rem',
                          textTransform: 'none',
                          borderRadius: '4px'
                        }}
                      >
                        Hủy
                      </Button>
                    )}
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small" 
                      onClick={() => onShowDetail(order)}
                      sx={{ 
                        minWidth: '50px',
                        height: '28px',
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        borderRadius: '4px'
                      }}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrderTable; 