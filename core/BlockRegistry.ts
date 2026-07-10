import { defineAsyncComponent } from 'vue';




export const BLOCK_REGISTRY: Record<string, any> = {

    HeroWelcome: {
        label: '🚀 Hero Bienvenida',
        icon: 'bi bi-star-fill',
        group: 'Hero',
        component: defineAsyncComponent(() => import('../components/sections/hero/blocks/HeroWelcome.vue')),
        editor: defineAsyncComponent(() => import('../components/sections/hero/editors/HeroWelcomeEditor.vue')),
        initialData: {
            title: '',
            subtitle: 'Formación profesional universitaria de adultos con experiencia laboral',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
            primaryBtnText: 'INSCRÍBETE A LAS CHARLAS',
            primaryBtnUrl: '#',
            secondaryBtnText: 'SOLICITA INFORMACIÓN',
            secondaryBtnUrl: '#',
            bgGradient: 'linear-gradient(135deg, #003057 0%, #004b87 100%)',
            textColor: '#ffffff',
            btnColor: '#ff3131' 
        }
    },
    FooterSimple: {
        label: '📝 Footer Simple',
        icon: 'las la-shoe-prints', 
        group: 'Footer',
        component: defineAsyncComponent(() => import('../components/sections/footer/blocks/FooterSimple.vue')),
        editor: defineAsyncComponent(() => import('../components/sections/footer/editors/FooterSimpleEditor.vue')),
        initialData: {
            bgColor: '#151515',
            textColor: '#a3a3a3',
            leftText: '© Copyright 2024 - Universidad ESAN | Todos los derechos reservados.',
            rightText: 'Razón Social: Universidad ESAN | RUC: 20136507720'
        }
    },
    HeaderDynamic: {
        label: '🌟 Header Transparente',
        icon: 'las la-bars', 
        group: 'Header',
        component: defineAsyncComponent(() => import('../components/sections/header/blocks/HeaderDynamic.vue')),
        editor: defineAsyncComponent(() => import('../components/sections/header/editors/HeaderDynamicEditor.vue')),
        initialData: {
            logoDesktop: '', 
            logoMobile: '',
            logoUrl: '#',
            textColor: '#ffffff',
            bgColor: 'transparent',
            menuItems: [

            ]
        }
    },

    LeadFormHero: {
        label: '📝 Formulario Hero (Marketing)',
        icon: 'las la-address-card',
        group: 'Form', 
        component: defineAsyncComponent(() => import('../components/sections/forms/blocks/LeadFormSection.vue')),
        editor: defineAsyncComponent(() => import('../components/sections/forms/editors/LeadFormSectionEditor.vue')),
        initialData: {
            bgImage: 'https://www.ue.edu.pe/img/home/fondo-carreras-dpa.jpg',
            formPosition: 'derecha',
            themeColor: '#ff2b2b',
            marketingTitle: '¡TRANSFORMA TU FUTURO! DA EL PRIMER PASO HACIA TU EXCELENCIA PROFESIONAL',
            marketingDescription: '',
            marketingImage: 'https://www.ue.edu.pe/img/home/img-carreras-dpa.webp',
            formConfig: {
                campaign_id: null,
                title: 'Comunícate',
                subtitle: 'Déjanos tus datos y un asesor absolverá tus dudas.',
                condition: 'https://www.ue.edu.pe/pregrado/politica-de-privacidad',
                button_text: 'Enviar mis datos',
                success_title: '¡Solicitud enviada!',
                success_message: 'Un asesor se pondrá en contacto contigo muy pronto.',
                show_phone: true,
                show_consult: true,
                show_courses: false,
                courses_list: []
            }
        }
    },
    TestimonialSlider: {
        label: '💬 Slider de Testimonios',
        icon: 'las la-quote-right',
        group: 'Testimonios', 
        component: defineAsyncComponent(() => import('../components/sections/testimonials/blocks/TestimonialSlider.vue')),
        editor: defineAsyncComponent(() => import('../components/sections/testimonials/editors/TestimonialSliderEditor.vue')),
        initialData: {
            bgType: 'color',
            bgColor: '#2a1515',
            bgImage: '',
            bgGradient: 'linear-gradient(135deg, #2a1515 0%, #1a0d0d 100%)',
            titleColor: '#ffffff',
            titleSize: '1.8rem',
            quoteColor: '#f8f9fa',
            quoteSize: '1.1rem',
            authorColor: '#cccccc',
            authorSize: '0.9rem',
            title: 'ESTUDIA CON LOS PROFESIONALES DE LOS NEGOCIOS',
            testimonials: [
                {
                    id: Date.now(),
                    quote: '"La carrera de Ingeniería de Sistemas integra la tecnología con los negocios, lo que es clave para hacer frente a la transformación digital que hoy experimentamos".',
                    image: '',
                    name: 'Daniella Tapia Villanes',
                    role: 'Alumna Ingeniería de Sistemas (Analista de Transformación Digital)'
                }
            ]
        }
    },
    HeroCollage: {
        label: '🖼️ Hero Institucional Collage',
        icon: 'las la-th-large',
        group: 'Hero',
        component: defineAsyncComponent(() => import('../components/riesgo/banner/views/HeroCollage.vue')),
        editor: defineAsyncComponent(() => import('../components/riesgo/banner/updates/HeroCollageEditor.vue')),
        initialData: {
            title: 'RED PERUANA DE INSTITUCIONES DE EDUCACIÓN SUPERIOR UNIVERSITARIA PARA LA GESTIÓN INTEGRAL DEL RIESGO DE DESASTRES Y LA ADAPTACIÓN AL CAMBIO CLIMÁTICO',
            logoUrl: 'https://images.unsplash.com/photo-1594732832278-abd644401426?auto=format&fit=crop&q=80&w=300', 
            collageImagenes: {
                superior: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600',
                izquierda: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600',
                centroAbajo: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
                derecha: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600'
            }
        }
    },

};




