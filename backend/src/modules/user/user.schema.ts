import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "src/common/enums/role.enum";


@Schema({ timestamps: true }) 
export class User {
  @Prop({ required: true }) full_name: string;
  @Prop({ required: true, unique: true }) email: string;
  @Prop() phone: string;
  @Prop({ required: true }) password: string;
  @Prop({ type: String, enum : Role , default: Role.User }) role: Role;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);