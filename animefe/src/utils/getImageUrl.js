export const getImageUrl = (path, placeholder = 'https://placehold.co/600x800?text=No+Image') => {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return placeholder;
  }

  let cleanPath = path.trim();

  // Strip 'URL:' prefix if present
  if (cleanPath.startsWith('URL:')) {
    cleanPath = cleanPath.replace(/^URL:/, '').trim();
  }

  // If path is already a full URL or data/blob URI, return directly
  if (
    cleanPath.startsWith('http://') ||
    cleanPath.startsWith('https://') ||
    cleanPath.startsWith('data:') ||
    cleanPath.startsWith('blob:')
  ) {
    return cleanPath;
  }

  const formattedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

  // If REACT_APP_API_URL environment variable is set
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  if (apiBaseUrl) {
    const origin = apiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    return `${origin}${formattedPath}`;
  }

  // Default fallback for dev environment: return relative path so package.json proxy or current origin resolves it
  return formattedPath;
};
