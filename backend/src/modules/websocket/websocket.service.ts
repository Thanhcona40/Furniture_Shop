import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/schemas/notification.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class WebsocketService {
  private server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  async notifyUserOrderStatusUpdate(userId: string, orderId: string, orderCode: string, oldStatus: string, newStatus: string) {
    const shortMessages = {
      pending: 'chờ xác nhận',
      confirmed: 'đang được chuẩn bị',
      shipping: 'sẽ sớm được giao, vui lòng chú ý điện thoại',
      delivered: 'giao hàng thành công',
      cancelled: 'đã hủy',
    };

    const notification: Partial<Notification> = {
      type: 'order_status_update',
      title: 'Cập nhật trạng thái đơn hàng',
      message: `Đơn hàng ${orderCode}: ${shortMessages[newStatus] || newStatus}`,
      orderId,
      orderCode,
      status: newStatus,
      read: false,
      userId,
    };

    // Gửi realtime + lưu DB
    if (this.server) {
      this.server.to(`user_${userId}`).emit('notification', notification);
    }
    await this.notificationService.createNotification(notification);
  }

  async notifyAdminNewOrder(orderData: any) {
    const notification: Partial<Notification> = {
      type: 'order_status_update',
      title: 'Đơn hàng mới',
      message: `Có đơn hàng mới ${orderData.order_code} từ ${orderData.user_id?.full_name || 'Khách hàng'}`,
      orderId: orderData._id,
      orderCode: orderData.order_code,
      status: orderData.status,
      read: false,
    };

    // Tìm admin theo email
    const admin = await this.userService.findByEmail('admin@example.com');
    if (admin) {
      // Gửi realtime + lưu DB cho admin
      if (this.server) {
        this.server.to(`admin-room`).emit('admin-notification', notification);
      }
      await this.notificationService.createNotification({
        ...notification,
        userId: admin._id,
        type: 'admin-notification',
        read: false
      });
    }
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return {
        user_id: payload.user_id,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      return null;
    }
  }
} 