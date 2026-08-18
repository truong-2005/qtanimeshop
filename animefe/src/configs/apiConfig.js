export const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const API_ENDPOINTS = {
  LOGIN: '/api/login',
  REGISTER: '/api/register',
  LOGOUT: '/api/logout',
  REFRESH_TOKEN: '/api/refresh-token',
  RESET_PASSWORD: '/api/reset-password',
  FORGOT_PASSWORD: '/api/forgot-password',
  USERS: '/api/users',
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  BRANDS: '/api/brands',
  CARTS: '/api/cart',
  ORDERS: '/api/orders',
  PAYMENTS: '/api/payments',
  POSTS: '/api/posts',
  TOPICS: '/api/topics',
  BANNERS: '/api/banners',
  DASHBOARD: '/api/dashboard',
  CHATBOT: '/api/chatbot/ask',
};
