import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminGuard from './AdminGuard';
import BackendRoutes from './BackendRoutes';
import FrontendRoutes from './FrontendRoutes';
import { AdminLogin } from '../pages/backend/Auth';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin Login Portal */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Console Routes */}
      <Route path="/admin/*" element={<AdminGuard />}>
        <Route path="*" element={<BackendRoutes />} />
      </Route>

      {/* Frontend Client Routes */}
      <Route path="/*" element={<FrontendRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
