import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  image: string;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: new Date() })
  datePosted: Date;
}

export type BlogDocument = Blog & Document;
export const BlogSchema = SchemaFactory.createForClass(Blog); 