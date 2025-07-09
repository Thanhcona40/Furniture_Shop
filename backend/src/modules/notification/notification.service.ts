import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>
  ) {}

  async createNotification(data: Partial<Notification>) {
    return this.notificationModel.create(data);
  }

  async getUserNotifications(userId: string, limit = 20) {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notificationModel.updateOne(
      { _id: notificationId, userId },
      { $set: { read: true } }
    );
  }

  async getUnreadCount(userId: string) {
    return this.notificationModel.countDocuments({ userId, read: false });
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany({ userId, read: false }, { $set: { read: true } });
  }
} 