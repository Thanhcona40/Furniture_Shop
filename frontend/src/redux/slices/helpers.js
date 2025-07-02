// Helper functions để xử lý loading và failed states chung
export const handlePending = (state) => {
  state.status = 'loading';
  state.error = null;
};

export const handleRejected = (state, action) => {
  state.status = 'failed';
  state.error = action.payload || action.error?.message || 'Có lỗi xảy ra';
}; 