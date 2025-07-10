import React from 'react';
import { Button, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const OrderSummary = ({
  selectedCartItems = [],
  subtotal = 0,
  shippingFee = 0,
  total = 0,
  loading = false,
  onPlaceOrder,
  shippingAddress,
  navigate
}) => (
  <div className="space-y-6 bg-gray-100 h-screen">
    <div className="p-6 font-bold">
      <h2 className="text-xl mb-4">
        Đơn hàng (
        {selectedCartItems.length > 0 ? `${selectedCartItems.length}` : ''}
        <span className=""> sản phẩm)</span>
      </h2>
      {/* Danh sách sản phẩm */}
      <div className="space-y-3 mb-4">
        {selectedCartItems.map((item) => (
          <div key={item._id} className="flex items-center space-x-3">
            <img
              src={item.variant_id?.url_media || item.product_id?.thumbnail_url}
              alt={item.product_id?.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-medium text-sm">{item.product_id?.name}</h3>
              <p className="text-xs text-gray-500">
                {item.variant_id ? `${item.variant_id.color} - ${item.variant_id.dimensions}` : 'Không có biến thể'}
              </p>
              <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm">
                {((item.variant_id?.price || item.product_id?.price) * item.quantity).toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>
        ))}
      </div>
      <Divider />
      {/* Tổng tiền */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Tạm tính:</span>
          <span>{subtotal.toLocaleString('vi-VN')}đ</span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển:</span>
          <span>{shippingFee.toLocaleString('vi-VN')}đ</span>
        </div>
        <Divider />
        <div className="flex justify-between text-lg font-semibold">
          <span>Tổng cộng:</span>
          <span className="text-primary">{total.toLocaleString('vi-VN')}đ</span>
        </div>
      </div>
      <div className='flex justify-between items-center mt-4 gap-4 '>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/cart')}
          className=""
        >
          Quay lại giỏ hàng
        </Button>
        {/* Nút đặt hàng */}
        <Button
          type="primary"
          size="large"
          loading={loading}
          onClick={onPlaceOrder}
          className="px-10"
          disabled={!shippingAddress}
        >
          Đặt hàng
        </Button>
      </div>
    </div>
  </div>
);

export default OrderSummary; 