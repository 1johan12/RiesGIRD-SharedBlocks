export const formatImageUrl = (url?: string) => {
  if (!url) return 'https://placehold.co/600x400?text=Sin+Imagen';

  
  if (url.startsWith('http') && !url.includes('/storage/')) {
    return url;
  }

  
  
  let cleanPath = url;
  if (url.includes('storage/')) {
    cleanPath = url.split('storage/').pop() || ''; 
  }

  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, ""); 
  
  
  cleanPath = cleanPath
    .replace('public/', "")
    .replace(/^\/+/, "") 
    .replace(/\/+/g, "/");

  
  return `${baseUrl}/storage/${cleanPath}`;
};