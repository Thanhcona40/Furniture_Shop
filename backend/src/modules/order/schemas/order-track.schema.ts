import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Order } from "./order.schema";
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class OrderTrack  {
  @Prop({ type: Types.ObjectId, ref: 'Order' })
  order_id: Order;

  @Prop() status: string;
  @Prop() notes: string;
}

export type OrderTrackDocument = OrderTrack & Document;
export const OrderTrackSchema = SchemaFactory.createForClass(OrderTrack);