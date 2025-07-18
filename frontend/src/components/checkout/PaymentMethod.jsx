import React from 'react';
import { Radio, Space } from 'antd';

const PaymentMethod = ({ value, onChange }) => (
  <Radio.Group value={value} onChange={onChange} className="w-full">
    <Space direction="vertical" className="w-full">
      <Radio value="cod" className="w-full">
        <div>
          <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
          <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
        </div>
      </Radio>
      <Radio value="bank" className="w-full">
        <div>
          <div className="font-medium">Thanh toán online qua VNPAY</div>
          <div className="text-sm text-gray-500">Chuyển khoản, quét mã QR, thẻ ATM, Visa/MasterCard, ...</div>
        </div>
      </Radio>
    </Space>
  </Radio.Group>
);

export default PaymentMethod; 