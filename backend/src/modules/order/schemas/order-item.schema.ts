import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Order } from "./order.schema";
import { Product } from "src/modules/product/schemas/product.schema";
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class OrderItem  {
  @Prop({ type: Types.ObjectId, ref: 'Order' })
  order_id: Order;

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  product_id: Product;

  @Prop() quantity: number;
  @Prop() price: number;
}

export type OrderItemDocument = OrderItem & Document;
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
