import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    async create(@Body() createCategoryDto: any) {
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    async findAll() {
        return this.categoryService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCategoryDto: any) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }
}

