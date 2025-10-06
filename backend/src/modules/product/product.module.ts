import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductSchema } from './schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductReviewSchema } from './schemas/product-review.schema';
import { VariantProductSchema } from './schemas/product-variant.schema';
import { CategorySchema } from '../category/category.schema';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Product', schema: ProductSchema},
      {name: 'VariantProduct', schema: VariantProductSchema},
      {name: 'ProductReview', schema: ProductReviewSchema},
      {name: 'Category', schema: CategorySchema}
    ]),
    AuthModule,
    RedisModule
  ],
  providers: [ProductService, RolesGuard],
  controllers: [ProductController],
  exports: [ProductService, MongooseModule]
})
export class ProductModule {}
