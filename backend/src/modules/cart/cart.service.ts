import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartDocument } from './schemas/cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartItem, CartItemDocument } from './schemas/cart-item.schema';
import { VariantProduct, VariantProductDocument } from '../product/schemas/product-variant.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>,
    @InjectModel(VariantProduct.name) private variantModel: Model<VariantProductDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ){}

  async createCart(userId: string): Promise<string> {
    const findCart = await this.cartModel.findOne({ user_id: userId }).exec();
    if(findCart) return findCart._id;
    
    const cart = new this.cartModel({ user_id: userId });
    await cart.save();
    return cart._id;
  }

  async getCartIdByUserId(userId: string): Promise<string | null> {
    const cart = await this.cartModel.findOne({ user_id: userId }).exec();
    return cart ? cart._id : null;
  }

  async addToCart(cartData: Partial<CartItem>): Promise<CartItem> {
    const query: any = {
      cart_id: cartData.cart_id,
      product_id: cartData.product_id
    };
    
    if (cartData.variant_id) {
      query.variant_id = cartData.variant_id;
    } else {
      query.variant_id = { $exists: false };
    }

    const existingItem = await this.cartItemModel.findOne(query).exec();

    if (existingItem) {
      existingItem.quantity += cartData.quantity || 1;
      return await existingItem.save();
    }

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
      .populate({
        path: 'variant_id',
        select: 'color dimensions price quantity url_media',
        options: { strictPopulate: false }
      })
      .exec();
  }

  async updateCartItem(cartItemId: string, updateData: Partial<CartItem>): Promise<CartItem | null> {
    // Validate quantity if present
    if (updateData.quantity !== undefined && updateData.quantity < 1) {
      throw new ConflictException('Số lượng phải lớn hơn hoặc bằng 1');
    }

    const updatedItem = await this.cartItemModel.findByIdAndUpdate(cartItemId, updateData, { new: true })
      .populate('product_id', 'name thumbnail_url price')
      .populate({
        path: 'variant_id',
        select: 'color dimensions price quantity url_media',
        options: { strictPopulate: false }
      })
      .exec();

    if (!updatedItem) {
      throw new NotFoundException('Không tìm thấy mục trong giỏ hàng');
    }

    return updatedItem;
  }

  async updateCartItemVariant(cartItemId: string, variantData: { color: string; dimensions: string }): Promise<CartItem | null> {
    const cartItem = await this.cartItemModel.findById(cartItemId).populate('product_id').exec();
    if (!cartItem) {
      throw new NotFoundException('Không tìm thấy mục trong giỏ hàng');
    }
    if (!cartItem.product_id) {
      throw new NotFoundException('Không tìm thấy sản phẩm liên kết với mục giỏ hàng');
    }
    // Lấy product_id từ cartItem, nếu là ObjectId thì lấy _id, nếu là string thì giữ nguyên
    const productId = (cartItem.product_id && (cartItem.product_id as any)._id) ? (cartItem.product_id as any)._id : cartItem.product_id;

    const variant = await this.variantModel.findOne({
      product_id: productId,
      color: variantData.color,
      dimensions: variantData.dimensions
    }).exec();

    if (!variant) {
      throw new NotFoundException('Không tìm thấy biến thể sản phẩm phù hợp');
    }

    const duplicateItem = await this.cartItemModel.findOne({
      cart_id: cartItem.cart_id,
      product_id: productId,
      variant_id: variant._id
    }).exec();

    // Kiểm tra nếu đã có cart item khác cùng product_id và variant_id thì gộp quantity
    if (duplicateItem && duplicateItem._id.toString() !== cartItemId) {
      duplicateItem.quantity += cartItem.quantity;
      await duplicateItem.save();
      await this.cartItemModel.findByIdAndDelete(cartItemId).exec();
      return await this.cartItemModel.findById(duplicateItem._id)
        .populate('product_id', 'name thumbnail_url price')
        .populate({
          path: 'variant_id',
          select: 'color dimensions price quantity url_media',
          options: { strictPopulate: false }
        })
        .exec();
    }
    // Cập nhật variant_id mới
    const updatedItem = await this.cartItemModel.findByIdAndUpdate(
      cartItemId,
      { variant_id: variant._id },
      { new: true }
    )
      .populate('product_id', 'name thumbnail_url price')
      .populate({
        path: 'variant_id',
        select: 'color dimensions price quantity url_media',
        options: { strictPopulate: false }
      })
      .exec();

    if (!updatedItem) {
      throw new NotFoundException('Không thể cập nhật biến thể cho mục giỏ hàng');
    }

    return updatedItem;
  }

  async removeCartItem(cartItemId: string): Promise<void> {
    const cartItem = await this.cartItemModel.findById(cartItemId).exec();
    if (!cartItem) {
      throw new NotFoundException('Không tìm thấy mục trong giỏ hàng');
    }
    
    //Tăng lại quantity cho product và product variant nếu có
    if (cartItem.variant_id) {
      await this.variantModel.findByIdAndUpdate(cartItem.variant_id, {
        $inc: { quantity: cartItem.quantity }
      }).exec();
    } else {
      await this.productModel.findByIdAndUpdate(cartItem.product_id, {
        $inc: { stock_quantity: cartItem.quantity }
      }).exec();
    }
    await this.cartItemModel.findByIdAndDelete(cartItemId).exec();
  }

  async clearCartItems(cartId: string): Promise<void> {
    const cart = await this.cartModel.findById(cartId).exec();
    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }
    await this.cartItemModel.deleteMany({ cart_id: cartId }).exec();
  }

  async removeCartItems(cartItemIds: string[]): Promise<void> {
     // Tăng lại quantity cho tất cả các sản phẩm trong giỏ hàng
    const cartItems = await this.cartItemModel.find({ _id: { $in: cartItemIds } }).exec();
    for (const item of cartItems) {
      if (item.variant_id) {
        await this.variantModel.findByIdAndUpdate(item.variant_id, {
          $inc: { quantity: item.quantity }
        }).exec();
      } else {
        await this.productModel.findByIdAndUpdate(item.product_id, {
          $inc: { stock_quantity: item.quantity }
        }).exec();
      }
    }
    await this.cartItemModel.deleteMany({ _id: { $in: cartItemIds } }).exec();
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
        .populate({
          path: 'variant_id',
          select: 'color dimensions price quantity url_media',
          options: { strictPopulate: false }
        })
        .exec();
    }

    // Cập nhật variant_id mới
    const updatedItem = await this.cartItemModel.findByIdAndUpdate(
      cartItemId,
      { variant_id: variantId },
      { new: true }
    )
      .populate('product_id', 'name thumbnail_url price variants')
      .populate({
        path: 'variant_id',
        select: 'color dimensions price quantity url_media',
        options: { strictPopulate: false }
      })
      .exec();

    if (!updatedItem) throw new NotFoundException('Không thể cập nhật biến thể cho mục giỏ hàng');
    return updatedItem;
  }
}
