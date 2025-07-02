import axios from "axios"

export const API_BASE_URL = "http://localhost:3000"

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
