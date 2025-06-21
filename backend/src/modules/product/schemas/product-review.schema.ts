import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "./product.schema";
import { User } from "src/modules/user/user.schema";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class ProductReview {
  @Prop({ type: Types.ObjectId, ref: 'Product' })
  product_id: Product;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: User;

  @Prop() rating: number;
  @Prop() comment: string;
}

export type ProductReviewDocument = ProductReview & Document;
export const ProductReviewSchema = SchemaFactory.createForClass(ProductReview);