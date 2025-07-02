import { Schema } from "@nestjs/mongoose";
import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose"; 
import { District } from "./district.schema";


@Schema({ timestamps: true })
export class Ward {
  @Prop({ required: true, type: String }) _id: string; 
  @Prop({ required: true }) name: string;
  
  @Prop({ type: Types.ObjectId, ref: 'District' })
  district_id: District | string; 
}

export type WardDocument = Ward & Document; 
export const WardSchema = SchemaFactory.createForClass(Ward);