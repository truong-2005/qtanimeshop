export const getImageUrl = (path, placeholder = 'https://placehold.co/600x800?text=No+Image') => {
  if (!path) return placeholder;
  if (path.startsWith('http') || path.startsWith('data:image') || path.startsWith('blob:')) return path;
  
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8083';
  return `${baseURL}${path.startsWith('/') ? '' : '/'}${path}`;
};
