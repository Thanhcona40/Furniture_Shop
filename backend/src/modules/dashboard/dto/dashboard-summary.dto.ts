export interface DashboardSummaryDto {
  totalOrders: number;
  totalRevenue: number;
  newCustomers: number;
  productsInStock: number;
  lowStockProducts: Array<any>; // Sản phẩm sắp hết hàng
  outOfStockProducts: Array<any>; // Sản phẩm hết hàng
  recentOrders: Array<any>; // Có thể định nghĩa chi tiết hơn nếu cần
  bestSellingProducts: Array<any>; // Có thể định nghĩa chi tiết hơn nếu cần
} 