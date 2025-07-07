import { IsString, IsEmail, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  detail: string;

  @IsString()
  @IsNotEmpty()
  province_id: string;

  @IsString()
  @IsNotEmpty()
  district_id: string;

  @IsString()
  @IsNotEmpty()
  ward_id: string;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
} 