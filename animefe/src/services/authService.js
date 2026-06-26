import tokenService from './tokenService';

const authService = {
  isAuthenticated: () => {
    const token = tokenService.getAccessToken();
    return !!token;
  },
  
  isAdmin: () => {
    const user = tokenService.getUser();
    return user && user.role === 'ADMIN';
  },
  
  getCurrentUser: () => {
    return tokenService.getUser();
  },
  
  logout: () => {
    tokenService.clear();
    window.dispatchEvent(new Event('auth-logout'));
  }
};

export default authService;
