import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { VariantProduct, VariantProductDocument } from './schemas/product-variant.schema';
import { Category, CategoryDocument } from '../category/category.schema';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RedisService } from '../redis/redis.service';
import { CreateProductDto, UpdateProductDto, CreateVariantDto, UpdateVariantDto, ProductFilterDto } from './dto';

@Injectable()
export class ProductService {

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(VariantProduct.name) private variantModel: Model<VariantProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly redisService: RedisService
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(filterDto: ProductFilterDto): Promise<any> { 
    const { page = 1, limit = 12, category, minPrice, maxPrice, sortBy, search } = filterDto;
    const skip = (page - 1) * limit;

    console.log('Filter DTO:', filterDto); // DEBUG

    // Build query filter
    const query: any = {};

    // Filter by category name
    if (category) {
      console.log('=== CATEGORY FILTER DEBUG ===');
      console.log('Category param:', JSON.stringify(category));
      console.log('Category trimmed:', JSON.stringify(category.trim()));
      
      // Find category by name first (trim to handle spaces)
      const categoryDoc = await this.categoryModel.findOne({ 
        name: { $regex: new RegExp(`^${category.trim()}$`, 'i') }
      }).exec();
      
      console.log('Category found:', categoryDoc);
      
      // Also try exact match to compare
      const exactMatch = await this.categoryModel.findOne({ name: category }).exec();
      console.log('Exact match:', exactMatch);
      
      // List all categories to see what's in database
      const allCategories = await this.categoryModel.find({}).select('name').exec();
      console.log('All categories in DB:', allCategories.map(c => `"${c.name}"`));
      
      if (categoryDoc) {
        // Use ObjectId for querying
        query.category_id = new Types.ObjectId(categoryDoc._id);
        console.log('Query category_id:', query.category_id);
      } else {
        // No category found, return empty result
        console.log('No category found with name:', category);
        return { products: [], totalPages: 0, total: 0 };
      }
      console.log('=== END CATEGORY DEBUG ===');
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) {
        query.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        query.price.$lte = maxPrice;
      }
    }

