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

export const statusBg = {
  default: 'bg-gray-200 text-gray-800',
  primary: 'bg-blue-600 text-white',
  warning: 'bg-yellow-400 text-white',
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
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