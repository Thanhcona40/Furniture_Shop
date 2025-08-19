import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './category.schema';
import { Model } from 'mongoose';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel : Model<CategoryDocument>,
                 private readonly redisService: RedisService){}

    async create(createCategoryDto: any): Promise<Category> {
        const createdCategory = new this.categoryModel(createCategoryDto);
        return createdCategory.save();
    }

    async findAll(): Promise<Category[]> {
        // const cacheKey = 'categories:all';
        // const redis = this.redisService.getClient();
        // let cached: any;
        // try{
        //     cached = await redis.get(cacheKey);
        // } catch (err) {
        //     console.warn('Redis GET error:', err.message);
        // }
        // if (cached) {
        //     console.log(`Cache HIT for ${cacheKey}`);
        //     return JSON.parse(cached);
        // }
        const category  = await this.categoryModel.find().exec();
        // try {
        //     await redis.setEx(cacheKey, 3600, JSON.stringify(category));
        //     console.log(`Cache MISS –> Cache SET for ${cacheKey}`);
        // } catch (err) {
        //     console.warn('Redis SET error:', err.message);
        // }

        return category;
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
        throw new NotFoundException('Không tìm thấy danh mục');
        }
        return category;
    }

    async update(id: string, updateCategoryDto: any): Promise<Category> {
        const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(id, updateCategoryDto, { new: true, runValidators: true })
        .exec();
        if (!updatedCategory) {
        throw new NotFoundException('Không tìm thấy danh mục');
        }
        return updatedCategory;
    }

    async remove(id: string): Promise<void> {
        const result = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!result) {
        throw new NotFoundException('Không tìm thấy danh mục');
        }
    }
}
