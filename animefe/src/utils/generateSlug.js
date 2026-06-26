export const generateSlug = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .normalize('NFD') // Chuẩn hóa Unicode để tách dấu
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
    .replace(/đ/g, 'd') // Thay chữ đ
    .replace(/[^a-z0-9 -]/g, '') // Xóa ký tự đặc biệt
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng gạch nối
    .replace(/-+/g, '-') // Xóa nhiều gạch nối liên tiếp
    .replace(/^-+|-+$/g, ''); // Cắt gạch nối ở đầu và cuối
};
