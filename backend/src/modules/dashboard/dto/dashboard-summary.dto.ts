export interface DashboardSummaryDto {
  totalOrders: number;
  totalRevenue: number;
  newCustomers: number;
  productsInStock: number;
  recentOrders: Array<any>; // Có thể định nghĩa chi tiết hơn nếu cần
  bestSellingProducts: Array<any>; // Có thể định nghĩa chi tiết hơn nếu cần
} 