const baseGroups = [
    { id: 'Header', label: 'Cabeceras', color: 'outline-warning', icon: 'las la-heading' },
    { id: 'Estructurales', label: 'Estructurales', color: 'outline-dark', icon: 'las la-desktop' },
    { id: 'Institucional', label: 'Institucional', color: 'outline-primary', icon: 'las la-building' },
    { id: 'Grillas', label: 'Grillas y Contenido', color: 'outline-success', icon: 'las la-th-large' },
    { id: 'Conversion', label: 'Conversión y CTA', color: 'outline-danger', icon: 'las la-bullhorn' },
    { id: 'Soporte', label: 'OldsSection / Soporte', color: 'outline-secondary', icon: 'las la-archive' },
    { id: 'Programas', label: '🎓 Programas de Estudio', color: 'outline-info', icon: 'las la-graduation-cap' },
    { id: 'Hero', label: 'Heros', color: 'outline-primary', icon: 'las la-star' },
    { id: 'Form', label: 'Formularios', color: 'outline-primary', icon: 'las la-building' },
    { id: 'Image', label: '🖼️ Imágenes y Medios', color: 'outline-info', icon: 'las la-image' },
    { id: 'Footer', label: 'Pie de Página', color: 'outline-dark', icon: 'las la-shoe-prints' },
    { id: 'Testimonios', label: '💬 Testimonios', color: 'outline-warning', icon: 'las la-comment-dots' },
];




export const blockGroups = baseGroups.map(group => {
    return {
        ...group,
        keys: Object.keys(BLOCK_REGISTRY).filter(
            key => BLOCK_REGISTRY[key].group === group.id
        )
    };
});




export const BlockComponents = Object.keys(BLOCK_REGISTRY).reduce((acc, key) => {
    acc[key] = BLOCK_REGISTRY[key].component;
    return acc;
}, {} as Record<string, any>);

export const EditorComponents = Object.keys(BLOCK_REGISTRY).reduce((acc, key) => {
    acc[key] = BLOCK_REGISTRY[key].editor;
    return acc;
}, {} as Record<string, any>);

export const BlockLabels = Object.keys(BLOCK_REGISTRY).reduce((acc, key) => {
    acc[key] = BLOCK_REGISTRY[key].label;
    return acc;
}, {} as Record<string, string>);

export const blockIcons = Object.keys(BLOCK_REGISTRY).reduce((acc, key) => {
    acc[key] = BLOCK_REGISTRY[key].icon;
    return acc;
}, {} as Record<string, string>);


export const resolveBlock = (type: string) => BlockComponents[type] || null;
export const resolveEditor = (type: string) => EditorComponents[type] || null;
export const getInitialData = (type: string) => JSON.parse(JSON.stringify(BLOCK_REGISTRY[type]?.initialData || {}));