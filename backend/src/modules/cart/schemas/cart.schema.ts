import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "src/modules/user/user.schema";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Cart  {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: User;
}

export type CartDocument = Cart & Document;
export const CartSchema = SchemaFactory.createForClass(Cart);