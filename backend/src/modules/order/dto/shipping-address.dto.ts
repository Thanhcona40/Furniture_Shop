import { IsBoolean, IsOptional, IsString } from "class-validator";

export class ShippingAddressDto {
    @IsString()
    full_name: string;
  
    @IsString()
    email: string;
  
    @IsString()
    phone: string;
  
    @IsString()
    detail: string;
  
    @IsString()
    province_id: string;
  
    @IsString()
    district_id: string;
  
    @IsString()
    ward_id: string;
  
    @IsOptional()
    @IsBoolean()
    is_default?: boolean;
  }