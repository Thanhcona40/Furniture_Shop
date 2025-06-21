import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderSchema } from './schemas/order.schema';
import { OrderTrackSchema } from './schemas/order-track.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderItemSchema } from './schemas/order-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema }
    ]),
    MongooseModule.forFeature([
      { name: 'OrderTrack', schema: OrderTrackSchema } 
    ]),
    MongooseModule.forFeature([
      { name: 'OrderItem', schema: OrderItemSchema } 
    ]),
    
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
