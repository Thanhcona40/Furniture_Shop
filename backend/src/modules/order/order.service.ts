import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { OrderItem, OrderItemDocument } from './schemas/order-item.schema';
import { OrderTrack, OrderTrackDocument } from './schemas/order-track.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserAddress, UserAddressDocument } from '../address/schemas/user-address.schema';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { ProductService } from '../product/product.service';
import { Role } from 'src/common/enums/role.enum';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItemDocument>,
    @InjectModel(OrderTrack.name) private orderTrackModel: Model<OrderTrackDocument>,
    @InjectModel(UserAddress.name) private userAddressModel: Model<UserAddressDocument>,
    private productService: ProductService,
    private websocketService: WebsocketService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    const {
      items,
      shipping_address,
      payment_method,
      subtotal,
      shipping_fee,
      total
    } = createOrderDto;

    // Tạo mã đơn hàng tự động
    const orderCode = this.generateOrderCode();

    // Xử lý địa chỉ mặc định nếu có
    if (shipping_address.is_default) {
      // Set is_default = false cho tất cả địa chỉ khác của user
      await this.userAddressModel.updateMany(
        { user_id: userId },
        { is_default: false }
      );

      // Lưu địa chỉ mới vào UserAddress với is_default = true
      const newUserAddress = new this.userAddressModel({
        user_id: userId,
        address: {
          detail: shipping_address.detail,
          province_id: shipping_address.province_id,
          district_id: shipping_address.district_id,
          ward_id: shipping_address.ward_id,
        },
        full_name: shipping_address.full_name,
        email: shipping_address.email,
        phone: shipping_address.phone,
        is_default: true
      });
      await newUserAddress.save();
    }

    // Tạo order items
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const orderItem = new this.orderItemModel({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price
        });
        // Giảm stock cho variant hoặc product
        if (item.variant_id) {
          await this.productService.decreaseStock(item.variant_id, item.quantity);
        } else {
          // Nếu không có variant, giảm stock của product
          await this.productService.decreaseProductStock(item.product_id, item.quantity);
        }
        return await orderItem.save();
      })
    );

    // Tạo order
    const order = new this.orderModel({
      order_code: orderCode,
      user_id: userId,
      items: orderItems.map(item => item._id),
      shipping_address,
      payment_method,
      subtotal,
      shipping_fee,
      total,
      status: 'pending'
    });

    const savedOrder = await order.save();

    // Tạo order track
    const orderTrack = new this.orderTrackModel({
      order_id: savedOrder._id,
      status: 'pending',
      description: 'Đơn hàng đã được tạo'
    });
    await orderTrack.save();

    // Populate để trả về dữ liệu đầy đủ
    const populatedOrder = await this.orderModel.findById(savedOrder._id)
      .populate({
        path: 'items',
        populate: [
          { path: 'product_id' },
          { 
            path: 'variant_id',
            options: { strictPopulate: false }
          }
        ]
      })
      .populate('user_id', 'full_name email phone');

    // Gửi thông báo đơn hàng mới cho admin
    await this.websocketService.notifyAdminNewOrder(populatedOrder);

    return populatedOrder;
  }

  // Hàm tạo mã đơn hàng tự động
  private generateOrderCode(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DH${timestamp.slice(-8)}${random}`;
  }

  async getUserOrders(userId: string, status?: string) {
    const filter: any = { user_id: userId };
    if (status && status !== 'all') filter.status = status;
    return await this.orderModel.find(filter)
      .populate({
        path: 'items',
        populate: [
          { path: 'product_id' },
          { 
            path: 'variant_id',
            options: { strictPopulate: false }
          }
        ]
      })
      .populate('shipping_address.province_id', 'name')
      .populate('shipping_address.district_id', 'name')
      .populate('shipping_address.ward_id', 'name')
      .sort({ createdAt: -1 });
  }

  async getOrderById(orderId: string, user: any) {
    let order;
    if (user.role === Role.Admin) {
      // Admin: lấy bất kỳ đơn hàng nào
      order = await this.orderModel.findById(orderId)
        .populate({
          path: 'items',
          populate: [
            { path: 'product_id' },
            { 
              path: 'variant_id',
              options: { strictPopulate: false }
            }
          ]
        })
        .populate('user_id', 'full_name email phone');
    } else {
      // User thường: chỉ lấy đơn hàng của chính mình
      order = await this.orderModel.findOne({ _id: orderId, user_id: user.user_id })
        .populate({
          path: 'items',
          populate: [
            { path: 'product_id' },
            { 
              path: 'variant_id',
              options: { strictPopulate: false }
            }
          ]
        })
        .populate('user_id', 'full_name email phone');
    }
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }
    return order;
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.orderModel.findOne({ _id: orderId, user_id: userId });
    
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    if (order.status !== 'pending') {
      throw new BadRequestException('Không thể hủy đơn hàng này');
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    // Tạo order track
    const orderTrack = new this.orderTrackModel({
      order_id: order._id,
      status: 'cancelled',
      description: 'Đơn hàng đã được hủy bởi khách hàng'
    });
    await orderTrack.save();

    return order;
  }

  async getAllOrders(status?: string) {
    const filter: any = {};
    if (status && status !== 'all') filter.status = status;
    return await this.orderModel.find(filter)
      .populate({
        path: 'items',
        populate: [
          { path: 'product_id' },
          { 
            path: 'variant_id',
            options: { strictPopulate: false }
          }
        ]
      })
      .populate('shipping_address.province_id', 'name')
      .populate('shipping_address.district_id', 'name')
      .populate('shipping_address.ward_id', 'name')
      .populate('user_id', 'full_name email phone')
      .sort({ createdAt: -1 });
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.orderModel.findById(orderId);
    
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    const oldStatus = order.status;
    order.status = OrderStatus[status.toUpperCase()];
    await order.save();

    // Tạo order track
    const orderTrack = new this.orderTrackModel({
      order_id: order._id,
      status,
      description: `Đơn hàng đã được cập nhật trạng thái: ${status}`
    });
    await orderTrack.save();

    // Gửi thông báo realtime cho user
    await this.websocketService.notifyUserOrderStatusUpdate(
      order.user_id.toString(),
      order._id.toString(),
      order.order_code,
      oldStatus,
      status
    );

    return order;
  }

  async getOrderTrackByOrderId(orderId: string) {
    const orderTrack = await this.orderTrackModel.find({ order_id: new Types.ObjectId(orderId) }).sort({ createdAt: 1 });
    return orderTrack;
  }

  async countOrdersByUserAndStatus(userId: string) {
    const statuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
    const counts = await Promise.all(
      statuses.map(status =>
        this.orderModel.countDocuments({ user_id: userId, status })
      )
    );
    const result = {};
    statuses.forEach((status, idx) => {
      result[status] = counts[idx];
    });
    return result;
  }
}
