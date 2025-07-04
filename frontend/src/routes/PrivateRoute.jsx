import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PrivateRoute({ children }) {
  const user = useSelector(state => state.auth.user);
  
  // Kiểm tra xem người dùng có vừa đăng xuất hay không
  const justLoggedOut = sessionStorage.getItem('justLoggedOut') === 'true';
  
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!user && !justLoggedOut && !hasShownToast.current) {
      toast.error("Bạn cần đăng nhập để truy cập trang này");
      hasShownToast.current = true;
    }
  }, [user, justLoggedOut]);

  // Reset lại khi user đăng nhập lại (nếu cần)
  useEffect(() => {
    if (user) hasShownToast.current = false;
  }, [user]);

  return user ? children : <Navigate to="/login" />;
} 