import React from 'react';

const OrderProductList = ({ items }) => (
  <div className="mb-4">
    <div className="font-semibold mb-2">Sản phẩm:</div>
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item._id} className="flex items-center gap-3 p-2 border rounded">
          <img
            src={item.variant_id?.url_media || item.product_id?.thumbnail_url}
            alt={item.product_id?.name}
            className="w-14 h-14 object-cover rounded"
          />
          <div className="flex-1">
            <div className="font-medium">{item.product_id?.name}</div>
            <div className="text-xs text-gray-500">{item.variant_id?.color} - {item.variant_id?.dimensions}</div>
            <div className="text-xs text-gray-500">Số lượng: {item.quantity}</div>
          </div>
          <div className="text-right font-medium">{item.total.toLocaleString('vi-VN')}đ</div>
        </div>
      ))}
    </div>
  </div>
);

export default OrderProductList; 