import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { storage } from '../utils/storage';
import { ROUTES, USER_ROLES } from '../constants';

/**
 * Custom hook for auth operations
 * @returns {Object}
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const isUser = user?.role === USER_ROLES.USER;

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isUser,
    logout: handleLogout,
  };
};

/**
 * Custom hook for cart operations
 * @returns {Object}
 */
export const useCart = () => {
  const cart = useSelector((state) => state.cart);
  const { items, total, loading } = cart;

  const itemCount = items?.length || 0;
  const isEmpty = itemCount === 0;

  return {
    items,
    total,
    loading,
    itemCount,
    isEmpty,
  };
};

/**
 * Custom hook for notifications
 * @returns {Object}
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
  };

  return {
    notifications,
    unreadCount,
    setNotifications,
    setUnreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
  };
};
