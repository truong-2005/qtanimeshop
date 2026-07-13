const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

const ADMIN_ACCESS_TOKEN_KEY = 'adminAccessToken';
const ADMIN_REFRESH_TOKEN_KEY = 'adminRefreshToken';
const ADMIN_USER_KEY = 'adminUser';

const tokenService = {
  // Client tokens & user
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  removeAccessToken: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
  
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),
  
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  // Admin tokens & user
  getAdminAccessToken: () => localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY),
  setAdminAccessToken: (token) => localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, token),
  removeAdminAccessToken: () => localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY),
  
  getAdminRefreshToken: () => localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY),
  setAdminRefreshToken: (token) => localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, token),
  removeAdminRefreshToken: () => localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY),
  
  getAdminUser: () => {
    const user = localStorage.getItem(ADMIN_USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  setAdminUser: (user) => localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user)),
  removeAdminUser: () => localStorage.removeItem(ADMIN_USER_KEY),

  // Clear methods
  clearClient: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  clearAdmin: () => {
    localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
    localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  },

  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
    localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  }
};

export default tokenService;
