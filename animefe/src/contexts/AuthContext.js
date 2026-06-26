import React, { createContext, useState, useEffect } from 'react';
import tokenService from '../services/tokenService';
import authApi from '../api/authApi';
import userApi from '../api/userApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state from localStorage tokens
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenService.getAccessToken();
      const storedUser = tokenService.getUser();
      if (token && storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    initAuth();

    // Listen to token expiration/logout events emitted by axiosClient
    const handleForceLogout = () => {
      tokenService.clear();
      setUser(null);
    };

    window.addEventListener('auth-logout', handleForceLogout);
    return () => {
      window.removeEventListener('auth-logout', handleForceLogout);
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
        const userData = {
          id: authData.userId,
          username: authData.username,
          email: authData.email,
          role: authData.role,
        };
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
    tokenService.clear();
    setUser(null);
  };

  const adminLogin = async (credentials) => {
    setLoading(true);
    try {
      const response = await authApi.adminLogin(credentials);
      const authData = response.data;
      if (authData && authData.accessToken) {
        tokenService.setAccessToken(authData.accessToken);
        if (authData.refreshToken) {
          tokenService.setRefreshToken(authData.refreshToken);
        }
        
        const userData = {
          id: authData.userId,
          username: authData.username,
          email: authData.email,
          role: authData.role,
        };
        tokenService.setUser(userData);
        setUser(userData);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateProfileState = (updatedUser) => {
    const currentUser = tokenService.getUser() || {};
    const newUser = { ...currentUser, ...updatedUser };
    tokenService.setUser(newUser);
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        adminLogin,
        updateProfileState,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
