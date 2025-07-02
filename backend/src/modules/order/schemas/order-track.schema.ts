import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Order } from "./order.schema";
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class OrderTrack  {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  order_id: Order;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  notes: string;
}

export type OrderTrackDocument = OrderTrack & Document;
export const OrderTrackSchema = SchemaFactory.createForClass(OrderTrack);