import { api } from "../config/api";

export const getProvinces = () => api.get("/address/provinces");
export const getDistricts = (province_id) => api.get(`/address/districts/${province_id}`);
export const getWards = (district_id) => api.get(`/address/wards/${district_id}`);
export const getDefaultAddress = async () => {
  return api.get(`/address/default`);
};
export const saveAddress = (data) => api.post("/address", data);
export const updateAddress = (id, data) => api.put(`/address/${id}`, data);

// Thêm các hàm lấy tên theo id riêng biệt
export const getProvinceNameById = (id) => api.get(`/address/province/${id}`);
export const getDistrictNameById = (id) => api.get(`/address/district/${id}`);
export const getWardNameById = (id) => api.get(`/address/ward/${id}`);

// API cho quản lý địa chỉ user
export const getUserAddresses = () => api.get("/address/user");
export const createUserAddress = (data) => api.post("/address", data);
export const updateUserAddress = (id, data) => api.put(`/address/${id}`, data);
export const deleteUserAddress = (id) => api.delete(`/address/${id}`);
export const setDefaultAddress = (id) => api.put(`/address/${id}/set-default`); 