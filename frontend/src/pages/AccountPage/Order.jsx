import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import { Tabs, Tab } from '@mui/material';
import { cancelOrderAction, fetchUserOrders } from '../../redux/actions/orderActions';
import { getProvinceNameById, getDistrictNameById, getWardNameById } from '../../api/address';
import { getOrderTrack } from '../../api/order';
import { ORDER_STATUS_TABS } from '../../utils/orderConstants';
import OrderTable from '../../components/order/OrderTable';
import OrderDetailModal from '../../components/order/OrderDetailModal';
import { statusColor, statusLabel } from '../../utils/orderConstants';

const Order = () => {
  const dispatch = useDispatch();
  const { orders, status: orderStatus, error } = useSelector((state) => state.order);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addressCache, setAddressCache] = useState({});
  const [orderTrack, setOrderTrack] = useState([]);
  const [status, setStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchUserOrders(status));
  }, [dispatch, status]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Khi orders thay đổi, lấy tên địa chỉ cho từng đơn
  useEffect(() => {
    if (!orders || orders.length === 0) return;
    orders.forEach(async (order) => {
      const { shipping_address } = order;
      if (!shipping_address) return;
      const detail = shipping_address.detail || '';
      const provinceId = shipping_address.province_id;
      const districtId = shipping_address.district_id;
      const wardId = shipping_address.ward_id;
      if (addressCache[order._id]) return;
      let province = '';
      let district = '';
      let ward = '';
      try {
        if (provinceId) {
          const res = await getProvinceNameById(provinceId);
          province = res.data?.name || '';
        }
        if (districtId) {
          const res = await getDistrictNameById(districtId);
          district = res.data?.name || '';
        }
        if (wardId) {
          const res = await getWardNameById(wardId);
          ward = res.data?.name || '';
        }
      } catch {}
      setAddressCache(prev => ({
        ...prev,
        [order._id]: [detail, ward, district, province].filter(Boolean).join(', ')
      }));
    });
    // eslint-disable-next-line
  }, [orders]);

  const getPaymentText = (order) => {
    if (order.payment_status) {
      if (order.payment_status === 'paid') return 'Đã thanh toán';
      if (order.payment_status === 'unpaid') return 'Chưa thanh toán';
    }
    if (order.payment_method === 'bank') return 'Đã thanh toán';
    return 'Chưa thanh toán';
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await dispatch(cancelOrderAction(orderId)).unwrap();
      message.success('Hủy đơn hàng thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi hủy đơn hàng!');
    }
  };

  const handleShowDetail = async (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
    try {
      const track = await getOrderTrack(order._id);
      setOrderTrack(track);
    } catch {
      setOrderTrack([]);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  if (orderStatus === 'loading') {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
      
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
      
      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Bạn chưa có đơn hàng nào.</div>
      ) : (
        <OrderTable
          orders={orders}
          addressCache={addressCache}
          onShowDetail={handleShowDetail}
          onCancelOrder={handleCancelOrder}
          getStatusColor={(status) => statusColor[status] || 'default'}
          getStatusText={(status) => statusLabel[status] || status}
          getPaymentText={getPaymentText}
        />
      )}
      <OrderDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
        address={selectedOrder ? addressCache[selectedOrder._id] : ''}
        orderTrack={orderTrack}
      />
    </div>
  );
};

export default Order;