import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.orderService.createOrder(createOrderDto, req.user.user_id);
  }

  @Get('user')
  async getUserOrders(@Request() req) {
    return this.orderService.getUserOrders(req.user.user_id);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string, @Request() req) {
    return this.orderService.getOrderById(id, req.user);
  }

  @Put(':id/cancel')
  async cancelOrder(@Param('id') id: string, @Request() req) {
    return this.orderService.cancelOrder(id, req.user.user_id);
  }

  // Admin endpoints
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async updateOrderStatus(@Param('id') id: string, @Body() updateStatusDto: any) {
    return this.orderService.updateOrderStatus(id, updateStatusDto.status);
  }

  @Get(':id/track')
  async getOrderTrackUser(@Param('id') id: string, @Request() req) {
    const order = await this.orderService.getOrderById(id, req.user);
    console.log("order là kiểu gì vậy",order);
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại hoặc không thuộc về bạn');
    return this.orderService.getOrderTrackByOrderId(id);
  }

  @Get('user/:userId/status-count')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async countOrdersByUserAndStatus(@Param('userId') userId: string) {
    return this.orderService.countOrdersByUserAndStatus(userId);
  }
}