    // Filter by search keyword
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex }
      ];
    }

    // Build sort options
    let sortOptions: any = {};
    switch (sortBy) {
      case 'price-asc':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'name':
      default:
        sortOptions = { name: 1 };
        break;
    }

    const [products, total] = await Promise.all([
      this.productModel
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('category_id', '_id name')
        .populate('variants')
        .exec(),
      this.productModel.countDocuments(query).exec(),     
    ]);

    console.log('Query:', JSON.stringify(query)); // DEBUG
    console.log('Products found:', products.length, 'Total:', total); // DEBUG
    
    // DEBUG: Check all products category_id
    if (products.length === 0 && category) {
      const allProductsRaw = await this.productModel.find({}).limit(5).lean().exec();
      console.log('Sample products RAW (lean):', allProductsRaw.map(p => ({
        name: p.name,
        category_id: p.category_id,
        category_id_type: typeof p.category_id,
        category_id_instanceof: p.category_id instanceof Types.ObjectId
      })));
      
      // Try to find products with the category_id we're looking for
      const testQuery1 = await this.productModel.find({ category_id: query.category_id }).lean().exec();
      console.log('Test query with ObjectId:', testQuery1.length);
      
      const testQuery2 = await this.productModel.find({ category_id: query.category_id.toString() }).lean().exec();
      console.log('Test query with String:', testQuery2.length);
    }

    const totalPages = Math.ceil(total / limit);
    return { products, totalPages, total };
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

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
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

  async addVariant(productId: string, variantData: CreateVariantDto): Promise<VariantProduct> {
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

  async updateVariant(variantId: string, updateVariantDto: UpdateVariantDto): Promise<VariantProduct> {
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

  async decreaseStock(variantId: string, quantity: number, session?: ClientSession): Promise<void> {
    const variant = await this.variantModel.findById(variantId).session(session || null);
    if (!variant) {
      throw new NotFoundException('Không tìm thấy biến thể');
    }
    if (variant.quantity < quantity) {
      throw new NotFoundException('Không đủ hàng trong kho');
    }
    variant.quantity -= quantity;
    await variant.save({ session });
  }

  async decreaseProductStock(productId: string, quantity: number, session?: ClientSession): Promise<void> {
    const product = await this.productModel.findById(productId).session(session || null);
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    if (product.stock_quantity < quantity) {
      throw new NotFoundException('Không đủ hàng trong kho');
    }
    product.stock_quantity -= quantity;
    await product.save({ session });
  }

  async search(keyword: string): Promise<Product[]> {
    if (!keyword || keyword.trim() === '') {
      throw new NotFoundException('Không có từ khóa tìm kiếm');
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
      // Type guard to check if category_id is populated
      const category = product.category_id as any;
      const categoryName = category?.name;
      return categoryName && categorySearchRegex.test(categoryName);
    });

    // If we found products by category name, return those
    if (categoryFiltered.length > 0) {
      return categoryFiltered;
    }

    return products;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    // const cacheKey = `products:featured`;
    // const redis = this.redisService.getClient();
    // let cached : any;
    // try {
    //   cached = await redis.get(cacheKey);
    // } catch (err) {
    //   console.warn('Redis GET error:', err.message);
    // }

    // if (cached) {
    //   console.log(`Cache HIT for ${cacheKey}`);
    //   return JSON.parse(cached);
    // }
    
    const featuredProducts = await this.productModel    
      .find({ is_featured: true })
      .populate('category_id', '_id name')
      .populate('variants')
      .exec();
    // try{
    //   await redis.setEx(cacheKey, 3600, JSON.stringify(featuredProducts));
    //   console.log(`Cache MISS –> Cache SET for ${cacheKey}`);
    // } catch (err){
    //   console.warn("Redis SET error: ", err.message);
    // }
    return featuredProducts;
  }

  async getHotProducts(): Promise<Product[]> {
    // const cacheKey = 'products:hot';
    // const redis = this.redisService.getClient();
    // let cached: any;
    // try{
    //   cached = await redis.get(cacheKey);
    // }
    // catch (err) {
    //   console.warn('Redis GET error:', err.message);
    // }
    // if(cacheKey){
    //   console.log(`Cache HIT for ${cacheKey}`);
    //   return JSON.parse(cached);
    // }

    const hotProducts = await this.productModel
      .find()
      .sort({ sold: -1 }) // Sắp xếp theo số lượng đã bán giảm dần
      .limit(10) // Giới hạn 10 sản phẩm hot nhất
      .populate('category_id', '_id name')
      .populate('variants')
      .exec();
    // try{
    //   await redis.setEx(cacheKey, 3600, JSON.stringify(hotProducts))
    //   console.log(`Cache MISS –> Cache SET for ${cacheKey}`);
    // } catch (err) {
    //   console.warn('Redis SET error: ', err.message);
    // }
    return hotProducts;
  }

  async getNewProducts(): Promise<Product[]> {
    // const cacheKey = 'products:new';
    // const redis = this.redisService.getClient();
    // let cached : any;
    // try{
    //   cached = await redis.get(cacheKey);
    //   console.log(`Cache HIT for ${cacheKey}`);
    // } catch(err){
    //   console.warn('Redis GET error:', err.message);
    // }
    
    // if (cached){
    //   return JSON.parse(cached);
    // }

    const newProducts = await this.productModel
      .find()
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
      .limit(10) // Giới hạn 10 sản phẩm mới nhất
      .populate('category_id', '_id name')
      .populate('variants')
      .exec();

    // try{ 
    //   await redis.setEx(cacheKey, 3600, JSON.stringify(newProducts));
    //   console.log(`Cache MISS –> Cache SET for ${cacheKey}`);
    // } catch(err) {
    //   console.warn('Redis SET error: ', err.message);
    // }
    return newProducts;
  }
}