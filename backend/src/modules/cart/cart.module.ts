import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartSchema } from './schemas/cart.schema';
import { CartItemSchema } from './schemas/cart-item.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Cart', schema: CartSchema}
    ]),
    MongooseModule.forFeature([
      { name: 'CartItem', schema: CartItemSchema }
    ]),
  ],
  providers: [CartService],
  controllers: [CartController]
})
export class CartModule {}
