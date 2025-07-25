import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Patch } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  // Public APIs - không cần guard
  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.productsService.search(query);
  }

  // Admin APIs - cần đăng nhập và role admin
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  async create(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/variants')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  async addVariant(@Param('id') id: string, @Body() variantData: any) {
    return this.productsService.addVariant(id, variantData);
  }

  @Put('variants/:variantId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  async updateVariant(@Param('variantId') variantId: string, @Body() updateVariantDto: any) {
    return this.productsService.updateVariant(variantId, updateVariantDto);
  }

  @Delete('variants/:variantId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  async removeVariant(@Param('variantId') variantId: string) {
    return this.productsService.removeVariant(variantId);
  }

  @Get('featured')
  async getFeaturedProducts() {
    return this.productsService.getFeaturedProducts();
  }

  @Get('hot')
  async getHotProducts() {
    return this.productsService.getHotProducts();
  } 
  
  @Get('new')
  async getNewProducts() {  
    return this.productsService.getNewProducts();
  }

  @Patch('/:id/featured')
  async toggleFeatured(@Param('id') id: string, @Body() body: { is_featured: boolean }) {
    return this.productsService.update(id, { is_featured: body.is_featured });
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}