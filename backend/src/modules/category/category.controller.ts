import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    // Public APIs - không cần guard
    @Get()
    async findAll() {
        return this.categoryService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    // Admin APIs - cần đăng nhập và role admin
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    async create(@Body() createCategoryDto: any) {
        return this.categoryService.create(createCategoryDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    async update(@Param('id') id: string, @Body() updateCategoryDto: any) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    async remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }
}

