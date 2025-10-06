import { toast } from 'react-toastify';

/**
 * Extract error message from API error response
 * @param {Error} error 
 * @returns {string}
 */
export const getErrorMessage = (error) => {
  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
    console.error('Error Response:', error.response);
  }

  if (error.response) {
    // Server responded with error status
    const { data, status } = error.response;
    
    // Handle different error message formats
    if (typeof data === 'string') {
      return data;
    }
    
    if (data.message) {
      // Backend may return message as string or array
      if (Array.isArray(data.message)) {
        return data.message.join(', ');
      }
      return data.message;
    }
    
    if (data.error) {
      return data.error;
    }
    
    // Fallback to status text
    return error.response.statusText || `Lỗi ${status}: Đã xảy ra lỗi`;
  }
  
  if (error.request) {
    // Request was made but no response
    return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
  }
  
  // Something else happened
  return error.message || 'Đã xảy ra lỗi không xác định';
};

/**
 * Handle API error and show toast
 * @param {Error} error 
 * @param {string} fallbackMessage 
 */
export const handleApiError = (error, fallbackMessage = 'Đã xảy ra lỗi') => {
  const message = getErrorMessage(error);
  toast.error(message || fallbackMessage);
  
  // Log detailed error in development
  if (process.env.NODE_ENV === 'development') {
    console.group('🔴 API Error Details');
    console.error('Error Object:', error);
    console.error('Response:', error.response);
    console.error('Response Data:', error.response?.data);
    console.error('Extracted Message:', message);
    console.groupEnd();
  }
};

/**
 * Show success toast
 * @param {string} message 
 */
export const showSuccess = (message) => {
  toast.success(message);
};

/**
 * Show info toast
 * @param {string} message 
 */
export const showInfo = (message) => {
  toast.info(message);
};

/**
 * Show warning toast
 * @param {string} message 
 */
export const showWarning = (message) => {
  toast.warning(message);
};

/**
 * Validate form field
 * @param {string} field 
 * @param {*} value 
 * @returns {string|null} Error message or null
 */
export const validateField = (field, value) => {
  switch (field) {
    case 'email':
      if (!value) return 'Email là bắt buộc';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Email không hợp lệ';
      }
      return null;
      
    case 'password':
      if (!value) return 'Mật khẩu là bắt buộc';
      if (value.length < 6) {
        return 'Mật khẩu phải có ít nhất 6 ký tự';
      }
      return null;
      
    case 'phone':
      if (!value) return 'Số điện thoại là bắt buộc';
      if (!/^[0-9]{10}$/.test(value)) {
        return 'Số điện thoại phải có 10 chữ số';
      }
      return null;
      
    case 'fullName':
      if (!value) return 'Họ tên là bắt buộc';
      if (value.length < 2) {
        return 'Họ tên phải có ít nhất 2 ký tự';
      }
      return null;
      
    default:
      return null;
  }
};

/**
 * Check if error is network error
 * @param {Error} error 
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * Check if error is authentication error
 * @param {Error} error 
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  return error.response && error.response.status === 401;
};

/**
 * Check if error is permission error
 * @param {Error} error 
 * @returns {boolean}
 */
export const isPermissionError = (error) => {
  return error.response && error.response.status === 403;
};

/**
 * Check if error is not found error
 * @param {Error} error 
 * @returns {boolean}
 */
export const isNotFoundError = (error) => {
  return error.response && error.response.status === 404;
};
