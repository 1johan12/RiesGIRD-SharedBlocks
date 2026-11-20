const envObj: Record<string, any> =
  typeof import.meta !== 'undefined' && (import.meta as any).env
    ? (import.meta as any).env
    : {};

const nodeEnvObj: Record<string, any> =
  typeof process !== 'undefined' && process.env ? process.env : {};

export const getPublicApiUrl = (): string => {
  let cleanBase = '';

  const globalBase = (globalThis as any).__NUXT_PUBLIC_API_BASE__;
  if (typeof globalBase === 'string' && globalBase.trim() !== '') {
    cleanBase = globalBase.trim().replace(/\/+$/, '');
  }

  if (!cleanBase) {
    try {
      const useRc = (globalThis as any).useRuntimeConfig;
      if (typeof useRc === 'function') {
        const cfg = useRc();
        const nuxtBase = cfg?.public?.bffBase || cfg?.public?.apiBase || cfg?.public?.PUBLIC_API_URL;
        if (nuxtBase && typeof nuxtBase === 'string') {
          cleanBase = nuxtBase.replace(/\/+$/, '');
        }
      }
    } catch {
      // fuera del contexto setup de Nuxt
    }
  }

  if (!cleanBase && nodeEnvObj.NUXT_PUBLIC_BFF_BASE) {
    cleanBase = String(nodeEnvObj.NUXT_PUBLIC_BFF_BASE).replace(/\/+$/, '');
  }

  if (cleanBase) {
    if (cleanBase.startsWith('/') && typeof window === 'undefined') {
      let origin = (globalThis as any).__NUXT_SSR_ORIGIN__ || '';
      if (!origin) {
        try {
          const useReqUrl = (globalThis as any).useRequestURL;
          if (typeof useReqUrl === 'function') {
            origin = useReqUrl()?.origin || '';
          }
        } catch {
          // ignorar fuera de evento HTTP
        }
      }
      if (!origin) {
        const port = nodeEnvObj.PORT || nodeEnvObj.NITRO_PORT || 3000;
        origin = `http://127.0.0.1:${port}`;
      }
      return `${String(origin).replace(/\/+$/, '')}${cleanBase}`;
    }
    return cleanBase;
  }

  return (
    envObj.VITE_PUBLIC_API_URL ||
    nodeEnvObj.NUXT_PUBLIC_API_URL ||
    nodeEnvObj.API_BASE ||
    nodeEnvObj.VITE_PUBLIC_API_URL ||
    'https://api.redgirdaccperu.edu.pe/api/public'
  ).replace(/\/+$/, '');
};

export const getPublicStorageUrl = (): string => {
  return (
    envObj.VITE_STORAGE_URL ||
    nodeEnvObj.NUXT_PUBLIC_STORAGE_URL ||
    nodeEnvObj.VITE_MEDIA_URL ||
    nodeEnvObj.VITE_STORAGE_URL ||
    'https://admin.redgirdaccperu.edu.pe/storage'
  ).replace(/\/+$/, '');
};

export const PUBLIC_API_URL = getPublicApiUrl();
export const PUBLIC_STORAGE_URL = getPublicStorageUrl();

export default {
  PUBLIC_API_URL,
  PUBLIC_STORAGE_URL,
  getPublicApiUrl,
  getPublicStorageUrl,
};
