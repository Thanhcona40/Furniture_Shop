import React from 'react';
import { Modal } from 'antd';
import OrderProductList from './OrderProductList';
import OrderDetailInfo from './OrderDetailInfo';

const OrderDetailModal = ({ open, onClose, order, address, orderTrack = [] }) => {
  if (!order) return null;
  return (
    <Modal
      title={`Chi tiết đơn hàng #${order._id?.slice(-8)}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div>
        <OrderProductList items={order.items} />
        <OrderDetailInfo
          address={address}
          shippingAddress={order.shipping_address}
          subtotal={order.subtotal}
          shippingFee={order.shipping_fee}
          total={order.total}
          orderTrack={orderTrack}
        />
      </div>
    </Modal>
  );
};

export default OrderDetailModal; 