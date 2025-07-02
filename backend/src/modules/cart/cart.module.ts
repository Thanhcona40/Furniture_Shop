import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartItem, CartItemSchema } from './schemas/cart-item.schema';
import { VariantProduct, VariantProductSchema } from '../product/schemas/product-variant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: CartItem.name, schema: CartItemSchema },
      { name: VariantProduct.name, schema: VariantProductSchema }
    ]),
    AuthModule,
  ],
  providers: [CartService],
  controllers: [CartController]
})
export class CartModule {}
