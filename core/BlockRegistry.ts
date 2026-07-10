import { defineAsyncComponent } from 'vue';




export const BLOCK_REGISTRY: Record<string, any> = {

    HeroWelcome: {
        label: '🚀 Hero Bienvenida',
        icon: 'bi bi-star-fill',
        group: 'Hero',
        component: defineAsyncComponent(() => import('../components/sections/hero/blocks/HeroWelcome.vue')),
        // editor: defineAsyncComponent(() => import('../components/sections/hero/editors/HeroWelcomeEditor.vue')),
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
        // editor: defineAsyncComponent(() => import('../components/sections/footer/editors/FooterSimpleEditor.vue')),
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
        // editor: defineAsyncComponent(() => import('../components/sections/header/editors/HeaderDynamicEditor.vue')),
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
        // editor: defineAsyncComponent(() => import('../components/sections/forms/editors/LeadFormSectionEditor.vue')),
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
        // editor: defineAsyncComponent(() => import('../components/sections/testimonials/editors/TestimonialSliderEditor.vue')),
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
        // editor: defineAsyncComponent(() => import('../components/riesgo/banner/updates/HeroCollageEditor.vue')),
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
    HeroDefault: {
        label: 'Hero Default',
        group: 'Hero',
        component: defineAsyncComponent(() => import('../components/riesgo/hero/default/Block.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/hero/default/Editor.vue')),
        initialData: {
            title: 'Título principal',
            subtitle: 'Subtítulo',
            backgroundImage: '',
            height: '500px',
            waveColor: '#ffffff'
        }
    },
    StatsGrid: {
        label: '📊 Cuadrícula de Métricas',
        icon: 'las la-chart-bar',
        group: 'Grillas', // Se auto-asignará al grupo "Grillas y Contenido"
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/StatsGrid.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/StatsGridEditor.vue')),
        initialData: {
            cardBgColor: '#db143c',
            metricas: [
                { id: 1, numero: '25+', label: 'Universidades' },
                { id: 2, numero: '45+', label: 'Investigadores' },
                { id: 3, numero: '1200+', label: 'Personas Capacitadas' },
                { id: 4, numero: '8', label: 'Convenios' }
            ]
        }
    },
    CtaBanner: {
        label: '📣 Banner CTA Gradiente',
        icon: 'las la-bullhorn',
        group: 'Conversion', // Se auto-indexará dinámicamente en tu pestaña "Conversión y CTA"
        component: defineAsyncComponent(() => import('../components/riesgo/banner/views/CtaBanner.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/banner/updates/CtaBannerEditor.vue')),
        initialData: {
            text: 'Únete a la Red',
            url: 'https://docs.google.com/forms/d/e/1FAIpQLSfXXXXXXXXX/viewform',
            targetBlank: true,
            bgGradient: 'linear-gradient(135deg, #db143c 0%, #7e22ce 50%, #25529a 100%)'
        }
    },
    QuienesSomos: {
        label: '👥 Quiénes Somos (Institucional)',
        icon: 'las la-users',
        group: 'Institucional',
        isBoxed: true,
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/QuienesSomos.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/QuienesSomosEditor.vue')),
        initialData: {
            title: '¿Quiénes somos?',
            text: 'La Red Interuniversitaria <strong>RIESGIRD-ACC Perú</strong> es un espacio de articulación académica que reúne a universidades comprometidas con la gestión integral del riesgo de desastres y la adaptación al cambio climático. Su labor se centra en promover la incorporación transversal de estos enfoques en la gobernanza, formación, investigación y responsabilidad social universitaria, considerando las particularidades territoriales.',
            imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
        }
    },
    MisionVision: {
        label: '🎯 Misión y Visión Corporativa',
        icon: 'las la-bullseye',
        group: 'Institucional',
        isBoxed: true,
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/MisionVision.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/MisionVisionEditor.vue')),
        initialData: {
            visionTitle: 'Nuestra Visión',
            visionText: 'Ser la red líder en América Latina en la promoción de la gestión integral del riesgo de desastres y la adaptación al cambio climático desde la educación superior, formando profesionales comprometidos con la resiliencia territorial.',
            visionImageUrl: 'https://images.unsplash.com/photo-1531535934202-f022eed2593e?auto=format&fit=crop&q=80&w=600',

            misionTitle: 'Nuestra Misión',
            misionText: 'Articular las capacidades de las universidades peruanas para integrar la gestión del riesgo de desastres y la adaptación al cambio climático en la formación académica, investigación y proyección social, contribuyendo al desarrollo sostenible del país.',
            misionImageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600'
        }
    },
    NuestrosObjetivos: {
        label: '🎯 Nuestros Objetivos (Institucional)',
        icon: 'las la-bullseye',
        group: 'Institucional',
        isBoxed: true, // 👈 ENCAJA PERFECTAMENTE EN TU ARQUITECTURA DE LIENZO INTEGRADO
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/NuestrosObjetivos.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates//NuestrosObjetivosEditor.vue')),
        initialData: {
            title: 'Nuestros Objetivos',
            introText: 'La Red Interuniversitaria para la Gestión Integral del Riesgo de Desastres y la Adaptación al Cambio Climático (RIESGIRD-ACC Perú) es un espacio de articulación académica que agrupa a las universidades del país comprometidas con la seguridad y la resiliencia climática.',
            generalObjective: 'Impulsar la gestión integral del riesgo de desastres y la adaptación al cambio climático en las universidades peruanas, integrándolas en la formación, investigación y responsabilidad social para contribuir al desarrollo sostenible del país.',
            titleOE: 'Nuestros Especificos',
            introTextOE: 'Para hacer realidad nuestro objetivo mayor, hemos trazado cuatro metas concretas de trabajo:',
            objetivosEspecificos: [
                { id: 1, tag: 'Objetivo 1', color: 'azul', text: 'Diseñar e implementar estrategias colaborativas entre universidades que contribuyan a la reducción del riesgo de desastres y los riesgos climáticos en los territorios.' },
                { id: 2, tag: 'Objetivo 2', color: 'azul', text: 'Fortalecer la pertinencia y calidad de las capacidades académicas en GIRD-ACC, mediante la coordinación con instituciones públicas y privadas a nivel nacional e internacional.' },
                { id: 3, tag: 'Objetivo 3', color: 'azul', text: 'Promover alianzas interuniversitarias y multisectoriales vinculadas a la gestión del riesgo y la adaptación al cambio climático.' },
                { id: 4, tag: 'Objetivo 4', color: 'rojo', text: 'Poner a disposición de las autoridades competentes las capacidades técnicas especializadas en los procesos de la Gestión del Riesgo de Desastres.' },
                { id: 5, tag: 'Objetivo 5', color: 'rojo', text: 'Promover el derecho a la asistencia humanitaria y el derecho a un ambiente saludable, manteniendo independencia y autonomía institucional.' }
            ]
        }
    },
    Lineamientos: {
        label: '📋 Listado de Lineamientos',
        icon: 'las la-list-ul',
        group: 'Institucional',
        isBoxed: true, // 👈 ENCAJA PERFECTAMENTE EN TU ARQUITECTURA DE CONTENEDOR UNIFICADO
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/Lineamientos.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/LineamientosEditor.vue')),
        initialData: {
            title: 'Lineamientos',
            titleLink: '/lineamiento',
            introText: 'La RIESGIRD-ACC Perú orienta su accionar bajo los siguientes lineamientos:',
            lineamientos: [
                { id: 1, color: 'azul', texto: 'Promoción de alianzas estratégicas con el Estado, la empresa privada, la sociedad civil y la cooperación internacional.' },
                { id: 2, color: 'rojo', texto: 'Desarrollo de programas académicos conjuntos y redes de formación en GIRD-ACC.' },
                { id: 3, color: 'rojo', texto: 'Vinculación con la comunidad y fortalecimiento de la responsabilidad social universitaria con enfoque territorial.' },
                { id: 4, color: 'azul', texto: 'Gestión del conocimiento y difusión de buenas prácticas.' },
                { id: 5, color: 'azul', texto: 'Impulso de la investigación colaborativa y las redes de conocimiento.' },
                { id: 6, color: 'rojo', texto: 'Fortalecimiento de capacidades para la reducción del riesgo de desastres y la adaptación al cambio climático.' }
            ]
        }
    },
    AliadosSlider: {
        label: '🤝 Carrusel Infinito de Aliados',
        icon: 'las la-handshake',
        group: 'Institucional',
        isBoxed: true, // 👈 TOTALMENTE ADAPTADO PARA TU SISTEMA DE CAJA BLANCA UNIFICADA
        component: defineAsyncComponent(() => import('../components/riesgo/sliderH/views/AliadosSlider.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/sliderH/updates/AliadosSliderEditor.vue')),
        initialData: {
            title: 'Aliados',
            logos: [
                { id: 1, name: 'Pacífico', src: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?auto=format&fit=crop&q=80&w=200' },
                { id: 2, name: 'Colegio de Ingenieros', src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200' },
                { id: 3, name: 'BID', src: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80&w=200' },
                { id: 4, name: 'Pacífico Seguro', src: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?auto=format&fit=crop&q=80&w=200' }
            ]
        }
    },
    EventosNoticias: {
        label: '📅 Feed de Eventos y Noticias',
        icon: 'las la-newspaper',
        group: 'Grillas',
        isBoxed: true,
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/EventosNoticias.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/EventosNoticiasEditor.vue')),
        initialData: {
            title: 'Eventos y Noticias Destacados',
            limit: 4,
            postType: 'all'
        }
    },
    FasesProceso: {
        label: '📅 Fases del Proceso',
        icon: 'las la-newspaper',
        group: 'Grillas', // Se auto-indexa en tu barra lateral de "Grillas y Contenido"
        isBoxed: true, // 👈 INTEGRADO EN TU ARQUITECTURA DE CONTENEDOR SECCIONAL UNIFICADO
        component: defineAsyncComponent(() => import('../components/riesgo/grid/ProcessPhases/Block.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/ProcessPhases/Editor.vue')),
        initialData: {
            title: 'Fases del Proceso',
            cards: [
                {
                    title: 'Solicitud Institucional',
                    description: '',
                    periodText: '1 Semana',
                    highlightBackground: true
                }
            ]
        }
    },
    DirectorioRectores: {
        label: '👥 Directorio (Solo Rectores)',
        icon: 'las la-user-tie',
        group: 'Grillas',
        isBoxed: true,
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/DirectorioRectores.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/DirectorioRectoresEditor.vue')),
        initialData: {
            title: 'Directorio',
            introText: 'Sección destinada al registro y archivo oficial de las actividades, acuerdos y reuniones sostenidas por los directivos en el marco de la red.',
            limit: 4
        }
    },
    EstructuraOrganizacional: {
        label: '🌳 Organigrama Estructural',
        icon: 'las la-sitemap',
        isBoxed: true,
        group: 'Grillas',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/EstructuraRiesGird.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/EstructuraRiesGirdEditor.vue')),
        initialData: {
            title: 'Estructura de la RiesGIRD-ACC/Perú',
            universidades: [
                'Universidad Nacional Mayor de San Marcos',
                'Pontificia Universidad Católica del Perú',
                'Universidad Nacional de Ingeniería',
                'Universidad Nacional Agraria La Molina'
            ]
        }
    },
    EstructuraImagen: {
        label: '🖼️ Estructura (Título + Imagen)',
        icon: 'las la-image',
        isBoxed: true,
        group: 'Grillas',
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/EstructuraImagen.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/EstructuraImagenEditor.vue')),
        initialData: {
            title: 'Estructura de la RiesGIRD-ACC/Perú',
            imageUrl: ''
        }
    },
    ConsejoDirectivo: {
        label: '🏢 Consejo Directivo (Tarjetas)',
        icon: 'las la-users-cog',
        isBoxed: true, // Se integra milimétricamente dentro de las cajas .content-wrapper del layout
        group: 'Grillas',
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/ConsejoDirectivo.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/ConsejoDirectivoEditor.vue')),
        initialData: {
            title: 'Consejo Directivo',
            introText: 'El Consejo Directivo es el órgano encargado de dirigir, administrar y representar legalmente a la Red. Su función principal es ejecutar los acuerdos de la Asamblea General de Rectores y evaluar la admisión de nuevas universidades miembro.',
            subtitle: 'Directorio Actual (Periodo 2024 - 2027)',
            directorio: [
                {
                    nombre: 'Dr. Edgardo Palomino Torres',
                    cargo: 'Secretario',
                    institucion: 'Universidad Nacional de Huancavelica',
                    photo_url: '',
                    emails: []
                },
                {
                    nombre: 'Dr. Jaime Serida Nishimura',
                    cargo: 'Presidente',
                    institucion: 'Rector de la Universidad ESAN',
                    photo_url: '',
                    emails: [
                        'jserida@esan.edu.pe',
                        'red_riesgird-acc_pe@esan.edu.pe'
                    ]
                },
                {
                    nombre: 'Dr. Edgar Martínez Huamán',
                    cargo: 'Vocal',
                    institucion: 'Universidad Nacional José María Arguedas',
                    photo_url: '',
                    emails: []
                }
            ]
        }
    },
    MembershipCertificate: {
        label: '📜 Certificado de Membresía',
        icon: 'las la-certificate',
        group: 'Hero',
        // isBoxed: false,
        component: defineAsyncComponent(() => import('../components/riesgo/section/MembershipCertificate/Block.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/MembershipCertificate/Editor.vue')),
        initialData: {
            title: 'Certificado de Membresía',
            description: 'Al completar el proceso de adscripción, tu universidad recibirá un certificado oficial que acredita su membresía en la RiesGrid-ACC Perú.',
            buttonText: 'Solicitar Información',
            buttonUrl: '#'
        }
    },
    RequirementDocument: {
        label: '📜 Requisitos y Documentos',
        icon: 'las la-certificate',
        group: 'Hero',
        // isBoxed: false,
        component: defineAsyncComponent(() => import('../components/riesgo/section/RequerimentDocument/Block.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/RequerimentDocument/Editor.vue')),
        initialData: {
            titleRequirements: 'Requisitos',
            requirements: [{
                text: 'Ser una universidad licenciada por SUNEDU'
            }],
            titleDocuments: 'Modelos de Documentos',
            documents: [{
                title: 'Modelo de Carta de Solicitud',
                description: 'Formato oficial para solicitar la incorporación.',
                file: ''
            }],
            buttonText: '¡Únete a la Red!',
            buttonUrl: '#'
        }
    },
    // HeroDefault: {
    //     label: 'Hero Default',
    //     group: 'Hero',
    //     component: defineAsyncComponent(() => import('../components/riesgo/hero/default/Block.vue')),
    //     // editor: defineAsyncComponent(()=> import('../components/riesgo/hero/default/Editor.vue')),
    //     initialData: {
    //         title: 'Título principal',
    //         subtitle: 'Subtítulo',
    //         backgroundImage: '',
    //         height: '500px',
    //         waveColor: '#ffffff'
    //     }
    // },
    SecretariaTecnica: {
        label: '✍️ Secretaría Técnica (Liderazgo & Comité)',
        icon: 'las la-user-tie',
        isBoxed: true, // Auto-acoplable dentro de las cajas blancas del layout general
        group: 'Grillas',
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/SecretariaTecnica.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/SecretariaTecnicaEditor.vue')),
        initialData: {
            title: 'Secretaría Técnica',
            description1: 'La Secretaría Técnica es el brazo operativo y articulador de la RiesGIRD-ACC Perú. Está encargada de coordinar la ejecución del plan de trabajo, centralizar la información técnica y articular los esfuerzos de los equipos de especialistas de todas nuestras universidades miembro.',
            leaderTitle: 'Liderazgo Actual',
            leader: {
                nombre: 'Prof. e investigadora Mary Mollo Medina',
                cargo: 'Secretaria Técnica Nacional',
                institucion: 'Universidad ESAN',
                correo: 'mmollo@esan.edu.pe',
                photo_url: ''
            },
            description2: 'El verdadero valor de nuestra Secretaría Técnica radica en su pluralidad. No está conformada por una sola persona o institución, sino que es operada por un comité interinstitucional integrado por especialistas y gestores designados por cada universidad miembro de la Red. Este equipo de expertos es el encargado de aterrizar los acuerdos del Consejo Directivo y hacer realidad nuestros proyectos de investigación, formación y responsabilidad socio-ambiental en todo el país.',
            committeeTitle: 'Comité Técnico Interinstitucional',
            comite: [
                {
                    universidad: 'UNMSM',
                    nombre: 'Dr. Juan Carlos Villegas Palomino',
                    especialidad: 'Geología y Riesgos Sísmicos',
                    correo: '',
                    photo_url: '',
                    logoUniversidad: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Escudo_de_la_Universidad_Nacional_Mayor_de_San_Marcos.svg'
                },
                {
                    universidad: 'UNI',
                    nombre: 'Dra. María Elena Foronda Robles',
                    especialidad: 'Ingeniería Sísmica y Estructural',
                    correo: '',
                    photo_url: '',
                    logoUniversidad: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Uni_logo.png'
                }
            ]
        }
    },
    CienciaExtremoExtremo: {
        label: '🔬 Info Red (Ciencia Extremo a Extremo)',
        icon: 'las la-microscope',
        isBoxed: true,
        group: 'Institucional',
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/CienciaExtremoExtremo.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/CienciaExtremoExtremoEditor.vue')),
        initialData: {
            title: 'Conectando la ciencia de extremo a extremo',
            description: 'La Red de investigadores de la RIESGIRD - ACC Perú es nuestra comunidad científica. Un espacio donde docentes, specialists y tesistas de distintas universidades colaboran para generar evidencia que fortalezca la gestión del riesgo y resiliencia climática.',
            imageUrl: ''
        }
    },
    QueHacemosRedInvestigadores: {
        label: '🔬 Gestión Red (¿Qué hacemos?)',
        icon: 'las la-info-circle',
        isBoxed: true,
        group: 'Institucional',
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/QueHacemosRedInvestigadores.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/QueHacemosRedInvestigadoresEditor.vue')),
        initialData: {
            title: '¿Qué hacemos en la Red de Investigadores?',
            text: 'Fomentamos la creación de equipos multidisciplinarios e interinstitucionales. Creemos que un geólogo en sur, un climatólogo en la selva y un sociólogo en el norte puede trabajar juntos para entender mejor nuestras vulnerabilidades. Esta red facilita el intercambio de datos, la postilación conjunta a fondos de investigación y el desarrollo de proyectos de alto impacto.',
            imageUrl: ''
        }
    },
    LineasInvestigacion: {
        label: '🔬 Líneas Prioritarias de Investigación',
        icon: 'las la-microscope',
        isBoxed: true, // Se queda en false para estirar su fondo #f4f7fc de borde a borde
        group: 'Institucional',
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/LineasInvestigacion.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/LineasInvestigacionEditor.vue')),
        initialData: {
            title: 'Nuestras Líneas Prioritarias de Investigación',
            introText: 'Todas las investigaciones respaldadas por la Red se enmarcan en las siguientes áreas clave:',
            useContainer: true,
            lineas: [
                {
                    title: 'Evaluación y Modelamiento del Riesgo:',
                    desc: 'Estudios sobre peligros naturales y antrópicos, análisis de vulnerabilidad (física, social, económica) y escenarios de riesgo a nivel local y regional.',
                    icon: 'las la-chart-bar'
                },
                {
                    title: 'Adaptación y Mitigación al Cambio Climático',
                    desc: 'Investigaciones sobre el impacto del clima en los ecosistemas, la agricultura, los recursos hídricos y propuestas de soluciones basadas en la naturaleza.',
                    icon: 'las la-globe-americas'
                },
                {
                    title: 'Planificación y Ordenamiento Territorial',
                    desc: 'Desarrollo de metodologías para ciudades seguras, infraestructura resiliente y políticas de uso de suelo que eviten la creación de nuevos riesgos.',
                    icon: 'las la-map-marked-alt'
                },
                {
                    title: 'Tecnologías y Sistemas de Alerta Temprana (SAT)',
                    desc: 'Innovación tecnológica, monitoreo, uso de drones, sistemas de información geográfica (SIG) y comunicación de riesgo para la protección de la población.',
                    icon: 'las la-broadcast-tower'
                }
            ]
        }
    },
    NuestroRepositorio: {
        label: '📚 Repositorio Digital (Ejes de Biblioteca)',
        icon: 'las la-archive',
        isBoxed: true,
        group: 'Contenido',
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/NuestroRepositorio.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/NuestroRepositorioEditor.vue')),
        initialData: {
            title: 'Nuestro Repositorio',
            introText: 'Transferimos la ciencia a la práctica a través de recursos de libre acceso.',
            ejes: [
                {
                    titulo: 'Publicaciones Científicas:',
                    descripcion: 'Artículos, tesis destacadas y libros publicados por los miembros de la Red.',
                    icono: 'las la-book-open'
                },
                {
                    titulo: 'Policy Briefs:',
                    descripcion: 'Documentos ejecutivos y digeribles donde traducimos investigaciones complejas en recomendaciones directas para alcaldes, ministros y autoridades del SINAGERD.',
                    icono: 'las la-calculator'
                },
                {
                    titulo: 'Manuales y Guías Técnicas:',
                    descripcion: 'Herramientas prácticas para la incorporación de la GIRD y la ACC en municipalidades y campus universitarios.',
                    icono: 'las la-tools'
                },
                {
                    titulo: 'Datos Abiertos y Visores:',
                    descripcion: 'Enlaces a mapas de peligro, observatorios y bases de datos generadas por los nodos regionales.',
                    icono: 'las la-map-marked-alt'
                }
            ]
        }
    },
    CtaBannerSection: {
        label: '📢 Banner de Llamado (CTA)',
        icon: 'las la-bullhorn',
        isBoxed: true, // Se extiende de borde a borde para romper la monotonía del lienzo
        group: 'Contenido',
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/CtaBanner.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/CtaBannerEditor.vue')),
        initialData: {
            title: 'Sube tu investigación',
            buttonText: 'Aporta al Repositorio',
            actionUrl: 'https://red-riesgird.esan.edu.pe/upload', // Ejemplo inicial
            targetBlank: true
        }
    },

    DocumentacionFormal: {
        label: '📄 Documentación Formal y Respaldo',
        icon: 'las la-file-pdf',
        isBoxed: true,
        group: 'Contenido',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/DocumentacionFormal.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/DocumentacionFormalEditor.vue')),
        initialData: {
            title: 'Documentación Formal y Respaldo',
            introText: 'Toda nuestra estrategia de transversalización está respaldada por marcos normativos nacionales e internacionales. Ponemos a disposición de la comunidad universitaria los siguientes documentos base:',
            documentos: [
                {
                    tag: '[PDF]',
                    title: 'Implementación de Sistema de Alerta Temprana Comunitario ante fenómeno El Niño',
                    institution: 'Universidad Nacional de Piura y Municipalidad de Catacaos',
                    desc: 'Estudiantes de ingeniería electrónica y sociología trabajaron con la comunidad para instalar sensores de nivel de río de bajo costo y capacitaron a 50 líderes vecinales en protocolos de evacuación rápida.',
                    fileUrl: '' // 🎯 Inicializa listo para enganchar el archivo real
                }
            ]
        }
    },
    EstructuraOferta: {
        label: '🎓 Estructura de la Oferta Académica',
        icon: 'las la-graduation-cap',
        isBoxed: true,
        group: 'Contenido',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/EstructuraOferta.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/EstructuraOfertaEditor.vue')),
        initialData: {
            title: '¿Cómo estructuramos la oferta?',
            introText: 'El camino hacia una oferta consolidada ha sido progresivo. Empezamos con esfuerzos aislados de algunos docentes y la creación de diplomados esporádicos. Hoy, gracias a la articulación de la Red, hemos logrado estandarizar competencias, compartir recursos entre universidades y alcanzar logros significativos, como la acreditación de programas conjuntos y la creación de maestrías especializadas que responden a la demanda del Estado y el sector privado.',
            ofertas: [
                {
                    nivelTag: 'Nivel Pregrado',
                    subtitle: 'Cursos Electivos y Generales',
                    description: 'La puerta de entrada. Promovemos la creación de cursos electivos transversales (ej. "Gestión del Riesgo y Cambio Climático") abiertos a estudiantes de cualquier facultad. El objetivo es brindar nociones básicas, normativa nacional y herramientas de cultura preventiva antes de que el alumno se especialice.',
                    icon: 'las la-graduation-cap'
                },
                {
                    nivelTag: 'Nivel Posgrado',
                    subtitle: 'Formación Especializada',
                    description: 'Para quienes liderarán la toma de decisiones. Desarrollamos diplomados, maestrías y doctorados enfocados en la evaluación técnica de riesgos, diseño de políticas públicas, formulación de proyectos de inversión pública (Invierte.pe) con enfoque de riesgo, y tecnologías de monitoreo.',
                    icon: 'las la-university'
                }
            ]
        }
    },
    CasoExitoAlianza: {
        label: '🏆 Alianzas y Casos de Éxito',
        icon: 'las la-trophy',
        isBoxed: true, // Se extiende de borde a borde para que luzca limpio en la landing page
        group: 'Contenido',
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/CasoExitoAlianza.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/CasoExitoAlianzaEditor.vue')),
        initialData: {
            title: 'Caso de Éxito y Alianzas',
            subTitle: 'Maestría Conjunta en Gestión de Riesgos y Sostenibilidad',
            highlightLabel: 'El Modelo de Éxito:',
            text: 'Un claro ejemplo de nuestra capacidad de articulación es la alianza entre la Universidad Nacional de Ingeniería (UNI) aportando el rigor técnico, la Universidad ESAN aportando la visión en gestión pública y negocios, y el Ministerio de la Producción (PRODUCE) garantizando la aplicabilidad en el sector estatal.',
            bannerText: 'Esta sinergia demuestra que el trabajo en red permite crear programas de posgrado de altísimo nivel, formando funcionarios y especialistas con una visión completa y multidisciplinaria.',
            imageUrl: '' // Inicia vacío para detonar el casillero punteado
        }
    },
    ComoColaboramos: {
        label: '🤝 Modelo de Trabajo Premium (Tarjetas Horizontales)',
        icon: 'las la-handshake',
        isBoxed: true, // Se expande de borde a borde para lucir espectacular en la landing
        group: 'Institucional',
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/ComoColaboramos.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/ComoColaboramosEditor.vue')),
        initialData: {
            title: '¿Cómo colaboramos?',
            introText: 'Nuestra red transforma la competencia académica en cooperación estratégica. Trabajamos bajo un esquema de apoyo mutuo que nos permite potenciar las capacidades de cada región:',
            cards: [
                {
                    title: 'Intercambio de Recursos y Datos',
                    text: 'Las universidades miembro comparten acceso a repositorios, resultados de investigaciones, bases de datos climáticas y metodologías de evaluación de riesgos.',
                    imageUrl: ''
                },
                {
                    title: 'Movilidad y Equipos Mixtos',
                    text: 'Fomentamos la creación de grupos de investigación multidisciplinarios, donde docentes y estudiantes de distintas universidades (y regiones) trabajan juntos en proyectos comunes.',
                    imageUrl: ''
                }
            ],
            wideCard: {
                title: 'Estandarización Académica',
                text: 'Compartimos mallas curriculares, sílabos y buenas prácticas pedagógicas para asegurar que la enseñanza de la GIRD y la ACC tenga un alto nivel en todo el territorio nacional.',
                imageUrl: ''
            }
        }
    },
    LaboratorioTerritorial: {
        label: '🧪 Laboratorio Territorial (Living Lab)',
        icon: 'las la-flask',
        isBoxed: true, // Se queda en false para estirarse con su fondo #f2f5fa de extremo a extremo
        group: 'Contenido',
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/LaboratorioTerritorial.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/LaboratorioTerritorialEditor.vue')),
        initialData: {
            title: '¿Qué es un Laboratorio Territorial?',
            text: 'A diferencia de un laboratorio tradicional de cuatro paredes, un Living Lab es una zona geográfica específica (una cuenca, una ciudad, un valle agrícola) donde implementamos y validamos tecnologías y estrategias sociales junto con las personas que habitan el lugar.'
        }
    },
    AsambleasGenerales: {
        label: '📄 Asambleas Generales (Conexión Directa Fastify)',
        icon: 'las la-file-contract',
        isBoxed: true,
        group: 'Contenido',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/AsambleasGenerales.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/AsambleasGeneralesEditor.vue')),
        initialData: {
            title: 'Asambleas Generales',
            limit: 6,
            postType: 'assemblies'
        }
    },
    DirectorioMiembros: {
        label: '🏫 Directorio de Universidades Miembro',
        icon: 'las la-university',
        isBoxed: true,
        group: 'Institucional',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/DirectorioMiembros.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/DirectorioMiembrosEditor.vue')),
        initialData: {
            title: 'Directorio de Miembros',
            limit: 8
        }
    },
    DirectorioAutoridades: {
        label: '👥 Directorio de Autoridades de la Red',
        icon: 'las la-users-cog',
        isBoxed: true,
        group: 'Institucional',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/DirectorioAutoridades.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/DirectorioAutoridadesEditor.vue')),
        initialData: {
            title: 'Directorio',
            limit: 6
        }
    },
    AliadosBuscar: {
        label: '🤝 Directorio de Aliados Estratégicos',
        icon: 'las la-handshake',
        isBoxed: true,
        group: 'Institucional',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/Aliados.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/AliadosEditor.vue')),
        initialData: {
            title: 'Busca su Aliado',
            limit: 12
        }
    },
    MemoriasCongreso: {
        label: '🏆 Memorias de Congresos (Documentos, PPTs & Videos)',
        icon: 'las la-trophy',
        isBoxed: true, // Rompe contenedores rígidos para expandirse de forma imponente
        group: 'Contenido',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/MemoriasCongreso.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/MemoriasCongresoEditor.vue')),
        initialData: {
            title: 'Memorias de Congresos Internacionales RiesGIRD-ACC',
            introText: 'Revive las ponencias, debates y acuerdos de nuestros principales espacios de articulación. Aquí encontrarás las presentaciones, actas y grabaciones de los congresos, foros y asambleas impulsados por la RIESGIRD-ACC Perú.',
            historialCongresos: [
                {
                    year: '2025',
                    eventName: 'Congreso Nacional de Universidades Resilientes',
                    description: 'Espacio de debate nacional enfocado en la estandarización curricular de la GIRD y la mitigación de desastres climatológicos en las macro-regiones.',
                    reportFileUrl: '',
                    documentos: [
                        { tipo: 'PDF', titulo: 'Declaratoria Final del Congreso', fileUrl: '' },
                        { tipo: 'PPT', titulo: 'Avances de la GIRD en el Norte (UNI de Piura)', fileUrl: '' },
                        { tipo: 'VIDEO', titulo: 'Grabación del panel de cierre', fileUrl: '' }
                    ],
                    galerias: [{ actionUrl: '' }, { actionUrl: '' }, { actionUrl: '' }]
                },
                {
                    year: '2024',
                    eventName: 'Foro Macrorregional Sur sobre Cambio Climático',
                    description: 'Análisis profundo sobre el impacto del estrés hídrico y las heladas en las cuencas del litoral y los valles andinos.',
                    reportFileUrl: '',
                    documentos: [
                        { tipo: 'PDF', titulo: 'Memoria Descriptiva del Foro', fileUrl: '' },
                        { tipo: 'PPT', titulo: 'Estrategias de Reforestación (UNSA)', fileUrl: '' },
                        { tipo: 'VIDEO', titulo: 'Ponencias Magistrales Bloque B', fileUrl: '' }
                    ],
                    galerias: [{ actionUrl: '' }, { actionUrl: '' }, { actionUrl: '' }]
                }
            ]
        }
    },
    GestionConocimiento: {
        label: '📚 Repositorio Documental Oficial (Tabs & Descargas)',
        icon: 'las la-folder-open',
        isBoxed: true, // Rompe contenedores rígidos para lucir imponente de extremo a extremo
        group: 'Contenido',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/GestionConocimiento.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/GestionConocimientoEditor.vue')),
        initialData: {
            title: 'Encuentre su Memoria',
            introText: 'Accede a los documentos oficiales que rigen el funcionamiento de nuestra Red, así como a los planes de trabajo, actas del Consejo Directivo y lineamientos técnicos internos para nuestras universidades miembro.',
            // 🎯 Restauradas las categorías point-and-click con el salto de línea (\n) nativo
            categorias: [
                { label: 'Documentos\nde Gobernanza', value: 'gobernanza' },
                { label: 'Planes\nOperativos', value: 'planes' },
                { label: 'Actas y\nResoluciones', value: 'actas' }
            ],
            // 🎯 Estructura de diccionario relacional indexado emparejado con las pestañas
            documentos: {
                gobernanza: [
                    { tipo: 'PPT', titulo: 'Estatuto Oficial de la RIESGIRD-ACC Perú', fileUrl: '' },
                    { tipo: 'PDF', titulo: 'Estrategia de Expansión de Nodos Regionales', fileUrl: '' },
                    { tipo: 'PDF', titulo: 'Reglamento Interno de la Asamblea General', fileUrl: '' }
                ],
                planes: [
                    { tipo: 'PDF', titulo: 'Plan Operativo Institucional 2025', fileUrl: '' },
                    { tipo: 'PDF', titulo: 'Plan Estratégico 2024–2026', fileUrl: '' }
                ],
                actas: [
                    { tipo: 'PDF', titulo: 'Acta del Consejo Directivo – Marzo 2025', fileUrl: '' }
                ]
            }
        }
    },
    InvestigacionesProducidas: {
        label: '🔬 Producción Científica & Investigaciones (Filtro Vivo)',
        icon: 'las la-microscope',
        isBoxed: true, // Se despliega libre en la grilla para máxima fidelidad móvil
        group: 'Contenido',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/InvestigacionesProducidas.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/InvestigacionesProducidasEditor.vue')),
        initialData: {
            title: 'Encuentra su investigacion',
            introText: 'Explora nuestra base de datos de producción científica. Documentos, tesis, policy briefs y artículos desarrollados por los investigadores de nuestras universidades miembro, orientados a resolver los desafíos territoriales del país.',
            items: [
                {
                    autor: 'Equipo Nodo Centro (UNMSM - UNI).',
                    tipo: 'Título',
                    titulo: 'Análisis de vulnerabilidad sísmica en colegios públicos de Lima.',
                    fileUrl: ''
                },
                {
                    autor: 'Comité Técnico de la RIESGIRD-ACC.',
                    tipo: 'Policy Brief',
                    titulo: 'Recomendaciones para el ordenamiento territorial en zonas de huaicos.',
                    fileUrl: ''
                },
                {
                    autor: 'Equipo Nodo Sur (UNSA - UPT).',
                    tipo: 'Artículo',
                    titulo: 'Impacto del cambio climático en los acuíferos altoandinos y valles costeros.',
                    fileUrl: ''
                }
            ]
        }
    },
    AsambleaRectores: {
        label: '🏛️ Libro de Actas (Asamblea General de Rectores)',
        icon: 'las la-calendar-check',
        isBoxed: true,
        group: 'Institucional',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/AsambleaRectores.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/AsambleaRectoresEditor.vue')),
        initialData: {
            title: 'Asamblea de Rectores',
            introText: 'Las asambleas de rectores son el máximo órgano de gobierno de la red, donde se toman las decisiones estratégicas institucionales.',
            assemblies: [
                {
                    id: 'asm-1',
                    year: '2025',
                    title: 'Asamblea Ordinaria General 2025',
                    date: '22 de mayo de 2025',
                    location: 'Universidad Nacional Tecnológica de Lima Sur, Lima',
                    agenda: [
                        'Evaluación de la resiliencia en mallas curriculares de pregrado',
                        'Aprobación de nuevos lineamientos frente al estrés hídrico macro-regional',
                        'Integración de la flat-list del repositorio de conocimiento científico'
                    ],
                    acuerdos: [
                        'Homologar los créditos académicos en asignaturas de gestión socio-ambiental.',
                        'Aprobar el fondo extraordinario de financiamiento para investigaciones de campo.'
                    ],
                    fotos: [],
                    documentos: []
                },
                {
                    id: 'asm-2',
                    year: '2024',
                    title: 'Asamblea Ordinaria General 2024',
                    date: '15 de agosto de 2024',
                    location: 'Universidad Nacional Mayor de San Marcos, Lima',
                    agenda: [
                        'Instalación formal de la RiesGIRD-ACC Perú',
                        'Aprobación del Estatuto Fundacional de la Red',
                        'Elección del primer Consejo Directivo Técnico',
                        'Presentación del Plan de Trabajo Consolidado 2024-2027'
                    ],
                    acuerdos: [
                        'Ratificar los estatutos de libre afiliación universitaria.',
                        'Fijar el calendario de sesiones macro-regionales para vicerrectores.'
                    ],
                    fotos: [],
                    documentos: []
                }
            ]
        }
    },
    CooperacionSlider: {
        label: '🤝 Slider de Cooperación e Iniciativas Académicas',
        icon: 'las la-images',
        isBoxed: true,
        group: 'Hero',
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/CooperacionSlider.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/CooperacionSliderEditor.vue')),
        initialData: {
            items: [
                {
                    id: 'sl-1',
                    title: 'Impulsando la cooperación académica entre universidades',
                    description: 'Representantes de diversas instituciones participaron en un encuentro académico orientado a fortalecer la colaboración interuniversitaria y promover nuevas iniciativas de investigación conjunta.',
                    author: 'Universidad Nacional Mayor de San Marcos',
                    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
                },
                {
                    id: 'sl-2',
                    title: 'Segunda Iniciativa de Innovación Sostenible',
                    description: 'Mesas de trabajo enfocadas en el desarrollo tecnológico de las regiones y la transferencia de conocimiento científico aplicable.',
                    author: 'Universidad de Ingeniería & Tecnología',
                    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80'
                }
            ]
        }
    },
    NoticiasEventosHub: {
        label: '📰 Megasección Hub de Noticias & Eventos',
        icon: 'las la-newspaper',
        isBoxed: false, // Permite que rompa envolturas rígidas y maneje su propio layout fluido
        group: 'Contenido',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/NoticiasEventosHub.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/NoticiasEventosHubEditor.vue')),
        initialData: {
            bannerText: 'Entérate de las últimas novedades, participa en nuestros próximos encuentros y únete a las iniciativas que impulsan el desarrollo territorial sostenible.'
        }
    },
    BannerInformativo: {
        label: '🚩 Banner Destacado Gradiente Tricolor',
        icon: 'las la-ad',
        isBoxed: false, // Permite que maneje sus propios márgenes fluidos
        group: 'Institucional',
        component: defineAsyncComponent(() => import('../components/riesgo/section/views/BannerInformativo.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/updates/BannerInformativoEditor.vue')),
        initialData: {
            bannerText: 'Entérate de las últimas novedades, participa en nuestros próximos encuentros y únete a las iniciativas que impulsan el desarrollo territorial sostenible.'
        }
    },
    DynamicContentGrid: {
        label: ' Rejilla Dinámica (Noticias, Eventos o Asambleas)',
        icon: 'las la-th-large',
        isBoxed: false, // Rompe cajas estáticas para alineación fluida en la landing
        group: 'Contenido',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/DynamicContentGrid.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/DynamicContentGridEditor.vue')),
        initialData: {
            title: 'Últimas Novedades de la Red',
            introText: 'Mantente al tanto de las actividades, acuerdos y novedades científicas impulsadas por nuestros nodos regionales.',
            contentType: 'news', // Modo inicial por defecto
            items: [
                {
                    id: 'fd-1',
                    titulo: 'Análisis de vulnerabilidad sísmica en colegios públicos de Lima.',
                    resumen: 'Estudio de campo enfocado en la evaluación estructural de centros educativos de la capital frente a sismos de gran magnitud.',
                    autor: 'Equipo Nodo Centro (UNMSM - UNI)',
                    imagen: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
                    fecha_evento: '15 de Agosto, 2026',
                    ubicacion_evento: 'Auditorio Central UNMSM',
                    url_enlace: ''
                },
                {
                    id: 'fd-2',
                    titulo: 'Recomendaciones para el ordenamiento territorial en zonas de huaicos.',
                    resumen: 'Policy brief técnico que recopila lineamientos de mitigación y gestión del riesgo en cuencas vulnerables.',
                    autor: 'Comité Técnico de la RIESGIRD-ACC',
                    imagen: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
                    fecha_evento: '22 de Septiembre, 2026',
                    ubicacion_evento: 'Plataforma Virtual Zoom',
                    url_enlace: ''
                }
            ]
        }
    },
    AcuerdosScrollHub: {
        label: '📜 Repositorio Documental con Scroll Interno',
        icon: 'las la-archive',
        isBoxed: false,
        group: 'Contenido',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/AcuerdosScrollHub.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/AcuerdosScrollHubEditor.vue')),
        initialData: {
            title: 'Repositorio Documental de Acuerdos',
            accentColor: 'blue',
            maxHeightPx: 420,
            items: [
                { id: 1, title: 'Acta Suscrita de la Asamblea Extraordinaria de Rectores - Sede UNMSM', category: 'Acta Oficial', publish_date: '2026-05-14', file_size: '2.4 MB', download_url: '#' },
                { id: 2, title: 'Resolución Marco N° 042-2026/RIESGIRD: Incorporación de Nuevos Nodos', category: 'Resolución', publish_date: '2026-06-02', file_size: '1.8 MB', download_url: '#' }
            ]
        }
    },
    SectionTitleDescription: {
        label: '📌 Titulo y Descripcion',
        icon: 'bi bi-type-h1',
        group: 'Contenido',
        isBoxed: true,
        component: defineAsyncComponent(() => import('../components/riesgo/section/title/SectionTitle.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/title/Editor.vue')),
        initialData: {
            title: 'Título de la sección',
            introText: '',
            maxWidth: 760,
            gap: 40,
            paddingTop: 20,
            paddingBottom: 20,
            backgroundColor: '#fff'
        }
    },
    SectionMissionVision: {
        label: '🎯 Misión y Visión',
        icon: 'bi bi-bullseye',
        group: 'Contenido',
        isBoxed: true,
        component: defineAsyncComponent(() => import('../components/riesgo/section/MissionVision/Block.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/section/MissionVision/Editor.vue')),
        initialData: {
            misionTitle: 'Nuestra Misión',
            misionText: 'Promover la institucionalización de la Gestión Integral del Riesgo de Desastres (GIRD) y la Adaptación al Cambio Climático (ACC) en el sistema de educación superior peruano.',
            misionHowTitle: '¿Cómo lo logramos?',
            misionHowText: 'Incorporando ambos enfoques de manera transversal en los procesos de gobernanza universitaria, formación académica, investigación y responsabilidad social, respetando y considerando las particularidades de nuestros diversos territorios.',
            visionTitle: 'Nuestra Visión',
            visionText: 'Ser la red académica referente a nivel nacional, reconocida por su contribución fundamental al desarrollo sostenible del país.',
            visionFutureTitle: '¿Qué futuro construimos?',
            visionFutureText: 'Un Perú donde las universidades lideran la articulación efectiva con el Sistema Nacional de Gestión del Riesgo de Desastres (SINAGERD) y tienen una incidencia directa en las políticas públicas vinculadas al ordenamiento territorial y la mitigación del cambio climático.'
        }
    },
    DynamicGridInfinite: {
        label: '⚡ Rejilla Avanzada con Carga Infinita (10 en 10)',
        icon: 'las la-th-large',
        isBoxed: true,
        group: 'Contenido',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/DynamicGridInfinite.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/DynamicGridInfiniteEditor.vue')),

        initialData: {
            title: 'Eventos y Noticias Destacados', 
            introText: 'Explore nuestro catálogo indexado de informes, artículos de contingencia y producción científica de la red.',
            postType: 'news', 
            limitFetch: 10,
            items: []
        }
    },
     DirectorioMiembrosAll: {
        label: '🏫 Directorio de Universidades Miembro Detalle',
        icon: 'las la-university',
        isBoxed: true,
        group: 'Institucional',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/DirectorioMiembrosAll.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/DirectorioMiembrosAllEditor.vue')),
        initialData: {
            title: 'Directorio de Miembros Detalle',
            limit: 8
        }
    },
    DirectorioAutoridadesAll: {
        label: '👥 Directorio de Autoridades de la Red Detalle',
        icon: 'las la-users-cog',
        isBoxed: true,
        group: 'Institucional',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/DirectorioAutoridadesAll.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/DirectorioAutoridadesAllEditor.vue')),
        initialData: {
            title: 'Directorio de Autoridades Detalle',
            limit: 6
        }
    },
        DirectorioEspecialistas: {
        label: '👥 Directorio de Especialistas de la Red',
        icon: 'las la-users-cog',
        isBoxed: true,
        group: 'Institucional',
        component: defineAsyncComponent(() => import('../components/riesgo/grid/views/DirectorioEspecialistas.vue')),
        // editor: defineAsyncComponent(() => import('../components/riesgo/grid/updates/DirectorioEspecialistasEditor.vue')),
        initialData: {
            title: 'Directorio',
            limit: 6
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
    { id: 'Contenido', label: '💬 Contenidos', color: 'outline-warning', icon: 'las la-comment-dots' },
];



// Mapeos estructurales para renderizado y listados (Nuxt y Vue los leen sin romper nada)
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

export const BlockLabels = Object.keys(BLOCK_REGISTRY).reduce((acc, key) => {
    acc[key] = BLOCK_REGISTRY[key].label;
    return acc;
}, {} as Record<string, string>);

export const blockIcons = Object.keys(BLOCK_REGISTRY).reduce((acc, key) => {
    acc[key] = BLOCK_REGISTRY[key].icon;
    return acc;
}, {} as Record<string, string>);

//Resolvedores limpios de lógica pública
export const resolveBlock = (type: string) => BlockComponents[type] || null;
export const getInitialData = (type: string) => JSON.parse(JSON.stringify(BLOCK_REGISTRY[type]?.initialData || {}));