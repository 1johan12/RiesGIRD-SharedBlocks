  export const formatImageUrl = (url?: string) => {
      if (!url) return 'https://placehold.co/600x400?text=Subir+Imagen';

    let finalUrl = url;

    
    if (!url.startsWith('http')) {
      const baseUrl = import.meta.env.VITE_API_URL;
      
      let cleanPath = url.replace('public/', '');
      if (!cleanPath.startsWith('storage/')) cleanPath = 'storage/' + cleanPath;
      if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
      
      finalUrl = `${baseUrl}${cleanPath}`;
    }

    
    
    return finalUrl.replace(/([^:]\/)\/+/g, "$1");
  };