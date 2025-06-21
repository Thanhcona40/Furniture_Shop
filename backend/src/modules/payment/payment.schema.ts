import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Order } from "../order/schemas/order.schema";
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Order' })
  order_id: Order;

  @Prop() amount: number;
  @Prop() payment_method: string;
  @Prop() payment_status: string;
  @Prop() payment_date: Date;
}

export type PaymentDocument = Payment & Document;
export const PaymentSchema = SchemaFactory.createForClass(Payment);