import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Tabs, Tab } from '@mui/material'
import { getAllOrders, getOrderById, getOrderTrack, updateOrderStatus } from '../../../api/order';
import { ORDER_STATUS_TABS } from '../../../utils/orderConstants';
import AdminOrderTable from './AdminOrderTable';
import OrderDetailModal from './OrderDetailModal';
import ConfirmDialog from './ConfirmDialog';
import OrderFilterBar from './OrderFilterBar';

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
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' hoặc 'asc'

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getAllOrders(status);
        setOrders(data);
      } catch (err) {
        setSnackbar({ open: true, message: 'Lỗi tải danh sách đơn hàng', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [status]);

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

  // Lọc, tìm kiếm, sắp xếp orders
  const filteredOrders = orders
    .filter(order => {
      // Tìm kiếm theo mã đơn hoặc tên khách hàng
      const searchText = search.trim().toLowerCase();
      if (!searchText) return true;
      const codeMatch = order.order_code?.toLowerCase().includes(searchText);
      const nameMatch = order.user_id?.full_name?.toLowerCase().includes(searchText);
      return codeMatch || nameMatch;
    })
    .filter(order => {
      // Lọc theo ngày (nếu có chọn ngày)
      if (!dateFilter) return true;
      const created = new Date(order.createdAt);
      const selected = new Date(dateFilter);
      // So sánh ngày/tháng/năm, bỏ qua giờ phút giây
      return created.getFullYear() === selected.getFullYear() &&
        created.getMonth() === selected.getMonth() &&
        created.getDate() === selected.getDate();
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Khi bấm nút hoặc Enter mới lọc
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý Đơn hàng</h1>
      <OrderFilterBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      
      <Tabs
        value={status}
        onChange={(e, newValue) => setStatus(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {ORDER_STATUS_TABS.map(tab => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      
      <AdminOrderTable 
        orders={filteredOrders} 
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