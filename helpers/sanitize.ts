const DANGEROUS_TAGS_RE = /<\s*(script|iframe|object|embed|form|input|button|select|textarea|meta|base|link|style|svg)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>|<\s*(script|iframe|object|embed|meta|base|link)\b[^>]*\/?>/gi;
const EVENT_HANDLER_RE = /\s+on[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const DANGEROUS_PROTOCOL_RE = /\b(href|src|action|formaction|xlink:href)\s*=\s*(?:"\s*(?:javascript|vbscript|data\s*:\s*text\/html)[^"]*"|'\s*(?:javascript|vbscript|data\s*:\s*text\/html)[^']*'|[^\s>]*?(?:javascript|vbscript):[^\s>]*)/gi;

export function sanitizeHtml(html?: string | null): string {
    if (!html || typeof html !== 'string') {
        return '';
    }

    return html
        .replace(DANGEROUS_TAGS_RE, '')
        .replace(EVENT_HANDLER_RE, '')
        .replace(DANGEROUS_PROTOCOL_RE, '$1="#"');
}

export function sanitizeHref(url?: string | null, fallback = '#'): string {
    if (!url || typeof url !== 'string') {
        return fallback;
    }

    const trimmed = url.trim();
    if (!trimmed) {
        return fallback;
    }

    if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
        return trimmed.startsWith('//') ? fallback : trimmed;
    }

    try {
        const parsed = new URL(trimmed);
        if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
            return trimmed;
        }
        return fallback;
    } catch {
        return fallback;
    }
}

export function stripHtml(html?: string | null): string {
    if (!html || typeof html !== 'string') {
        return '';
    }
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function getPostDetailRoute(typeOrPost?: string | Record<string, any> | null, slug?: string | number | null): string {
    let rawType: any = typeOrPost;
    let rawSlug: any = slug;

    if (typeOrPost && typeof typeOrPost === 'object') {
        rawType = typeOrPost.type;
        rawSlug = typeOrPost.slug || typeOrPost.id;
    }

    const cleanSlug = rawSlug !== undefined && rawSlug !== null && String(rawSlug).trim() !== ''
        ? encodeURIComponent(String(rawSlug).trim())
        : '';
    if (!cleanSlug) {
        return '/news';
    }

    const normalizedType = String(rawType || '').toLowerCase();
    if (normalizedType === 'event' || normalizedType === 'events') {
        return `/events/${cleanSlug}`;
    }
    if (normalizedType === 'assemblies' || normalizedType === 'assembly') {
        return `/assemblies/${cleanSlug}`;
    }
    return `/news/${cleanSlug}`;
}
