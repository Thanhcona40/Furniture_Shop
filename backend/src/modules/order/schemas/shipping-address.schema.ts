import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class ShippingAddress {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  detail: string;

  @Prop({ type: String, ref: 'Province' })
  province_id: string;

  @Prop({ type: String, ref: 'District' })
  district_id: string;

  @Prop({ type: String, ref: 'Ward' })
  ward_id: string;
}

export type ShippingAddressDocument = ShippingAddress & Document;
export const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress); 