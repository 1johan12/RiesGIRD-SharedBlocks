const readEnv = (keys: string[]): string => {
  const viteEnv =
    typeof import.meta !== 'undefined' && (import.meta as any).env
      ? (import.meta as any).env
      : {};
  const nodeEnv =
    typeof process !== 'undefined' && process.env ? process.env : {};

  for (const key of keys) {
    const val = viteEnv[key] || nodeEnv[key];
    if (typeof val === 'string' && val.trim() !== '') {
      return val.trim();
    }
  }
  return '';
};

const normalizeSlashes = (value: string): string =>
  value
    .replace(/([^:])\/\/+/g, '$1/')
    .replace(/\/storage\/storage\//g, '/storage/');

export const formatAssetUrl = (url?: string | null): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Reparar concatenaciones corruptas tipo ".../storage/https://..." y colapsar "//storage/"
  let sanitizedUrl = trimmed;
  if (sanitizedUrl.includes('/storage/http')) {
    sanitizedUrl = sanitizedUrl.slice(sanitizedUrl.lastIndexOf('http'));
  }
  if (sanitizedUrl.startsWith('http://') || sanitizedUrl.startsWith('https://')) {
    sanitizedUrl = normalizeSlashes(sanitizedUrl);
  }

  const runtimeStorage = (globalThis as any).__NUXT_STORAGE_URL__;
  const configuredBase = (
    (typeof runtimeStorage === 'string' && runtimeStorage.trim())
      ? runtimeStorage.trim()
      : readEnv([
          'VITE_STORAGE_URL',
          'NUXT_PUBLIC_STORAGE_URL',
          'VITE_API_URL',
          'VITE_MEDIA_URL',
        ])
  ).replace(/\/+$/, '').replace(/\/storage$/, '');

  // Conservar rutas locales estáticas del frontend (/images/..., /img..., /assets/...)
  if (
    sanitizedUrl.startsWith('/') &&
    !sanitizedUrl.startsWith('/storage/') &&
    !sanitizedUrl.startsWith('/public/')
  ) {
    return sanitizedUrl;
  }

  // Reescribir localhost/admin hardcoded hacia el host configurado cuando aplique
  if (configuredBase && (sanitizedUrl.startsWith('http://') || sanitizedUrl.startsWith('https://'))) {
    if (
      sanitizedUrl.includes('127.0.0.1:8000/storage/') ||
      sanitizedUrl.includes('localhost:8000/storage/') ||
      sanitizedUrl.includes('admin.redgirdaccperu.edu.pe/storage/')
    ) {
      sanitizedUrl = normalizeSlashes(
        sanitizedUrl
          .replace(/^https?:\/\/(127\.0\.0\.1|localhost):8000/, configuredBase)
          .replace(/^https?:\/\/admin\.redgirdaccperu\.edu\.pe/, configuredBase)
      );
    }
  }

  if (
    (sanitizedUrl.startsWith('http://') || sanitizedUrl.startsWith('https://')) &&
    !sanitizedUrl.includes('/storage/')
  ) {
    return sanitizedUrl;
  }

  if (
    (sanitizedUrl.startsWith('http://') || sanitizedUrl.startsWith('https://')) &&
    sanitizedUrl.includes('/storage/')
  ) {
    return normalizeSlashes(sanitizedUrl);
  }

  const baseUrl = configuredBase || (typeof window !== 'undefined' ? window.location.origin : '');
  const cleanPath = sanitizedUrl
    .replace(/^\/+/, '')
    .replace(/^public\//, '')
    .replace(/^storage\//, '')
    .replace(/\/+/g, '/');

  return baseUrl ? normalizeSlashes(`${baseUrl}/storage/${cleanPath}`) : `/storage/${cleanPath}`;
};

export const formatImageUrl = (
  url?: string | null,
  fallback = ''
): string => {
  const formatted = formatAssetUrl(url);
  return formatted || fallback;
};
