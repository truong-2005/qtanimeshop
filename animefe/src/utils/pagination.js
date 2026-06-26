export const generatePagination = (currentPage, totalPages) => {
  // Trả về mảng các trang cần hiển thị
  // Ví dụ: currentPage = 3, total = 10 => [0, 1, 2, 3, 4, '...', 9]
  // Lưu ý: currentPage truyền vào là 0-indexed (từ API backend)
  
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  if (currentPage <= 3) {
    return [0, 1, 2, 3, 4, '...', totalPages - 1];
  }

  if (currentPage >= totalPages - 4) {
    return [0, '...', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
  }

  return [0, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1];
};
