import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderTrack, OrderTrackSchema } from './schemas/order-track.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderItem, OrderItemSchema } from './schemas/order-item.schema';
import { UserAddress, UserAddressSchema } from '../address/schemas/user-address.schema';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderTrack.name, schema: OrderTrackSchema },
      { name: OrderItem.name, schema: OrderItemSchema },
      { name: UserAddress.name, schema: UserAddressSchema }
    ]),
    AuthModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
