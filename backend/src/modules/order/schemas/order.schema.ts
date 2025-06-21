import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserAddress } from "src/modules/address/schemas/user-address.schema";
import { User } from "src/modules/user/user.schema";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: User;

  @Prop({ type: Types.ObjectId, ref: 'UserAddress' })
  user_address_id: UserAddress;

  @Prop() total_amount: number;
  @Prop() status: string;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);