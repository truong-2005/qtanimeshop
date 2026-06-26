import { useState } from 'react';
import uploadApi from '../api/uploadApi';

const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadApi.uploadFile(formData);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
};

export default useUpload;
