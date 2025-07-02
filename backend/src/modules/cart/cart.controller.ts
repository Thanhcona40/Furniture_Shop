import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('carts')
@UseGuards(AuthGuard('jwt'))
export class CartController {
    constructor(private cartService: CartService){}

    @Post()
    async createCart(@Request() req): Promise<{ cartId: string }> {
        const cartId = await this.cartService.createCart(req.user.user_id);
        return { cartId };
    }

  @Get('user')
  async getCartIdByUserId(@Request() req): Promise<{ cartId: string | null }> {
    const cartId = await this.cartService.getCartIdByUserId(req.user.user_id);
    return { cartId };
  }

  @Post('/cart-item')
  async addToCart(@Body() cartData: any, @Request() req) {
    console.log('Add to cart request:', { cartData, userId: req.user.user_id });
    
    // Lấy hoặc tạo cart_id cho user nếu chưa có trong cartData
    let cartId = cartData.cart_id;
    if (!cartId) {
      cartId = await this.cartService.getCartIdByUserId(req.user.user_id);
      if (!cartId) {
        cartId = await this.cartService.createCart(req.user.user_id);
      }
    }
    
    console.log('Using cartId:', cartId);
    
    return this.cartService.addToCart({ ...cartData, cart_id: cartId });
  }

  @Get('/cart-item')
  async getCartItems(@Query('cartId') cartId: string, @Request() req) {
    return this.cartService.getCartItems(cartId);
  }

  @Put('/cart-item/:id/variant')
  async updateCartItemVariant(@Param('id') id: string, @Body() body: { variant_id: string }, @Request() req) {
    return this.cartService.updateCartItemVariantById(id, body.variant_id);
  }

  @Put('/cart-item/:id')
  async updateCartItem(@Param('id') id: string, @Body() updateData: any, @Request() req) {
    return this.cartService.updateCartItem(id, updateData);
  }

  @Delete('/cart-item/batch')
  async removeCartItems(@Body() body: { cartItemIds: string[] }, @Request() req) {
    return this.cartService.removeCartItems(body.cartItemIds);
  }

  @Delete('/cart-item/:id')
  async removeCartItem(@Param('id') id: string, @Request() req) {
    return this.cartService.removeCartItem(id);
  }

  @Delete('/cart-item/clear')
  async clearCartItems(@Query('cartId') cartId: string, @Request() req) {
    return this.cartService.clearCartItems(cartId);
  }
}
