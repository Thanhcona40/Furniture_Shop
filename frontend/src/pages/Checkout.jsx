import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Divider, Radio, Space, message, Modal } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import AddressForm from '../components/profile/AddressForm';
import { createOrderAction } from '../redux/actions/orderActions';
import { removeCartItemsAction } from '../redux/actions/cartActions';
import { getDefaultAddress } from '../api/address';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { status, error, currentOrder } = useSelector((state) => state.order);
  
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);

  // Lấy danh sách sản phẩm được chọn từ Cart
  const selectedItemIds = location.state?.selectedItems || [];
  const selectedCartItems = cartItems.filter(item => selectedItemIds.includes(item._id));

  // Tính tổng tiền chỉ cho các sản phẩm được chọn
  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.quantity * (item.variant_id?.price || 0),
    0
  );
  const shippingFee = 30000; // Phí vận chuyển cố định
  const total = subtotal + shippingFee;

  // Kiểm tra xem có sản phẩm được chọn không
  useEffect(() => {
    if (selectedCartItems.length === 0) {
      message.warning('Không có sản phẩm nào được chọn!');
      navigate('/cart');
    }
  }, [selectedCartItems, navigate]);

  // Kiểm tra đăng nhập
  useEffect(() => {
    if (!user) {
      message.error('Bạn cần đăng nhập để thanh toán!');
      navigate('/login');
    }
  }, [user, navigate]);

  // Xử lý kết quả đặt hàng
  useEffect(() => {
    if (status === 'succeeded' && currentOrder && !loading) {
      toast.success(`Bạn đã đặt hàng thành công! Đây là mã đơn hàng: ${currentOrder.order_code}`);
      dispatch(removeCartItemsAction(selectedItemIds));
      navigate('/');
    }
    if (status === 'failed' && error) {
      message.error(error);
    }
  }, [status, error, loading, currentOrder, dispatch, selectedItemIds, navigate]);

  useEffect(() => {
    if (user?._id) {
      getDefaultAddress()
        .then(res => setDefaultAddress(res.data))
        .catch(() => setDefaultAddress(null));
    }
  }, [user]);

  const handleAddressChange = (address) => {
    setShippingAddress(address);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      message.error('Vui lòng nhập địa chỉ giao hàng!');
      return;
    }

    if (!shippingAddress.full_name || !shippingAddress.phone || !shippingAddress.detail) {
      message.error('Vui lòng điền đầy đủ thông tin địa chỉ!');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: selectedCartItems.map(item => ({
          product_id: item.product_id._id,
          variant_id: item.variant_id._id,
          quantity: item.quantity,
          price: item.variant_id?.price || item.product_id.price
        })),
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        subtotal,
        shipping_fee: shippingFee,
        total
      };

      await dispatch(createOrderAction(orderData)).unwrap();
    } catch (error) {
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || selectedCartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Địa chỉ + Phương thức thanh toán (ngang hàng ở desktop) */}
          <div className="lg:col-span-2">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Địa chỉ giao hàng */}
              <div className="flex-1 bg-white p-6">
                <div className="flex items-center mb-4">
                  <span className="text-blue-600 mr-2">
                    <ShoppingCartOutlined />
                  </span>
                  <h2 className="text-lg font-semibold">Thông tin giao hàng</h2>
                </div>
                <div className="space-y-3">
                  <AddressForm 
                    onChange={handleAddressChange}
                    defaultAddress={defaultAddress}
                  />
                </div>
              </div>
              {/* Phương thức thanh toán */}
              <div className="flex-1 bg-white p-6">
                <div className="flex items-center mb-4">
                  <span className="text-blue-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 18.75v-12z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5" />
                    </svg>
                  </span>
                  <h2 className="text-lg font-semibold">Phương thức thanh toán</h2>
                </div>
                <Radio.Group value={paymentMethod} onChange={handlePaymentMethodChange} className="w-full">
                  <Space direction="vertical" className="w-full">
                    <Radio value="cod" className="w-full">
                      <div>
                        <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                        <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                      </div>
                    </Radio>
                    <Radio value="bank" disabled className="w-full">
                      <div>
                        <div className="font-medium">Chuyển khoản ngân hàng</div>
                        <div className="text-sm text-gray-500">Chức năng đang phát triển</div>
                      </div>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </div>
          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="space-y-6 bg-gray-100 h-screen " >
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
                        {item.variant_id?.color} - {item.variant_id?.dimensions}
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
                  onClick={handlePlaceOrder}
                  className="px-10"
                  disabled={!shippingAddress}
                >
                  Đặt hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Checkout;
