import { api } from "../config/api";

export const getCategories = () => api.get('/categories');
export const addCategory = (data) => api.post('/categories', data);