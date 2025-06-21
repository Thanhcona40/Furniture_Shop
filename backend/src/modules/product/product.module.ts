import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductSchema } from './schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductReviewSchema } from './schemas/product-review.schema';
import { VariantProductSchema } from './schemas/product-variant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Product', schema: ProductSchema}
    ]),
    MongooseModule.forFeature([
      {name: 'VariantProduct', schema: VariantProductSchema} // Assuming Category is also related to Product
    ]),
    MongooseModule.forFeature([
      {name: 'ProductReview', schema: ProductReviewSchema} // Assuming Product is related to itself
    ]),
  ],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
