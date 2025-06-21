import { api } from "../config/api";

export const loginApi = async (data) => {
  return api.post(`/auth/login`, data);
};

export const registerApi = async (data) => {
  return api.post(`/auth/register`, data);
};