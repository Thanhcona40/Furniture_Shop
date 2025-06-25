import { api } from "../config/api";

export const getCategories = () => api.get('/categories');
export const addCategory = (data) => api.post('/categories', data);
export const editCategory = (id, data) => api.put(`/categories/${id}`,data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);