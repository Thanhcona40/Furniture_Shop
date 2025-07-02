export const statusColor = {
  pending: 'default',
  confirmed: 'primary',
  shipping: 'warning',
  delivered: 'success',
  cancelled: 'error'
};

export const statusLabel = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy'
};

export const nextStatus = {
  pending: 'confirmed',
  confirmed: 'shipping',
  shipping: 'delivered',
}; 