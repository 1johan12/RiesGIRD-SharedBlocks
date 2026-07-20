export const formatImageUrl = (url?: string) => {
  // 1. Si no hay URL, retornamos el placeholder oficial
  if (!url) return 'https://placehold.co/600x400?text=Sin+Imagen';

  // 2. Extraemos el Base URL de producción con fallback al dominio principal (¡Salvamos el SEO de imágenes!)
  const baseUrl = (
    (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SITE_URL || import.meta.env?.VITE_MEDIA_URL)) || 
    'https://redgirdaccperu.edu.pe'
  ).replace(/\/+$/, "");

  // 3. INTERCEPCIÓN DE EMERGENCIA: Si trae fantasmas de Localhost o del Admin viejo, los fulminamos en el aire
  let sanitizedUrl = url;
  if (
    sanitizedUrl.includes('127.0.0.1:8000') || 
    sanitizedUrl.includes('localhost:8000') ||
    sanitizedUrl.includes('admin.redgirdaccperu.edu.pe')
  ) {
    sanitizedUrl = sanitizedUrl
      .replace(/^http:\/\/(127\.0\.0\.1|localhost):8000/, baseUrl)
      .replace('https://admin.redgirdaccperu.edu.pe', baseUrl);
  }

  // 4. Si ya es una URL externa segura (ej: Unsplash o un CDN) y NO pertenece a nuestro storage, se retorna directo
  if (sanitizedUrl.startsWith('http') && !sanitizedUrl.includes('/storage/')) {
    return sanitizedUrl;
  }

  // 5. Desmenuzamos el path para extraer solo el nombre del archivo y sus subcarpetas
  let cleanPath = sanitizedUrl;
  if (sanitizedUrl.includes('storage/')) {
    cleanPath = sanitizedUrl.split('storage/').pop() || ''; 
  }

  // 6. Saneamiento quirúrgico de slashes y remoción de prefijos antiguos de disco
  cleanPath = cleanPath
    .replace('public/', "")
    .replace(/^\/+/, "") 
    .replace(/\/+/g, "/");

  // 7. Retorno definitivo unificado con el dominio público oficial
  return `${baseUrl}/storage/${cleanPath}`;
};