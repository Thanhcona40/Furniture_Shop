import {api} from "../config/api"

export const createVnpayUrl = async (data) => {
  const res = await api.post(`/payment/create-vnpay-url`, data);
  return res.data;
};

export const vnpayReturn = async (params) => {
  const res = await api.get(`/payment/vnpay-return`, { params });
  return res.data;
};

export default {
  createVnpayUrl,
  vnpayReturn,
}; 