import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BackendLayout from '../layouts/BackendLayout';

// Import all Backend Pages
import { Dashboard } from '../pages/backend/Dashboard';
import { ProductList, ProductCreate, ProductUpdate, ProductShow, ProductImage, ProductSale, ProductStore } from '../pages/backend/Product';
import { OrderList, OrderShow, OrderUpdateStatus, OrderDetail } from '../pages/backend/Order';
import { CategoryList, CategoryCreate, CategoryUpdate, CategoryShow } from '../pages/backend/Category';
import { BrandList, BrandCreate, BrandUpdate, BrandShow } from '../pages/backend/Brand';
import { TopicList, TopicCreate, TopicUpdate, TopicShow } from '../pages/backend/Topic';
import { UserList, UserCreate, UserUpdate, UserShow, UserProfile, ChangePassword } from '../pages/backend/User';
import { BannerList, BannerCreate, BannerUpdate, BannerShow } from '../pages/backend/Banner';
import { PostList, PostCreate, PostUpdate, PostShow } from '../pages/backend/Post';
import { MenuList, MenuCreate, MenuUpdate, MenuShow } from '../pages/backend/Menu';
import { NotificationList, NotificationSend } from '../pages/backend/Notification';
import { ChatBotManage } from '../pages/backend/ChatBot';
import { PaymentList, PaymentShow, PaymentCreate, PaymentUpdate } from '../pages/backend/Payment';
import { SettingUpdate } from '../pages/backend/Setting';
import { UploadFile } from '../pages/backend/Upload';

const BackendRoutes = () => {
  return (
    <BackendLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Products */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/create" element={<ProductCreate />} />
        <Route path="/products/edit/:id" element={<ProductUpdate />} />
        <Route path="/products/show/:id" element={<ProductShow />} />
        <Route path="/products/images/:productId" element={<ProductImage />} />
        <Route path="/products/sale/:productId" element={<ProductSale />} />
        <Route path="/products/store/:id" element={<ProductStore />} />
        
        {/* Orders */}
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/show/:id" element={<OrderShow />} />
        <Route path="/orders/status/:id" element={<OrderUpdateStatus />} />
        <Route path="/orders/detail/:id" element={<OrderDetail />} />
        
        {/* Categories */}
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/create" element={<CategoryCreate />} />
        <Route path="/categories/edit/:id" element={<CategoryUpdate />} />
        <Route path="/categories/show/:id" element={<CategoryShow />} />
        
        {/* Brands */}
        <Route path="/brands" element={<BrandList />} />
        <Route path="/brands/create" element={<BrandCreate />} />
        <Route path="/brands/edit/:id" element={<BrandUpdate />} />
        <Route path="/brands/show/:id" element={<BrandShow />} />
        
        {/* Topics */}
        <Route path="/topics" element={<TopicList />} />
        <Route path="/topics/create" element={<TopicCreate />} />
        <Route path="/topics/edit/:id" element={<TopicUpdate />} />
        <Route path="/topics/show/:id" element={<TopicShow />} />
        
        {/* Users */}
        <Route path="/users" element={<UserList />} />
        <Route path="/users/create" element={<UserCreate />} />
        <Route path="/users/edit/:id" element={<UserUpdate />} />
        <Route path="/users/show/:id" element={<UserShow />} />
        <Route path="/users/profile" element={<UserProfile />} />
        <Route path="/users/password" element={<ChangePassword />} />
        
        {/* Banners */}
        <Route path="/banners" element={<BannerList />} />
        <Route path="/banners/create" element={<BannerCreate />} />
        <Route path="/banners/edit/:id" element={<BannerUpdate />} />
        <Route path="/banners/show/:id" element={<BannerShow />} />
        
        {/* Posts */}
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/create" element={<PostCreate />} />
        <Route path="/posts/edit/:id" element={<PostUpdate />} />
        <Route path="/posts/show/:id" element={<PostShow />} />
        
        {/* Menus */}
        <Route path="/menus" element={<MenuList />} />
        <Route path="/menus/create" element={<MenuCreate />} />
        <Route path="/menus/edit/:id" element={<MenuUpdate />} />
        <Route path="/menus/show/:id" element={<MenuShow />} />
        
        {/* Notifications */}
        <Route path="/notifications" element={<NotificationList />} />
        <Route path="/notifications/send" element={<NotificationSend />} />
        
        {/* ChatBot */}
        <Route path="/chatbot" element={<ChatBotManage />} />

        {/* Payments */}
        <Route path="/payments" element={<PaymentList />} />
        <Route path="/payments/create" element={<PaymentCreate />} />
        <Route path="/payments/edit/:id" element={<PaymentUpdate />} />
        <Route path="/payments/show/:id" element={<PaymentShow />} />
        
        {/* Settings */}
        <Route path="/settings" element={<SettingUpdate />} />
        
        {/* Uploads */}
        <Route path="/uploads" element={<UploadFile />} />
      </Routes>
    </BackendLayout>
  );
};

export default BackendRoutes;
