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

    // Tổng doanh thu từ tất cả đơn hàng giao thành công 
    const totalRevenue = orders
      .filter(order => order.status === 'delivered' && order.total)
      .reduce((sum, order) => sum + (order.total || 0), 0);

    // Lấy 5 đơn hàng gần đây nhất
    const recentOrders = orders.slice(0, 5);

    // Khách hàng mới trong tháng
    const users = await this.userService.getAllUsers();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);//lấy ngày cuối tháng
    const newCustomers = users.filter((user: any) => {
      const createdAt = user.createdAt ? new Date(user.createdAt) : null;
      return createdAt && createdAt >= startOfMonth && createdAt <= endOfMonth;
    }).length;

    // Lấy tất cả sản phẩm (đã populate variants)
    const products = await this.productService.findAll();
    // Tổng tồn kho dựa trên variant
    let productsInStock = 0;
    const lowStockProducts: any[] = [];
    const outOfStockProducts: any[] = [];
    const LOW_STOCK_THRESHOLD = 5;
    products.forEach((product: any) => {
      let totalStock = 0;
      if (product.variants && product.variants.length > 0) {
        totalStock = product.variants.reduce((sum: number, variant: any) => sum + (variant.quantity || 0), 0);
      } else {
        totalStock = product.stock_quantity || 0;
      }
      productsInStock += totalStock;
      if (totalStock === 0) {
        outOfStockProducts.push({
          name: product.name,
          totalStock,
          variants: (product.variants || []).map((v: any) => ({ name: v.color || v.dimensions || '', stock: v.quantity || 0 }))
        });
      } else if (totalStock <= LOW_STOCK_THRESHOLD) {
        lowStockProducts.push({
          name: product.name,
          totalStock,
          variants: (product.variants || []).map((v: any) => ({ name: v.color || v.dimensions || '', stock: v.quantity || 0 }))
        });
      }
    });

    // Sản phẩm bán chạy nhất (top 5 theo sold, tính theo variant nếu có)
    // Lấy tất cả order items
    const orderItems = orders.flatMap((order: any) => order.items || []);
    // Map: {variantId: {productName, variantName, sold}}
    const variantSalesMap = new Map();
    const productSalesMap = new Map();
    orderItems.forEach((item: any) => {
      if (item.variant_id) {
        const key = item.variant_id._id?.toString() || item.variant_id?.toString();
        const productName = item.product_id?.name || '';
        const variantName = item.variant_id?.color || item.variant_id?.dimensions || '';
        const stock = item.variant_id.quantity;

        if (!variantSalesMap.has(key)) {
          variantSalesMap.set(key, { productName, variantName, sold: 0, stock});
        }
        variantSalesMap.get(key).sold += item.quantity;
      } else {
        // Không có variant, tính theo product
        const key = item.product_id?._id?.toString() || item.product_id?.toString();
        const productName = item.product_id?.name || '';
        if (!productSalesMap.has(key)) {
          productSalesMap.set(key, { productName, sold: 0, stock: item.product_id.stock_quantity });
        }
        productSalesMap.get(key).sold += item.quantity;
      }
    });
    // Lấy top 5 variant bán chạy nhất
    let bestSellingProducts = Array.from(variantSalesMap.values())
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);
    // Nếu chưa đủ 5, bổ sung thêm product không có variant
    if (bestSellingProducts.length < 5) {
      const more = Array.from(productSalesMap.values())
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5 - bestSellingProducts.length);
      bestSellingProducts = bestSellingProducts.concat(more);
    }

    return {
      totalOrders,
      totalRevenue,
      newCustomers,
      productsInStock,
      lowStockProducts,
      outOfStockProducts,
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
      const ordersDelivered = orders.filter(order => order.status === 'delivered'); // Chỉ tính đơn hàng đã giao
      ordersDelivered.forEach((order: any) => {
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
      // Trả về 12 phần tử, mỗi phần tử là tổng hợp của 1 tháng
      const chartData: Array<{date: string, revenue: number, orders: number}> = [];
      // Khởi tạo 12 tháng
      for (let m = 0; m < 12; m++) {
        chartData.push({
          date: `${y}-${(m + 1).toString().padStart(2, '0')}`,
          revenue: 0,
          orders: 0,
        });
      }
      const orders = await this.orderService.getAllOrders();
      const ordersDelivered = orders.filter(order => order.status === 'delivered');
      ordersDelivered.forEach((order: any) => {
        if (!order.createdAt) return;
        const d = new Date(order.createdAt);
        if (d.getFullYear() === y) {
          const m = d.getMonth(); // 0-based
          chartData[m].revenue += order.total || 0;
          chartData[m].orders += 1;
        }
      });
      return chartData;
    }
  }
} 