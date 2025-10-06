import axios from "axios";
import { toast } from "react-toastify";
import { storage } from "../utils/storage";

// Use environment variable with fallback
const isDevelopment = process.env.NODE_ENV === 'development';
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
  (isDevelopment ? 'http://localhost:3000' : 'https://furniture-shop-x2n4.onrender.com/');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["Content-Type"] = 'application/json';
    }
    return config;
  }, 
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - session expired
    if (
      error.response && 
      error.response.status === 401 &&
      (storage.getToken() || storage.getUser())
    ) {
      toast.error("Phiên đăng nhập của bạn đã hết hạn, Vui lòng đăng nhập lại để tiếp tục mua sắm");
      
      setTimeout(() => {
        storage.clearAuth();
        window.location.href = "/login";
      }, 5000);
    }
    
    return Promise.reject(error);
  }
);