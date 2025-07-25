import axios from "axios"
import { toast } from "react-toastify"


export const API_BASE_URL = 'https://furniture-shop-x2n4.onrender.com';

export const api = axios.create({
        baseURL: API_BASE_URL,
        headers:{
            "Content-Type":"application/json"
        }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`; // Cập nhật header Authorization
            config.headers["Content-Type"] = 'application/json'
        }
        return config;
    }, 
    (error) => {
        return Promise.reject(error);
});

// Thêm interceptor cho response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response && 
            error.response.status === 401 &&
            (localStorage.getItem("token") || localStorage.getItem("user"))
        ) {
            toast.error("Phiên đăng nhập của bạn đã hết hạn, Vui lòng đăng nhập lại để tiếp tục mua sắm");
            setTimeout(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }, 5000);
        }
        return Promise.reject(error);
    }
);