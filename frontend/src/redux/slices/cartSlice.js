import { createSlice } from "@reduxjs/toolkit";
import { 
  initializeCart, 
  fetchCartItems, 
  addCartItem, 
  updateCartItemQuantity, 
  updateCartItemVariant, 
  removeCartItemAction, 
  clearCartItemsAction, 
  removeCartItemsAction 
} from "../actions/cartActions";
import { handlePending, handleRejected } from './helpers';

// Re-export actions để backward compatibility
export { 
  initializeCart, 
  fetchCartItems, 
  addCartItem, 
  updateCartItemQuantity, 
  updateCartItemVariant, 
  removeCartItemAction, 
  clearCartItemsAction, 
  removeCartItemsAction 
} from "../actions/cartActions";

const initialState = {
  cartId: null,
  cartItems: [],
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartId = null;
      state.cartItems = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCart.pending, handlePending)
      .addCase(initializeCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartId = action.payload;
      })
      .addCase(initializeCart.rejected, handleRejected)
      .addCase(fetchCartItems.pending, handlePending)
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItems.rejected, handleRejected)
      .addCase(addCartItem.pending, handlePending)
      .addCase(addCartItem.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addCartItem.rejected, handleRejected)
      .addCase(updateCartItemQuantity.pending, handlePending)
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Only update the quantity property, not the entire item
        const index = state.cartItems.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.cartItems[index].quantity = action.payload.quantity;
        }
      })
      .addCase(updateCartItemQuantity.rejected, handleRejected)
      .addCase(updateCartItemVariant.pending, handlePending)
      .addCase(updateCartItemVariant.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update variant_id cho item
        const index = state.cartItems.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.cartItems[index].variant_id = action.payload.variant_id;
        }
      })
      .addCase(updateCartItemVariant.rejected, handleRejected)
      .addCase(removeCartItemAction.pending, handlePending)
      .addCase(removeCartItemAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Optimistic update - remove the specific item
        state.cartItems = state.cartItems.filter((item) => item._id !== action.payload);
      })
      .addCase(removeCartItemAction.rejected, handleRejected)
      .addCase(clearCartItemsAction.pending, handlePending)
      .addCase(clearCartItemsAction.fulfilled, (state) => {
        state.status = "succeeded";
        state.cartItems = [];
      })
      .addCase(clearCartItemsAction.rejected, handleRejected)
      .addCase(removeCartItemsAction.pending, handlePending)
      .addCase(removeCartItemsAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Remove the specified items from state
        state.cartItems = state.cartItems.filter((item) => !action.payload.includes(item._id));
      })
      .addCase(removeCartItemsAction.rejected, handleRejected);
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;