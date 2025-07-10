import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('blogs')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    // Public APIs - không cần guard
    @Get()
    async findAll() {
        return this.blogService.findAll();
    }

    @Get('featured')
    async findFeatured() {
        return this.blogService.findFeatured();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.blogService.findOne(id);
    }

    // Admin APIs - cần đăng nhập và role admin
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    async create(@Body() createBlogDto: any) {
        return this.blogService.create(createBlogDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    async update(@Param('id') id: string, @Body() updateBlogDto: any) {
        return this.blogService.update(id, updateBlogDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    async remove(@Param('id') id: string) {
        return this.blogService.remove(id);
    }
} 