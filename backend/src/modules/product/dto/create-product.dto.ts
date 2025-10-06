import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsBoolean, 
  IsMongoId, 
  Min, 
  IsArray, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

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
