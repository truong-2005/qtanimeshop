import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FrontendLayout from '../layouts/FrontendLayout';
import UserGuard from './UserGuard';

// Pages
import Home from '../pages/frontend/Home';

// Auth
import { Login, Register, ForgotPassword, ResetPassword, GoogleLogin } from '../pages/frontend/Auth';

// Product
import { ProductAll, ProductByCategory, ProductByBrand, ProductDetail, ProductSearch, ProductNew, ProductBestSale, ProductSale } from '../pages/frontend/Product';

// Cart
import { CartList, Checkout, PaymentResult } from '../pages/frontend/Cart';

// Order
import { MyOrders, OrderDetail } from '../pages/frontend/Order';

// Profile
import { Profile, ChangePassword } from '../pages/frontend/Profile';

// Post
import { PostList, PostDetail } from '../pages/frontend/Post';

// ChatBot
import ChatBotPage from '../pages/frontend/ChatBot/ChatBotPage';

// Other
import NotFound from '../pages/NotFound';

const FrontendRoutes = () => {
  return (
    <FrontendLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth2/success" element={<GoogleLogin />} />

        {/* Product Catalog */}
        <Route path="/products" element={<ProductAll />} />
        <Route path="/products/category/:id" element={<ProductByCategory />} />
        <Route path="/products/brand/:id" element={<ProductByBrand />} />
        <Route path="/products/search" element={<ProductSearch />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/products/new" element={<ProductNew />} />
        <Route path="/products/best-sale" element={<ProductBestSale />} />
        <Route path="/products/sale" element={<ProductSale />} />

        {/* Post */}
        <Route path="/posts" element={<PostList />} />
        <Route path="/post/:id" element={<PostDetail />} />

        {/* ChatBot */}
        <Route path="/chatbot" element={<ChatBotPage />} />

        {/* Protected Routes (User Guard) */}
        <Route element={<UserGuard />}>
          <Route path="/cart" element={<CartList />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-orders/:id" element={<OrderDetail />} />
          
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </FrontendLayout>
  );
};

export default FrontendRoutes;
