import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Product } from "./product.schema";
import { CartItem } from "src/modules/cart/schemas/cart-item.schema";
import { OrderItem } from "src/modules/order/schemas/order-item.schema";

@Schema({ timestamps: true })
export class VariantProduct {
  @Prop() color: string;
  @Prop() dimensions: string;
  @Prop() price: number;
  @Prop() quantity: number;
  @Prop() url_media: string;
  @Prop({ type: Types.ObjectId, ref: 'Product' }) product_id: Product;
  @Prop({ type: Types.ObjectId, ref: 'CartItem' }) cart_item_id: CartItem;
  @Prop({ type: Types.ObjectId, ref: 'OrderItem' }) order_item_id: OrderItem;
}

export type VariantProductDocument = VariantProduct & Document;
export const VariantProductSchema = SchemaFactory.createForClass(VariantProduct);