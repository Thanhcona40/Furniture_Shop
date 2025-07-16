import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const createVnpayUrl = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/payment/create-vnpay-url`, data);
  return res.data;
};

export const vnpayReturn = async (params) => {
  const res = await axios.get(`${API_BASE_URL}/payment/vnpay-return`, { params });
  return res.data;
};

export default {
  createVnpayUrl,
  vnpayReturn,
}; 