export const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '0đ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value).replace(/\s*₫/, 'đ');
};
