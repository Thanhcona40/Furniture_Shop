import { api } from "../config/api";

export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`)
export const addProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const addVariant = (productId, data) => api.post(`/products/${productId}/variants`, data);
export const updateVariant = (variantId, data) => api.put(`/products/variants/${variantId}`, data);
export const deleteVariant = (variantId) => api.delete(`/products/variants/${variantId}`);