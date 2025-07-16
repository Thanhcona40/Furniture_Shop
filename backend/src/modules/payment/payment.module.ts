import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSchema } from './payment.schema';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Payment', schema: PaymentSchema }
     ]), 
     OrderModule,
  ],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule {}
