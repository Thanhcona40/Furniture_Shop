import { addToCart, createCartForUser, getCartIdByUserId, getCartItems, removeCartItem, updateCartItem, updateCartItemVariant as updateCartItemVariantApi } from "../../api/cart";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartId: null,
  cartItems: [],
  status: "idle",
  error: null,
};

export const initializeCart = createAsyncThunk("cart/initializeCart", async (userId) => {
  // Try to get existing cart
  const cartId = await getCartIdByUserId(userId);
  if (cartId) {
    return cartId;
  }
  
  // Create new cart if none exists
  const newCartId = await createCartForUser(userId);
  return newCartId;
});

export const fetchCartItems = createAsyncThunk("cart/fetchCartItems", async (cartId) => {
  const response = await getCartItems(cartId);
  return response;
});

export const addCartItem = createAsyncThunk("cart/addCartItem", async (cartData, { dispatch, getState }) => {
  const response = await addToCart(cartData);
  // Refresh cart items after adding
  const state = getState();
  if (state.cart.cartId) {
    dispatch(fetchCartItems(state.cart.cartId));
  }
  return response;
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

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initializeCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartId = action.payload;
      })
      .addCase(initializeCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addCartItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCartItem.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Only update the quantity property, not the entire item
        const index = state.cartItems.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.cartItems[index].quantity = action.payload.quantity;
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCartItemVariant.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCartItemVariant.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update variant_id cho item
        const index = state.cartItems.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.cartItems[index].variant_id = action.payload.variant_id;
        }
      })
      .addCase(updateCartItemVariant.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeCartItemAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeCartItemAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Optimistic update - remove the specific item
        state.cartItems = state.cartItems.filter((item) => item._id !== action.payload);
      })
      .addCase(removeCartItemAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;