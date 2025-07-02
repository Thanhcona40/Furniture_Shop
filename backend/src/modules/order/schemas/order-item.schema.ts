import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Order } from "./order.schema";
import { Product } from "src/modules/product/schemas/product.schema";
import { VariantProduct } from "src/modules/product/schemas/product-variant.schema";
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class OrderItem  {
  @Prop({ type: Types.ObjectId, ref: 'Order' })
  order_id: Order;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product_id: Product;

  @Prop({ type: Types.ObjectId, ref: 'VariantProduct' })
  variant_id: VariantProduct;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  total: number;
}

export type OrderItemDocument = OrderItem & Document;
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
