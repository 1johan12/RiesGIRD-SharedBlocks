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
        label: '🏁 Footer Institucional Pro (Azul RiesGIRD)',
        icon: 'las la-shoe-prints',
        component: defineAsyncComponent(() => import('../components/branding/footer/previews/FooterPro.vue')),
        editor: defineAsyncComponent(() => import('../components/branding/footer/updates/FooterProEditor.vue')),
        initialData: {
            logoUrl: '/img.png',
            logoHeight: 60,
            description: 'Institución líder enfocada en la excelencia académica, la gestión del riesgo y la formación integral.',
            bgColor: '#1e40af',
            textColor: '#e0f2fe',
            accentColor: '#ffffff',
            bulletColor: '#93c5fd',
            bottomBgColor: '#173287',
            bottomTextColor: '#93c5fd',
            copyrightText: 'Riesgird - ACC | Todos los derechos reservados.',
            footerColumns: [
                {
                    title: 'Organización',
                    links: [
                        { text: 'RED', url: '/' },
                        { text: '¿Qué es la Red?', url: '/organizacion' },
                        { text: 'Estructura organizacional', url: '/estructuraOrganizacional' },
                        { text: 'Proceso y requisito de membresía', url: '/procesoMembresia' }
                    ]
                },
                {
                    title: 'Líneas de acción',
                    links: [
                        { text: 'Investigación', url: '/investigacionesProducidas' },
                        { text: 'Formación', url: '/estrategiaTransversalizacion' },
                        { text: 'Responsabilidad socio ambiental', url: '/servicioDesarrolloTerritorial' }
                    ]
                },
                {
                    title: 'Eventos y noticias',
                    links: [
                        { text: 'Noticias', url: '/eventosNoticias' },
                        { text: 'Convocatorias', url: '/noticiasConvocatorias' }
                    ]
                },
                {
                    title: 'Miembros',
                    links: [
                        { text: 'Directorio', url: '/directorio' },
                        { text: 'Universidades', url: '/universidades' }
                    ]
                },
                {
                    title: 'Documentos',
                    links: [
                        { text: 'Memorias', url: '/memoriasCongreso' },
                        { text: 'Documentos y Gestión', url: '/gestionConocimiento' },
                        { text: 'Investigaciones', url: '/investigacionesProducidas' },
                        { text: 'Presencia Riesgird', url: '/presenciaRed' }
                    ]
                }
            ]
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