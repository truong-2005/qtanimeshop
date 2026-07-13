import React, { createContext, useState, useEffect } from 'react';
import tokenService from '../services/tokenService';
import authApi from '../api/authApi';
import userApi from '../api/userApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state from localStorage tokens
  useEffect(() => {
    const initAuth = async () => {
      // 1. Load client user
      const clientToken = tokenService.getAccessToken();
      const storedClientUser = tokenService.getUser();
      if (clientToken && storedClientUser) {
        setUser(storedClientUser);
      }

      // 2. Load admin user
      const adminToken = tokenService.getAdminAccessToken();
      const storedAdminUser = tokenService.getAdminUser();
      if (adminToken && storedAdminUser) {
        setAdminUser(storedAdminUser);
      }

      // 3. Background sync profile for client user (only if on client pages)
      if (clientToken && storedClientUser && !window.location.pathname.startsWith('/admin')) {
        try {
          const profile = await userApi.getMyProfile();
          const updatedUser = {
            ...storedClientUser,
            fullName: profile.fullName,
            avatar: profile.avatar,
          };
          tokenService.setUser(updatedUser);
          setUser(updatedUser);
        } catch (err) {
          console.error('Failed to sync client profile on init:', err);
        }
      }

      // 4. Background sync profile for admin user (only if on admin pages)
      if (adminToken && storedAdminUser && window.location.pathname.startsWith('/admin')) {
        try {
          const profile = await userApi.getMyProfile();
          const updatedUser = {
            ...storedAdminUser,
            fullName: profile.fullName,
            avatar: profile.avatar,
          };
          tokenService.setAdminUser(updatedUser);
          setAdminUser(updatedUser);
        } catch (err) {
          console.error('Failed to sync admin profile on init:', err);
        }
      }

      setLoading(false);
    };

    initAuth();

    // Listen to token expiration/logout events emitted by axiosClient
    const handleForceLogout = () => {
      tokenService.clearClient();
      setUser(null);
    };

    const handleAdminForceLogout = () => {
      tokenService.clearAdmin();
      setAdminUser(null);
    };

    window.addEventListener('auth-logout', handleForceLogout);
    window.addEventListener('admin-logout', handleAdminForceLogout);
    return () => {
      window.removeEventListener('auth-logout', handleForceLogout);
      window.removeEventListener('admin-logout', handleAdminForceLogout);
    };
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      const authData = response.data;
      if (authData && authData.accessToken) {
        tokenService.setAccessToken(authData.accessToken);
        if (authData.refreshToken) {
          tokenService.setRefreshToken(authData.refreshToken);
        }
        
        // Map AuthResponse to User object
        let userData = {
          id: authData.userId,
          username: authData.username,
          email: authData.email,
          role: authData.role,
        };

        // Fetch full profile to get avatar, fullName, etc.
        try {
          const profile = await userApi.getMyProfile();
          userData = {
            ...userData,
            fullName: profile.fullName,
            avatar: profile.avatar,
          };
        } catch (profileErr) {
          console.error('Failed to fetch profile during login:', profileErr);
        }

        tokenService.setUser(userData);
        setUser(userData);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    return await authApi.register(userData);
  };

  const logout = async () => {
    const refreshToken = tokenService.getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    tokenService.clearClient();
    setUser(null);
  };

  const adminLogin = async (credentials) => {
    setLoading(true);
    try {
      const response = await authApi.adminLogin(credentials);
      const authData = response.data;
      if (authData && authData.accessToken) {
        tokenService.setAdminAccessToken(authData.accessToken);
        if (authData.refreshToken) {
          tokenService.setAdminRefreshToken(authData.refreshToken);
        }
        
        let userData = {
          id: authData.userId,
          username: authData.username,
          email: authData.email,
          role: authData.role,
        };

        // Fetch full profile to get avatar, fullName, etc.
        try {
          const profile = await userApi.getMyProfile();
          userData = {
            ...userData,
            fullName: profile.fullName,
            avatar: profile.avatar,
          };
        } catch (profileErr) {
          console.error('Failed to fetch profile during admin login:', profileErr);
        }

        tokenService.setAdminUser(userData);
        setAdminUser(userData);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const adminLogout = async () => {
    const refreshToken = tokenService.getAdminRefreshToken();
    if (refreshToken) {
      try {
        await authApi.adminLogout(refreshToken);
      } catch (err) {
        console.error('Admin logout error:', err);
      }
    }
    tokenService.clearAdmin();
    setAdminUser(null);
  };

  const updateProfileState = (updatedUser) => {
    const currentUser = tokenService.getUser() || {};
    const newUser = { ...currentUser, ...updatedUser };
    tokenService.setUser(newUser);
    setUser(newUser);
  };

  const updateAdminProfileState = (updatedUser) => {
    const currentUser = tokenService.getAdminUser() || {};
    const newUser = { ...currentUser, ...updatedUser };
    tokenService.setAdminUser(newUser);
    setAdminUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        loading,
        login,
        register,
        logout,
        adminLogin,
        adminLogout,
        updateProfileState,
        updateAdminProfileState,
        isAuthenticated: !!user,
        isAdmin: adminUser?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
