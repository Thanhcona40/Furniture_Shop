import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import AddressForm from '../components/checkout/AddressForm';
import PaymentMethod from '../components/checkout/PaymentMethod';
import OrderSummary from '../components/checkout/OrderSummary';
import { createOrderAction } from '../redux/actions/orderActions';
import { removeCartItemsAction } from '../redux/actions/cartActions';
import { getDefaultAddress, getUserAddresses } from '../api/address';
import paymentApi from '../api/payment';
import { resetOrderAction } from '../redux/actions/orderActions';

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
  const [addressList, setAddressList] = useState([]);

  // Lấy danh sách sản phẩm được chọn từ Cart
  const selectedItemIds = location.state?.selectedItems || [];
  const selectedCartItems = cartItems.filter(item => selectedItemIds.includes(item._id));

  // Tính tổng tiền chỉ cho các sản phẩm được chọn
  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.quantity * (item.variant_id?.price || item.product_id?.price || 0),
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

  useEffect(() => {
    if (user?._id) {
      getDefaultAddress()
        .then(res => setDefaultAddress(res.data))
        .catch(() => setDefaultAddress(null));
      getUserAddresses()
        .then(res => setAddressList(res.data))
        .catch(() => setAddressList([]));
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
          variant_id: item.variant_id?._id || null,
          quantity: item.quantity,
          price: item.variant_id?.price || item.product_id.price
        })),
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        subtotal,
        shipping_fee: shippingFee,
        total
      };

      if (paymentMethod === 'cod') {
        await dispatch(createOrderAction(orderData)).unwrap();
        const order = await dispatch(createOrderAction(orderData)).unwrap();
        if (order && order._id) {
          toast.success(`Bạn đã đặt hàng thành công! Mã đơn: ${order.order_code}`);
          dispatch(removeCartItemsAction(selectedItemIds));
          dispatch(resetOrderAction());
          navigate('/');
        } else {
          toast.error('Không tạo được đơn hàng!');
          navigate('/cart');
        }
      } else if (paymentMethod === 'bank') {
        // Bước 1: Tạo đơn hàng trước (trạng thái chờ thanh toán)
        const order = await dispatch(createOrderAction(orderData)).unwrap();
        // Bước 2: Gọi API backend để lấy link VNPAY với orderId
        const res = await paymentApi.createVnpayUrl({
          amount: total,
          orderId: order._id,
          ipAddr: '127.0.0.1'
        });
        if (res.paymentUrl) {
          console.log("res: ", res)
          // Lưu danh sách item đã chọn để thanh toán
          localStorage.setItem('selectedItemsForPayment', JSON.stringify(selectedItemIds));
          window.location.href = res.paymentUrl;
        } else {
          message.error('Không tạo được link thanh toán!');
        }
      }
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
                    addressList={addressList}
                    editableEmail={false}
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
                <PaymentMethod value={paymentMethod} onChange={handlePaymentMethodChange} />
              </div>
            </div>
          </div>
          {/* Cột phải: Tóm tắt đơn hàng */}
          <OrderSummary
            selectedCartItems={selectedCartItems}
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={total}
            loading={loading}
            onPlaceOrder={handlePlaceOrder}
            shippingAddress={shippingAddress}
            navigate={navigate}
          />
        </div>
      </div>
  );
};

export default Checkout;
