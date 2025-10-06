import { CreateProductDto } from './create-product.dto';
import { IsString, IsNumber, IsOptional, IsBoolean, IsMongoId, Min, IsArray } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock_quantity?: number;

  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sold?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_reviews?: number;

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @IsOptional()
  @IsMongoId({ message: 'category_id phải là một MongoDB ObjectId hợp lệ' })
  category_id?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variants?: string[];
}

