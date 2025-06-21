import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from 'src/modules/category/category.schema';

@Schema({ timestamps: true })
export class Product{
   @Prop({ required: true }) name: string;
  @Prop() price: number;
  @Prop() description: string;
  @Prop() stock_quantity: number;
  @Prop() thumbnail_url: string;
  @Prop() sold: number;
  @Prop() total_reviews: number;
  @Prop({ type: Types.ObjectId, ref: 'Category' }) category_id: Category;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);