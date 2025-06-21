import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSchema } from './payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Payment', schema: PaymentSchema }
     ]), 
  ],
  providers: [PaymentService]
})
export class PaymentModule {}
