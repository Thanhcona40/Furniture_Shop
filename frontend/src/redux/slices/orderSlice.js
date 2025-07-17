import { createSlice } from '@reduxjs/toolkit';
import { createOrderAction, fetchUserOrders, fetchOrderById, cancelOrderAction } from '../actions/orderActions';
import { handlePending, handleRejected } from './helpers';

// Re-export actions để backward compatibility
export { createOrderAction, fetchUserOrders, fetchOrderById, cancelOrderAction } from '../actions/orderActions';

const initialState = {
  orders: [],
  currentOrder: null,
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reset toàn bộ state khi nhận action resetOrder
      .addCase('order/resetOrder', (state) => {
        state.orders = [];
        state.currentOrder = null;
        state.status = 'idle';
        state.error = null;
      })
      // Create Order
      .addCase(createOrderAction.pending, handlePending)
      .addCase(createOrderAction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload); // Thêm vào đầu danh sách
      })
      .addCase(createOrderAction.rejected, handleRejected)
      // Fetch User Orders
      .addCase(fetchUserOrders.pending, handlePending)
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, handleRejected)
      // Fetch Order By Id
      .addCase(fetchOrderById.pending, handlePending)
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, handleRejected)
      // Cancel Order
      .addCase(cancelOrderAction.pending, handlePending)
      .addCase(cancelOrderAction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Cập nhật trạng thái đơn hàng trong danh sách
        const index = state.orders.findIndex(order => order._id === action.payload.orderId);
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], ...action.payload };
        }
        // Cập nhật currentOrder nếu đang xem đơn hàng này
        if (state.currentOrder && state.currentOrder._id === action.payload.orderId) {
          state.currentOrder = { ...state.currentOrder, ...action.payload };
        }
      })
      .addCase(cancelOrderAction.rejected, handleRejected);
  },
});

export const { clearCurrentOrder, clearOrders } = orderSlice.actions;
export default orderSlice.reducer; 