import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel : Model<CategoryDocument> ){}

    async create(createCategoryDto: any): Promise<Category> {
        const createdCategory = new this.categoryModel(createCategoryDto);
        return createdCategory.save();
    }

    async findAll(): Promise<Category[]> {
        return this.categoryModel.find().exec();
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
