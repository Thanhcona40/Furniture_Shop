import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { api } from '../config/api';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useSelector((state) => state.auth);

  const fetchNotifications = async () => {
    if (token && user) {
      try {
        const res = await api.get('/notifications?limit=20');
        setNotifications(res.data || []);
        setUnreadCount(0); // Set về 0 khi hover vào Bell
      } catch (err) {
        setNotifications([]);
      }
    }
  };

  // Khi user đăng nhập, chỉ lấy số lượng chưa đọc
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (token && user) {
        try {
          const res = await api.get('/notifications/unread-count');
          setUnreadCount(res.data || 0);
        } catch (err) {
          setUnreadCount(0);
        }
      } else {
        setUnreadCount(0);
      }
    };
    fetchUnreadCount();
  }, [token, user]);

  // Kết nối websocket
  useEffect(() => {
    if (token) {
      const newSocket = io('https://furniture-shop-x2n4.onrender.com', {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
      });
      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });
      //cổng này sẽ nhận thông báo từ server
      newSocket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
          });
        }
      });
      //cổng này sẽ nhận thông báo từ server dành cho admin
      newSocket.on('admin-notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
          });
        }
      });
      setSocket(newSocket);
      return () => {
        newSocket.close();
      };
    }
  }, [token, user]);

  const markAsRead = async (notificationId) => {
    if (!token) return;
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, read: true } : n));
      setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
    } catch (err) {}
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const value = {
    socket,
    notifications,
    unreadCount,
    isConnected,
    clearNotifications,
    removeNotification,
    markAsRead,
    fetchNotifications,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}; 