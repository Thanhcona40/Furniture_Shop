import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "src/modules/user/user.schema";
import { Address, AddressSchema } from "./address.schema";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class UserAddress  {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: User;

  @Prop({ type: AddressSchema })
  address: Address;

  @Prop({ required: true }) full_name: string;
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) phone: string;

  @Prop({ default: false })
  is_default: boolean;
}

export type UserAddressDocument = UserAddress & Document;
export const UserAddressSchema = SchemaFactory.createForClass(UserAddress);