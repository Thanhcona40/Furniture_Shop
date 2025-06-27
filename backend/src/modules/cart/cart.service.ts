import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartDocument } from './schemas/cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartItem, CartItemDocument } from './schemas/cart-item.schema';
import { VariantProduct, VariantProductDocument } from '../product/schemas/product-variant.schema';

@Injectable()
export class CartService {
    constructor(
      @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
      @InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>,
      @InjectModel(VariantProduct.name) private variantModel: Model<VariantProductDocument>
    ){}

    async createCart(userId: string): Promise<string> {
        const findCart = await this.cartModel.findOne({ user_id: userId }).exec();
        if(findCart) throw new ConflictException('Giỏ hàng đã tồn tại rồi');
        
        const cart = new this.cartModel({ user_id: userId });
        await cart.save();
        return cart._id;
    }

  async getCartIdByUserId(userId: string): Promise<string | null> {
    const cart = await this.cartModel.findOne({ user_id: userId }).exec();
    if(!cart) throw new NotFoundException('Không tìm thấy giỏ hàng')
    return cart ? cart._id : null;
  }

  async addToCart(cartData: Partial<CartItem>): Promise<CartItem> {
    // Check if item already exists in cart with same product and variant
    const existingItem = await this.cartItemModel.findOne({
      cart_id: cartData.cart_id,
      product_id: cartData.product_id,
      variant_id: cartData.variant_id
    }).exec();

    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += cartData.quantity || 1;
      return await existingItem.save();
    }

    // Create new cart item if it doesn't exist
    const cartItem = new this.cartItemModel(cartData);
    return await cartItem.save();
  }

  async getCartItems(cartId: string): Promise<CartItem[]> {
    return await this.cartItemModel.find({ cart_id: cartId })
      .populate({
        path: 'product_id',
        select: 'name thumbnail_url price variants',
        populate: { path: 'variants', select: 'color dimensions price quantity url_media' }
      })
      .populate('variant_id', 'color dimensions price quantity url_media')
      .exec();
  }

  async updateCartItem(cartItemId: string, updateData: Partial<CartItem>): Promise<CartItem | null> {
    // Validate quantity if present
    if (updateData.quantity !== undefined && updateData.quantity < 1) {
      throw new ConflictException('Số lượng phải lớn hơn hoặc bằng 1');
    }

    const updatedItem = await this.cartItemModel.findByIdAndUpdate(cartItemId, updateData, { new: true })
      .populate('product_id', 'name thumbnail_url price')
      .populate('variant_id', 'color dimensions price quantity url_media')
      .exec();

    if (!updatedItem) {
      throw new NotFoundException('Không tìm thấy mục trong giỏ hàng');
    }

    return updatedItem;
  }

  async updateCartItemVariant(cartItemId: string, variantData: { color: string; dimensions: string }): Promise<CartItem | null> {
    // Get the cart item and ensure it exists
    const cartItem = await this.cartItemModel.findById(cartItemId).populate('product_id').exec();
    if (!cartItem) {
      throw new NotFoundException('Không tìm thấy mục trong giỏ hàng');
    }

    // Use the correct product ID for the variant lookup
    const productId = (cartItem.product_id && (cartItem.product_id as any)._id) ? (cartItem.product_id as any)._id : cartItem.product_id;

    // Find the variant that matches the color and dimensions for this product
    const variant = await this.variantModel.findOne({
      product_id: productId,
      color: variantData.color,
      dimensions: variantData.dimensions
    }).exec();

    if (!variant) {
      throw new NotFoundException('Không tìm thấy biến thể sản phẩm phù hợp');
    }

    // Check for duplicate cart item with same product and new variant
    const duplicateItem = await this.cartItemModel.findOne({
      cart_id: cartItem.cart_id,
      product_id: productId,
      variant_id: variant._id
    }).exec();

    if (duplicateItem && duplicateItem._id.toString() !== cartItemId) {
      // Merge quantities and remove the old item
      duplicateItem.quantity += cartItem.quantity;
      await duplicateItem.save();
      await this.cartItemModel.findByIdAndDelete(cartItemId).exec();
      return await this.cartItemModel.findById(duplicateItem._id)
        .populate('product_id', 'name thumbnail_url price')
        .populate('variant_id', 'color dimensions price quantity url_media')
        .exec();
    }

    // Update the cart item with the new variant_id
    const updatedItem = await this.cartItemModel.findByIdAndUpdate(
      cartItemId,
      { variant_id: variant._id },
      { new: true }
    )
      .populate('product_id', 'name thumbnail_url price')
      .populate('variant_id', 'color dimensions price quantity url_media')
      .exec();

    if (!updatedItem) {
      throw new NotFoundException('Không thể cập nhật biến thể cho mục giỏ hàng');
    }

    return updatedItem;
  }

  async removeCartItem(cartItemId: string): Promise<void> {
    await this.cartItemModel.findByIdAndDelete(cartItemId).exec();
  }

  async updateCartItemVariantById(cartItemId: string, variantId: string): Promise<CartItem | null> {
    // Lấy cart item hiện tại
    const cartItem = await this.cartItemModel.findById(cartItemId).exec();
    if (!cartItem) throw new NotFoundException('Không tìm thấy mục trong giỏ hàng');

    // Kiểm tra nếu đã có cart item khác cùng product_id và variantId thì gộp quantity
    const duplicateItem = await this.cartItemModel.findOne({
      cart_id: cartItem.cart_id,
      product_id: cartItem.product_id,
      variant_id: variantId
    }).exec();

    if (duplicateItem && duplicateItem._id.toString() !== cartItemId) {
      duplicateItem.quantity += cartItem.quantity;
      await duplicateItem.save();
      await this.cartItemModel.findByIdAndDelete(cartItemId).exec();
      return await this.cartItemModel.findById(duplicateItem._id)
        .populate('product_id', 'name thumbnail_url price variants')
        .populate('variant_id', 'color dimensions price quantity url_media')
        .exec();
    }

    // Cập nhật variant_id mới
    const updatedItem = await this.cartItemModel.findByIdAndUpdate(
      cartItemId,
      { variant_id: variantId },
      { new: true }
    )
      .populate('product_id', 'name thumbnail_url price variants')
      .populate('variant_id', 'color dimensions price quantity url_media')
      .exec();

    if (!updatedItem) throw new NotFoundException('Không thể cập nhật biến thể cho mục giỏ hàng');
    return updatedItem;
  }
}
