import { IsString, IsEmail, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  detail?: string;

  @IsString()
  @IsOptional()
  province_id?: string;

  @IsString()
  @IsOptional()
  district_id?: string;

  @IsString()
  @IsOptional()
  ward_id?: string;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
} 