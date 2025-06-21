import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Province } from "./province.schema"; 
import { District } from "./district.schema";
import { Ward } from "./ward.schema";
import { Document, Types } from "mongoose";


@Schema({ _id: false })
export class Address  {
   @Prop() detail: string;
  @Prop({ type: Types.ObjectId, ref: 'Province' }) province_id: Province;
  @Prop({ type: Types.ObjectId, ref: 'District' }) district_id: District;
  @Prop({ type: Types.ObjectId, ref: 'Ward' }) ward_id: Ward;
}

export type AddressDocument = Address & Document; 
export const AddressSchema = SchemaFactory.createForClass(Address);