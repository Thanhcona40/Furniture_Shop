import { IsString, IsNumber, IsOptional, IsMongoId, Min } from 'class-validator';

export class UpdateVariantDto {
  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' })
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Số lượng phải lớn hơn hoặc bằng 0' })
  quantity?: number;

  @IsOptional()
  @IsString()
  url_media?: string;

  @IsOptional()
  @IsMongoId({ message: 'product_id phải là một MongoDB ObjectId hợp lệ' })
  product_id?: string;
}

