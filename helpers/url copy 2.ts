export const formatImageUrl = (url?: string) => {
  if (!url) return 'https://placehold.co/600x400?text=Sin+Imagen';

  
  
  if (url.startsWith('http') && !url.includes('/storage/')) {
    return url;
  }

  
  
  
  let cleanPath = url;
  if (url.startsWith('http') && url.includes('/storage/')) {
     const match = url.match(/(storage\/.*)/);
     if (match) {
        cleanPath = match[1]; 
     }
  }

  
  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, ""); 
  
  
  
  cleanPath = cleanPath.replace('public/', "").replace(/^\
  
  
  if (!cleanPath.startsWith('storage/')) {
    cleanPath = 'storage/' + cleanPath;
  }

  
  return `${baseUrl}/${cleanPath}`;
};