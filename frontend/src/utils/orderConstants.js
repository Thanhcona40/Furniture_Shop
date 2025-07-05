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

export const ORDER_STATUS_TABS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Đã xác nhận', value: 'confirmed' },
  { label: 'Đang giao', value: 'shipping' },
  { label: 'Đã nhận', value: 'delivered' },
  { label: 'Đã hủy', value: 'cancelled' },
];