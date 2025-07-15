import { Injectable } from '@nestjs/common';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';
import { OrderService } from '../order/order.service';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  async getSummary(): Promise<DashboardSummaryDto> {
    // Lấy tất cả đơn hàng
    const orders = await this.orderService.getAllOrders();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const recentOrders = orders.slice(0, 5);

    // Lấy tất cả user
    const users = await this.userService.getAllUsers();
    // Khách hàng mới trong tháng
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const newCustomers = users.filter((user: any) => {
      const createdAt = user.createdAt ? new Date(user.createdAt) : null;
      return createdAt && createdAt >= startOfMonth && createdAt <= endOfMonth;
    }).length;

    // Lấy tất cả sản phẩm
    const products = await this.productService.findAll();
    // Tổng tồn kho
    const productsInStock = products.reduce((sum, product: any) => sum + (product.stock_quantity || 0), 0);
    // Sản phẩm bán chạy nhất (top 5 theo sold)
    const bestSellingProducts = products
      .sort((a: any, b: any) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5);

    return {
      totalOrders,
      totalRevenue,
      newCustomers,
      productsInStock,
      recentOrders,
      bestSellingProducts
    };
  }

  async getChartData(month?: string, year?: string): Promise<Array<{date: string, revenue: number, orders: number}>> {
    // Nếu không có year thì lấy năm hiện tại
    const now = new Date();
    const y = year ? parseInt(year) : now.getFullYear();
    // Nếu có month thì trả về dữ liệu từng ngày trong tháng đó
    if (month) {
      const m = parseInt(month) - 1; // JS month 0-based
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const chartData: Array<{date: string, revenue: number, orders: number}> = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${y}-${(m + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        chartData.push({ date: dateStr, revenue: 0, orders: 0 });
      }
      const orders = await this.orderService.getAllOrders();
      orders.forEach((order: any) => {
        if (!order.createdAt) return;
        const d = new Date(order.createdAt);
        if (d.getFullYear() === y && d.getMonth() === m) {
          const day = d.getDate();
          const idx = day - 1;
          chartData[idx].revenue += order.total || 0;
          chartData[idx].orders += 1;
        }
      });
      return chartData;
    } else {
      // Nếu không có month, trả về dữ liệu từng ngày của cả năm (hoặc từng tháng nếu muốn)
      // Ở đây trả về từng ngày của cả năm (có thể sửa thành từng tháng nếu muốn)
      const chartData: Array<{date: string, revenue: number, orders: number}> = [];
      for (let m = 0; m < 12; m++) {
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `${y}-${(m + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          chartData.push({ date: dateStr, revenue: 0, orders: 0 });
        }
      }
      const orders = await this.orderService.getAllOrders();
      orders.forEach((order: any) => {
        if (!order.createdAt) return;
        const d = new Date(order.createdAt);
        if (d.getFullYear() === y) {
          const m = d.getMonth();
          const day = d.getDate();
          // Tìm index
          const idx = chartData.findIndex(item => {
            const [yy, mm, dd] = item.date.split('-');
            return parseInt(yy) === y && parseInt(mm) === m + 1 && parseInt(dd) === day;
          });
          if (idx !== -1) {
            chartData[idx].revenue += order.total || 0;
            chartData[idx].orders += 1;
          }
        }
      });
      return chartData;
    }
  }
} 