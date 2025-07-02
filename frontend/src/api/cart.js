import { api } from "../config/api";

export const createCartForUser = async () => {
  const response = await api.post("/carts");
  return response.data.cartId;
};

export const getCartIdByUserId = async () => {
  try {
    const response = await api.get(`/carts/user`);
    return response.data.cartId;
  } catch (error) {
    return null;
  }
};

export const addToCart = async (cartData) => {
  const response = await api.post(`/carts/cart-item`, cartData);
  return response.data;
};

export const getCartItems = async (cartId) => {
  const response = await api.get(`/carts/cart-item?cartId=${cartId}`);
  return response.data;
};

export const updateCartItem = async (cartItemId, updateData) => {
  const response = await api.put(`/carts/cart-item/${cartItemId}`, updateData);
  return response.data;
};

export const updateCartItemVariant = async (cartItemId, variantId) => {
  const response = await api.put(`/carts/cart-item/${cartItemId}/variant`, { variant_id: variantId });
  return response.data;
};

export const removeCartItem = async (cartItemId) => {
  await api.delete(`/carts/cart-item/${cartItemId}`);
};

// Xóa toàn bộ cart items
export const clearCartItems = async (cartId) => {
  await api.delete(`/carts/cart-item/clear?cartId=${cartId}`);
};

// Xóa nhiều cart items theo danh sách ID
export const removeCartItems = async (cartItemIds) => {
  await api.delete(`/carts/cart-item/batch`, { data: { cartItemIds } });
};