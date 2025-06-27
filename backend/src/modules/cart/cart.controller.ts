import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('carts')
export class CartController {
    constructor(private cartService: CartService){}

    @Post()
    async createCart(@Body('userId') userId: string): Promise<{ cartId: string }> {
        const cartId = await this.cartService.createCart(userId);
        return { cartId };
    }

  @Get('user/:userId')
  async getCartIdByUserId(@Param('userId') userId: string): Promise<{ cartId: string | null }> {
    try {
      const cartId = await this.cartService.getCartIdByUserId(userId);
      return { cartId };
    } catch (error) {
      // If cart not found, return null instead of throwing error
      return { cartId: null };
    }
  }

  @Post('/cart-item')
  async addToCart(@Body() cartData: any) {
    return this.cartService.addToCart(cartData);
  }

  @Get('/cart-item')
  async getCartItems(@Query('cartId') cartId: string) {
    return this.cartService.getCartItems(cartId);
  }

  @Put('/cart-item/:id/variant')
  async updateCartItemVariant(@Param('id') id: string, @Body() body: { variant_id: string }) {
    return this.cartService.updateCartItemVariantById(id, body.variant_id);
  }

  @Put('/cart-item/:id')
  async updateCartItem(@Param('id') id: string, @Body() updateData: any) {
    return this.cartService.updateCartItem(id, updateData);
  }

  @Delete('/cart-item/:id')
  async removeCartItem(@Param('id') id: string) {
    return this.cartService.removeCartItem(id);
  }
}
