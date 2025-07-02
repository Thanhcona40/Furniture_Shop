import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PrivateRoute({ children }) {
  const user = useSelector(state => state.auth.user);
  
  // Kiểm tra xem người dùng có vừa đăng xuất hay không
  const justLoggedOut = sessionStorage.getItem('justLoggedOut') === 'true';
  
  return user ? children :  (
    <>
      <Navigate to="/login" />
      {!justLoggedOut && toast.error("Bạn cần đăng nhập để truy cập trang này")}
    </>
    );
} 