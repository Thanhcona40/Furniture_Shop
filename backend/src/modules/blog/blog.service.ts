import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { Model } from 'mongoose';

@Injectable()
export class BlogService {
    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

    async create(createBlogDto: any): Promise<Blog> {
        const createdBlog = new this.blogModel(createBlogDto);
        return createdBlog.save();
    }

    async findAll(): Promise<Blog[]> {
        return this.blogModel.find().sort({ createdAt: -1 }).exec();
    }

    async findFeatured(): Promise<Blog[]> {
        return this.blogModel.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(3).exec();
    }

    async findOne(id: string): Promise<Blog> {
        const blog = await this.blogModel.findById(id).exec();
        if (!blog) {
            throw new NotFoundException('Không tìm thấy bài viết');
        }
        return blog;
    }

    async update(id: string, updateBlogDto: any): Promise<Blog> {
        const updatedBlog = await this.blogModel
            .findByIdAndUpdate(id, updateBlogDto, { new: true, runValidators: true })
            .exec();
        if (!updatedBlog) {
            throw new NotFoundException('Không tìm thấy bài viết');
        }
        return updatedBlog;
    }

    async remove(id: string): Promise<void> {
        const result = await this.blogModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException('Không tìm thấy bài viết');
        }
    }
} 