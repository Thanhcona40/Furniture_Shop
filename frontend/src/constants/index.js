/**
 * Application Constants
 */

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/user/profile',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    SEARCH: '/products/search',
  },
  CART: {
    GET: '/cart',
    ADD: '/cart',
    UPDATE: (id) => `/cart/${id}`,
    REMOVE: (id) => `/cart/${id}`,
  },
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
  },
  CATEGORIES: '/categories',
  BLOG: '/blog',
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: (id) => `/notifications/${id}/read`,
  },
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CART: '/cart',
  CHECKOUT: '/checkout',
  PRODUCTS: '/allproducts',
  PRODUCT_DETAIL: (id) => `/product/${id}`,
  BLOG: '/blog',
  BLOG_DETAIL: (id) => `/blog/${id}`,
  ACCOUNT: {
    PROFILE: '/account',
    ORDERS: '/account/orders_user',
    ADDRESS: '/account/address',
    CHANGE_PASSWORD: '/account/change_password',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    PRODUCTS: '/admin/products',
    CATEGORIES: '/admin/categories',
    BLOGS: '/admin/blogs',
    ORDERS: '/admin/orders',
  },
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  VNPAY: 'vnpay',
};

// Toast Config
export const TOAST_CONFIG = {
  POSITION: 'top-center',
  AUTO_CLOSE: 3000,
  HIDE_PROGRESS_BAR: false,
  CLOSE_ON_CLICK: true,
  PAUSE_ON_HOVER: true,
  DRAGGABLE: true,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  PRODUCTS_PER_PAGE: 12,
};

// Categories
export const CATEGORIES = [
  "Sofa", 
  "Ghế", 
  "Trang trí", 
  "Kệ sách", 
  "Bàn", 
  "Tủ quần áo"
];

// Price Ranges
export const PRICE_RANGES = [
  { label: "Dưới 100.000₫", value: "under-100", min: 0, max: 100000 },
  { label: "100.000₫ - 200.000₫", value: "100-200", min: 100000, max: 200000 },
  { label: "200.000₫ - 300.000₫", value: "200-300", min: 200000, max: 300000 },
  { label: "300.000₫ - 500.000₫", value: "300-500", min: 300000, max: 500000 },
  { label: "500.000₫ - 1.000.000₫", value: "500-1000", min: 500000, max: 1000000 },
  { label: "Trên 1.000.000₫", value: "over-1000", min: 1000000, max: Infinity },
];

// Environment
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
