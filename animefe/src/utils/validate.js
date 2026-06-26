// Utilities for form validation

export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  // Số điện thoại VN: 10 số, bắt đầu bằng 0
  const regex = /^(0[3|5|7|8|9])+([0-9]{8})\b$/;
  return regex.test(phone);
};

export const isValidPassword = (password) => {
  if (!password) return false;
  // Mật khẩu ít nhất 6 ký tự
  return password.length >= 6;
};

export const validateRequired = (value) => {
  return value !== undefined && value !== null && value.toString().trim() !== '';
};

export const validateUsername = (username) => {
  if (!username) return false;
  // Username từ 3-20 ký tự, không chứa ký tự đặc biệt
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
};
