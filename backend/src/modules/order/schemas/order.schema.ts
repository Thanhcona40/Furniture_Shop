import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "src/modules/user/user.schema";
import { Document, Types } from "mongoose";
import { OrderStatus } from "../../../common/enums/order-status.enum";
import { PaymentMethod } from "../../../common/enums/payment-method.enum";
import { ShippingAddress, ShippingAddressSchema } from "./shipping-address.schema";

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: String, unique: true, required: true })
  order_code: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'OrderItem' }], required: true })
  items: Types.ObjectId[];

  @Prop({ type: ShippingAddressSchema, required: true })
  shipping_address: ShippingAddress;

  @Prop({ required: true, enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  shipping_fee: number;

  @Prop({ required: true })
  total: number;

  @Prop({ 
    required: true, 
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);