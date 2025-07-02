import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Province } from "./province.schema"; 
import { District } from "./district.schema";

import { Document, Types } from "mongoose";
import { Ward } from "./ward.schema";


@Schema({ _id: false })
export class Address  {
   @Prop() detail: string;
  @Prop({ type: String, ref: 'Province' }) province_id: string;
  @Prop({ type: String, ref: 'District' }) district_id: string;
  @Prop({ type: String, ref: 'Ward' }) ward_id: string;
}

export type AddressDocument = Address & Document; 
export const AddressSchema = SchemaFactory.createForClass(Address);