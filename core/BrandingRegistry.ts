import { defineAsyncComponent } from 'vue';

export const BRANDING_REGISTRY: Record<string, any> = {
    
    HeaderClassic: {
        label: '🏛️ Institucional Clásico',
        icon: 'las la-university',
        component: defineAsyncComponent(() => import('../components/branding/previews/HeaderClassic.vue')),
        editor: defineAsyncComponent(() => import('../components/branding/editors/HeaderClassicEditor.vue')),
        initialData: {
            sticky: true,
            showTopBar: true,
            logoHeight: 60,
            menuAlignment: 'right',
            topBarText: 'Portal Académico Oficial',
            menu_id: null
        }
    },

    
    HeaderClassicV1: {
        label: '🏛️ Institucional Clásico V1',
        icon: 'las la-school',
        component: defineAsyncComponent(() => import('../components/branding/headers/previews/HeaderClassicV1.vue')),
        editor: defineAsyncComponent(() => import('../components/branding/headers/updates/HeaderClassicV1Editor.vue')),
        initialData: {
            logoUrl: '',
            logoHeight: 65,
            logoHeightScrolled: 45,
            sticky: true,
            isTransparent: false,
            
            backdropBlur: 10,
            showTopBar: true,
            topBarBgColor: '#003366',
            topBarTextColor: '#ffffff',
            navBgColor: '#ffffff',
            navTextColor: '#333333',
            navTransparentTextColor: '#ffffff',
            navHoverColor: '#cc0033',
            socialLinks: [
                { icon: 'bi bi-facebook', url: '#' },
                { icon: 'bi bi-instagram', url: '#' },
                { icon: 'bi bi-linkedin', url: '#' }
            ],
            topLinks: [
                { text: 'Portal de Alumnos', url: '#' },
                { text: 'Intranet Docente', url: '#' }
            ],
            ctaText: 'POSTULA AQUÍ',
            ctaUrl: '#',
            ctaIcon: 'bi bi-arrow-right-circle',
            
            menuId: null
        }
    },
    HeaderMega: {
        label: '🚀 Mega Menú Premium',
        icon: 'las la-layer-group',
        component: defineAsyncComponent(() => import('../components/branding/previews/HeaderMega.vue')),
        editor: defineAsyncComponent(() => import('../components/branding/editors/HeaderMegaEditor.vue')),
        initialData: {
            sticky: true,
            logoHeight: 70,
            containerType: 'container',
            heavyShadow: true,
            ctaText: 'POSGRADO',
            menu_id: null
        }
    },

    
    FooterPro: {
        label: '🏁 Footer Institucional Pro',
        icon: 'las la-shoe-prints',
        component: defineAsyncComponent(() => import('../components/branding/footer/previews/FooterPro.vue')),
        editor: defineAsyncComponent(() => import('../components/branding/footer/updates/FooterProEditor.vue')),
        initialData: {
            logoUrl: '',
            logoHeight: 60,
            description: 'Institución líder enfocada en la excelencia académica y la formación integral.',
            bgColor: '#1a1a1a',
            textColor: '#ffffff',
            accentColor: '#cc0033',
            address: 'Av. Universitaria 123, Lima - Perú',
            phone: '+51 1 123 4567',
            email: 'contacto@universidad.edu.pe',
            socialLinks: [
                { icon: 'bi bi-facebook', url: '#' },
                { icon: 'bi bi-linkedin', url: '#' },
                { icon: 'bi bi-instagram', url: '#' }
            ],
            footerColumns: [
                {
                    title: 'Institución',
                    links: [
                        { text: 'Sobre nosotros', url: '#' },
                        { text: 'Transparencia', url: '#' },
                        { text: 'Noticias', url: '#' }
                    ]
                },
                {
                    title: 'Admisión',
                    links: [
                        { text: 'Pregrado', url: '#' },
                        { text: 'Posgrado', url: '#' },
                        { text: 'Becas', url: '#' }
                    ]
                }
            ],
            copyrightText: `© ${new Date().getFullYear()} Universidad. Todos los derechos reservados.`
        }
    },
    FooterSimple: {
        label: '⬛ Footer Simple Minimalista',
        icon: 'las la-minus',
        component: defineAsyncComponent(() => import('../components/branding/footer/previews/FooterSimple.vue')),
        editor: defineAsyncComponent(() => import('../components/branding/footer/updates/FooterSimpleEditor.vue')),
        initialData: {
            bgColor: '#1e1e1e', 
            textColor: '#7e7e7e', 
            linkColor: '#9ba8b5', 
            iconColor: '#ffffff', 
            links: [
                { text: 'Blog UE', url: '#' },
                { text: 'UE Virtual', url: '#' },
                { text: 'Tour Virtual', url: '#' },
                { text: 'FabLab Esan', url: '#' },
                { text: 'Acreditación Esan', url: '#' }
            ],
            copyrightText: 'Universidad ESAN - R.U.C N° 20136507720',
            socialLinks: [
                { icon: 'bi bi-twitter-x', url: '#' }, 
                { icon: 'bi bi-facebook', url: '#' },
                { icon: 'bi bi-youtube', url: '#' },
                { icon: 'bi bi-instagram', url: '#' }
            ]
        }
    }
};

export const resolveBrandingComponent = (type: string) => BRANDING_REGISTRY[type]?.component || null;
export const resolveBrandingEditor = (type: string) => BRANDING_REGISTRY[type]?.editor || null;
export const getInitialBrandingData = (type: string) => JSON.parse(JSON.stringify(BRANDING_REGISTRY[type]?.initialData || {}))