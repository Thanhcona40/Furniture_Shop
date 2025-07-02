import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { getAllOrders, getOrderById, getOrderTrack, updateOrderStatus } from '../../../api/order';
import AdminOrderTable from './AdminOrderTable';
import OrderDetailModal from './OrderDetailModal';
import ConfirmDialog from './ConfirmDialog';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderTrack, setOrderTrack] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [pendingStatus, setPendingStatus] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        setSnackbar({ open: true, message: 'Lỗi tải danh sách đơn hàng', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleViewDetail = async (orderId) => {
    setModalLoading(true);
    setModalOpen(true);
    try {
      const [order, track] = await Promise.all([
        getOrderById(orderId),
        getOrderTrack(orderId)
      ]);
      setSelectedOrder(order);
      setOrderTrack(track);
    } catch (err) {
      setSnackbar({ open: true, message: 'Lỗi tải chi tiết đơn hàng', severity: 'error' });
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateStatus = (orderId, currentStatus) => {
    const nextStatus = {
      pending: 'confirmed',
      confirmed: 'shipping',
      shipping: 'delivered',
    };
    const next = nextStatus[currentStatus];
    if (!next) return;
    setPendingStatus({ orderId, status: next });
    setConfirmType('update');
    setConfirmOpen(true);
  };

  const handleCancelOrder = (orderId) => {
    setPendingStatus({ orderId, status: 'cancelled' });
    setConfirmType('cancel');
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    if (!pendingStatus) return;
    try {
      await updateOrderStatus(pendingStatus.orderId, pendingStatus.status);
      setSnackbar({ open: true, message: 'Cập nhật trạng thái thành công!', severity: 'success' });
      handleViewDetail(pendingStatus.orderId);
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Cập nhật trạng thái thất bại!', severity: 'error' });
    } finally {
      setPendingStatus(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý Đơn hàng</h1>
      
      <AdminOrderTable 
        orders={orders} 
        loading={loading} 
        onViewDetail={handleViewDetail} 
      />

      <OrderDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedOrder={selectedOrder}
        orderTrack={orderTrack}
        modalLoading={modalLoading}
        onUpdateStatus={handleUpdateStatus}
        onCancelOrder={handleCancelOrder}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        confirmType={confirmType}
        pendingStatus={pendingStatus}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OrderManagement; 