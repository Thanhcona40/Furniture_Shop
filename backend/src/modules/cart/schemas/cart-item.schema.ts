import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "src/modules/product/schemas/product.schema";
import { Cart } from "./cart.schema";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class CartItem{
  @Prop({ type: Types.ObjectId, ref: 'Cart' })
  cart_id: Cart;

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  product_id: Product;

  @Prop() quantity: number;
  @Prop() price: number;
}

export type CartItemDocument = CartItem & Document;
export const CartItemSchema = SchemaFactory.createForClass(CartItem);