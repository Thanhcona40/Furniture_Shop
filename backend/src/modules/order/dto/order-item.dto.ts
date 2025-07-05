import { IsNumber, IsString, Min, IsOptional } from "class-validator";

export class OrderItemDto {
    @IsString()
    product_id: string;
  
    @IsOptional()
    @IsString()
    variant_id?: string;
  
    @IsNumber()
    @Min(1)
    quantity: number;
  
    @IsNumber()
    price: number;
  }