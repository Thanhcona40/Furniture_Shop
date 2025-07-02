import { IsNumber, IsString, Min } from "class-validator";

export class OrderItemDto {
    @IsString()
    product_id: string;
  
    @IsString()
    variant_id: string;
  
    @IsNumber()
    @Min(1)
    quantity: number;
  
    @IsNumber()
    price: number;
  }