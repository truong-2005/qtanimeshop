import uploadApi from '../api/uploadApi';

const uploadService = {
  validateImage: (file, maxSizeMB = 5) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, message: 'Chỉ chấp nhận định dạng ảnh (JPG, PNG, WEBP, GIF)' };
    }
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { valid: false, message: `Dung lượng ảnh không được vượt quá ${maxSizeMB}MB` };
    }
    
    return { valid: true };
  },

  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await uploadApi.uploadFile(formData);
      return res;
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error);
      throw error;
    }
  },

  deleteFile: async (fileName) => {
    try {
      await uploadApi.deleteFile(fileName);
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa ảnh:', error);
      throw error;
    }
  }
};

export default uploadService;
