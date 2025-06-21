import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Province } from "./province.schema";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class District {
  @Prop({ required: true }) name: string;
  @Prop({ type: Types.ObjectId, ref: 'Province' }) province_id: Province;
}

export type DistrictDocument = District & Document;
export const DistrictSchema = SchemaFactory.createForClass(District);