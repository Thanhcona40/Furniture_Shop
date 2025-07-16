import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import paymentApi from '../api/payment';

export default function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    paymentApi.vnpayReturn(Object.fromEntries(params.entries()))
      .then(res => setResult(res))
      .catch(() => setResult({ isValid: false }));
  }, [location.search]);

  if (!result) return <div>Đang kiểm tra kết quả thanh toán...</div>;

  if (result.isValid && result.vnp_ResponseCode === '00') {
    return (
      <div style={{color: 'green', textAlign: 'center', marginTop: 40}}>
        <h2>Đặt hàng thành công!</h2>
        <p>Cảm ơn bạn đã thanh toán online.</p>
        <button onClick={() => navigate('/')}>Về trang chủ</button>
      </div>
    );
  }
  return (
    <div style={{color: 'red', textAlign: 'center', marginTop: 40}}>
      <h2>Thanh toán thất bại hoặc bị hủy!</h2>
      <p>Vui lòng thử lại hoặc chọn phương thức khác.</p>
      <button onClick={() => navigate('/checkout')}>Quay lại thanh toán</button>
    </div>
  );
} 