import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useNavigate } from 'react-router-dom';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useSelector } from 'react-redux';

const NotificationBell = () => {
  const { notifications, unreadCount, fetchNotifications } = useWebSocket();
  const [hasPermission, setHasPermission] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Kiểm tra quyền thông báo
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setHasPermission(true);
      } else if (Notification.permission === 'default') {
        // Yêu cầu quyền thông báo
        Notification.requestPermission().then((permission) => {
          setHasPermission(permission === 'granted');
        });
      }
    }
  }, []);

  const handleBellHover = async () => {
    if (!hasFetched) {
      await fetchNotifications();
      setHasFetched(true);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (user?.role === 'admin') {
      navigate('/admin/orders');
    } else {
      navigate('/account/orders_user');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  return (
    <div className="group relative">
      <button 
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
        onMouseEnter={handleBellHover}
      >
        <NotificationsOutlinedIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <div className="hidden group-hover:block absolute right-0 w-96 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
        <div className="py-2">
          <div className="px-3 py-2 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">
              Thông báo ({unreadCount})
            </h3>
          </div>
          
          {notifications.length === 0 ? (
            <div className="px-6 py-4 text-base text-gray-500">
              Không có thông báo mới
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  onClick={() => handleNotificationClick(notification)}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {notification.read ? (
                        <div className="h-2 w-2 mt-2"></div>
                      ) : (
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-base font-semibold text-gray-900 break-all">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell; 