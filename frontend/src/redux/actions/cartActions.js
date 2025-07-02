import { createAsyncThunk } from '@reduxjs/toolkit';
import { addToCart, createCartForUser, getCartIdByUserId, getCartItems, removeCartItem, updateCartItem, updateCartItemVariant as updateCartItemVariantApi, clearCartItems, removeCartItems } from "../../api/cart";

export const initializeCart = createAsyncThunk("cart/initializeCart", async (_, { dispatch, rejectWithValue }) => {
  try {
    // Try to get existing cart
    const cartId = await getCartIdByUserId();
    if (cartId) {
      // Fetch cart items after getting existing cart
      dispatch(fetchCartItems(cartId));
      return cartId;
    }
    
    // Create new cart if none exists
    const newCartId = await createCartForUser();
    // Fetch cart items after creating new cart
    dispatch(fetchCartItems(newCartId));
    return newCartId;
  } catch (error) {
    console.error('Error initializing cart:', error);
    return rejectWithValue(error?.response?.data?.message || 'Lỗi khởi tạo giỏ hàng');
  }
});

export const fetchCartItems = createAsyncThunk("cart/fetchCartItems", async (cartId, { rejectWithValue }) => {
  try {
    const response = await getCartItems(cartId);
    return response;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return rejectWithValue(error?.response?.data?.message || 'Lỗi lấy danh sách giỏ hàng');
  }
});

export const addCartItem = createAsyncThunk("cart/addCartItem", async (cartData, { dispatch, getState, rejectWithValue }) => {
  try {
    const response = await addToCart(cartData);
    // Refresh cart items after adding
    if (cartData.cart_id) {
      dispatch(fetchCartItems(cartData.cart_id));
    }
    return response;
  } catch (error) {
    console.error('Error adding cart item:', error);
    return rejectWithValue(error?.response?.data?.message || 'Lỗi thêm vào giỏ hàng');
  }
});

export const updateCartItemQuantity = createAsyncThunk("cart/updateCartItem", async ({ cartItemId, quantity }, { dispatch, getState }) => {
  const response = await updateCartItem(cartItemId, { quantity });
  return response;
});

export const updateCartItemVariant = createAsyncThunk(
  "cart/updateCartItemVariant",
  async ({ cartItemId, variantId }) => {
    const response = await updateCartItemVariantApi(cartItemId, variantId);
    return response;
  }
);

export const removeCartItemAction = createAsyncThunk("cart/removeCartItem", async (cartItemId, { dispatch, getState }) => {
  await removeCartItem(cartItemId);
  return cartItemId;
});

// Action để xóa toàn bộ cart items
export const clearCartItemsAction = createAsyncThunk("cart/clearCartItems", async (_, { getState }) => {
  const state = getState();
  if (state.cart.cartId) {
    await clearCartItems(state.cart.cartId);
  }
});

// Action để xóa nhiều cart items theo danh sách ID
export const removeCartItemsAction = createAsyncThunk("cart/removeCartItems", async (cartItemIds, { getState }) => {
  await removeCartItems(cartItemIds);
  return cartItemIds;
}); 