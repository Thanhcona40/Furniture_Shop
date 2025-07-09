import { Controller, Get, Patch, Param, Req, UseGuards, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('unread-count')
  async getUnreadCount(@Req() req) {
    const userId = req.user.user_id;
    return this.notificationService.getUnreadCount(userId);
  }

  @Get()
  async getUserNotifications(@Req() req, @Query('limit') limit: string) {
    const userId = req.user.user_id;
    // Lấy danh sách và đánh dấu tất cả là đã đọc
    const notifications = await this.notificationService.getUserNotifications(userId, Number(limit) || 20);
    await this.notificationService.markAllAsRead(userId);
    return notifications;
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req) {
    const userId = req.user.user_id ;
    await this.notificationService.markAsRead(id, userId);
    return { success: true };
  }
} 