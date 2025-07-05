import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "src/modules/product/schemas/product.schema";
import { Cart } from "./cart.schema";
import { VariantProduct } from "src/modules/product/schemas/product-variant.schema";
import { Document, Types, Schema as MongooseSchema } from "mongoose";

@Schema({ timestamps: true })
export class CartItem{
  @Prop({ type: Types.ObjectId, ref: 'Cart', required: true })
  cart_id: Cart;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product_id: Product;

  @Prop({ type: Types.ObjectId, ref: 'VariantProduct', required: false })
  variant_id?: VariantProduct;

  @Prop({ required: true, min: 1, default: 1 })
  quantity: number;
}

export type CartItemDocument = CartItem & Document;
export const CartItemSchema = SchemaFactory.createForClass(CartItem);