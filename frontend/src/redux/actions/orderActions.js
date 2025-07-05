import { createAsyncThunk } from '@reduxjs/toolkit';
import { createOrder, getUserOrders, getOrderById, cancelOrder } from '../../api/order';

// Tạo đơn hàng mới
export const createOrderAction = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await createOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng');
    }
  }
);

// Lấy danh sách đơn hàng của user
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (status = 'all', { rejectWithValue }) => {
    try {
      const response = await getUserOrders(status);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi tải đơn hàng');
    }
  }
);

// Lấy chi tiết đơn hàng
export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await getOrderById(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi tải chi tiết đơn hàng');
    }
  }
);

// Hủy đơn hàng
export const cancelOrderAction = createAsyncThunk(
  'order/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await cancelOrder(orderId);
      return { orderId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng');
    }
  }
); 