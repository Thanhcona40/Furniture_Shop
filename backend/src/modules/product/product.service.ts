import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { VariantProduct, VariantProductDocument } from './schemas/product-variant.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(VariantProduct.name) private variantModel: Model<VariantProductDocument>,
  ) {}

  async create(createProductDto: any): Promise<Product> {
    // Kiểm tra category_id trước khi tạo
    if (createProductDto.category_id === '' || createProductDto.category_id === null) {
      delete createProductDto.category_id; // Loại bỏ nếu rỗng
    }
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel
      .find()
      .populate('category_id', '_id name') // Chỉ lấy _id và name
      .populate('variants')
      .exec();
    return products;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('category_id', '_id name')
      .populate({
        path: 'variants',
        model: VariantProduct.name,
        select: '_id product_id color dimensions price quantity url_media', // Lấy các trường cần thiết
      })
      .exec();
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    return product;
  }

  async update(id: string, updateProductDto: any): Promise<Product> {
    // Kiểm tra và loại bỏ category_id rỗng
    if (updateProductDto.category_id === '' || updateProductDto.category_id === null) {
      updateProductDto.category_id = null; // Đặt null thay vì rỗng
    }
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true, runValidators: true })
      .populate('category_id', '_id name')
      .populate('variants')
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    await this.variantModel.deleteMany({ product_id: id }).exec();
    await this.productModel.findByIdAndDelete(id).exec();
  }

  async addVariant(productId: string, variantData: any): Promise<VariantProduct> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    const variant = new this.variantModel({ ...variantData, product_id: productId });
    const savedVariant = await variant.save();
    product.variants.push(savedVariant._id);
    await product.save();
    return savedVariant;
  }

  async updateVariant(variantId: string, updateVariantDto: any): Promise<VariantProduct> {
    const updatedVariant = await this.variantModel
      .findByIdAndUpdate(variantId, updateVariantDto, { new: true, runValidators: true })
      .exec();
    if (!updatedVariant) {
      throw new NotFoundException('Không tìm thấy biến thể');
    }
    return updatedVariant;
  }

  async removeVariant(variantId: string): Promise<void> {
    const variant = await this.variantModel.findById(variantId).exec();
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    await this.productModel.updateOne(
      { _id: variant.product_id },
      { $pull: { variants: variantId } }
    ).exec();
    await this.variantModel.findByIdAndDelete(variantId).exec();
  }

  async decreaseStock(variantId: string, quantity: number): Promise<void> {
    const variant = await this.variantModel.findById(variantId);
    if (!variant) {
      throw new NotFoundException('Không tìm thấy biến thể');
    }
    if (variant.quantity < quantity) {
      throw new NotFoundException('Không đủ hàng trong kho');
    }
    variant.quantity -= quantity;
    await variant.save();
  }

  async decreaseProductStock(productId: string, quantity: number): Promise<void> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    if (product.stock_quantity < quantity) {
      throw new NotFoundException('Không đủ hàng trong kho');
    }
    product.stock_quantity -= quantity;
    await product.save();
  }

  async search(keyword: string): Promise<Product[]> {
    if (!keyword || keyword.trim() === '') {
      return this.findAll();
    }

    const searchRegex = new RegExp(keyword, 'i'); // Case-insensitive search
    
    const products = await this.productModel
      .find({
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      })
      .populate('category_id', '_id name')
      .populate('variants')
      .exec();

    // Filter by category name if keyword matches category
    const categorySearchRegex = new RegExp(keyword, 'i');
    const categoryFiltered = products.filter(product => {
      const categoryName = product.category_id?.name;
      return categoryName && categorySearchRegex.test(categoryName);
    });

    // If we found products by category name, return those
    if (categoryFiltered.length > 0) {
      return categoryFiltered;
    }

    return products;
  }
}