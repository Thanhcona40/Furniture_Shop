import { api } from "../config/api";


// Tạo đơn hàng mới
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách đơn hàng của user
export const getUserOrders = async () => {
  try {
    const response = await api.get('/orders/user');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hủy đơn hàng
export const cancelOrder = async (orderId) => {
  try {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin: Lấy tất cả đơn hàng
export const getAllOrders = async (params = {}) => {
  try {
    const response = await api.get('/orders', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin: Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin: Lấy lịch sử trạng thái đơn hàng
export const getOrderTrack = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}/track`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 