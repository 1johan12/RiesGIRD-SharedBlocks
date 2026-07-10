        <script setup lang="ts">
        import { computed } from 'vue';

        interface MenuItem {
            id: number;
            title: string;
            url: string | null;
            children?: MenuItem[];
        }

        const props = defineProps<{ 
            config: any, 
            colors: { primary: string, accent: string, text: string },
            menu: MenuItem[] 
        }>();

        const safeConfig = computed(() => ({
            sticky: props.config?.sticky ?? true,
            showTopBar: props.config?.showTopBar ?? true,
            topBarText: props.config?.topBarText || 'Portal Académico',
            logoHeight: props.config?.logoHeight || 60,
            menuAlignment: props.config?.menuAlignment || 'right'
        }));

        const headerStyle = computed(() => ({
            borderTop: `4px solid ${props.colors.accent}`,
            position: (safeConfig.value.sticky ? 'sticky' : 'relative') as any,
            top: 0,
            zIndex: 1000
        }));
        </script>

        <template>
            <header class="header-classic bg-white shadow-sm" :style="headerStyle">
                <div v-if="safeConfig.showTopBar" 
                    class="top-bar py-1 px-4 d-flex justify-content-between align-items-center"
                    :style="{ backgroundColor: colors.primary, color: '#fff' }">
                    <span class="x-small"><i class="las la-info-circle"></i> {{ safeConfig.topBarText }}</span>
                    <div class="d-flex gap-3 x-small">
                        <span class="cursor-pointer">Intranet</span>
                        <span class="cursor-pointer">Correo</span>
                    </div>
                </div>

                <nav class="main-nav px-4 py-2 d-flex align-items-center">
                    <div class="logo-area">
                        <div class="bg-light d-flex align-items-center justify-content-center border rounded px-3" 
                            :style="{ height: safeConfig.logoHeight + 'px' }">
                            <i class="las la-university fs-3 text-muted me-2"></i>
                            <span class="fw-bold text-dark small">LOGOTIPO</span>
                        </div>
                    </div>

                    <ul class="nav gap-1" 
                        :class="{ 
                            'ms-auto': safeConfig.menuAlignment === 'right', 
                            'mx-auto': safeConfig.menuAlignment === 'center',
                            'me-auto': safeConfig.menuAlignment === 'left' 
                        }">
                        
                        <li v-for="item in menu" :key="item.id" class="nav-item position-relative group">
                            <a href="javascript:void(0)" 
                            class="nav-link fw-semibold px-3 py-2 rounded-pill"
                            :style="{ color: '#333' }">
                                {{ item.title }}
                                <i v-if="item.children?.length" class="las la-angle-down ms-1 small"></i>
                            </a>

                            <ul v-if="item.children?.length" class="submenu shadow-sm border rounded">
                                <li v-for="child in item.children" :key="child.id">
                                    <a href="#" class="dropdown-item py-2 px-3 small">{{ child.title }}</a>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <div v-if="safeConfig.menuAlignment !== 'right'" class="ms-3">
                        <b-button size="sm" class="border-0 px-3 fw-bold" :style="{ backgroundColor: colors.accent, color: '#fff' }">
                            PORTAL
                        </b-button>
                    </div>
                </nav>
            </header>
        </template>

        <style scoped>
        .x-small { font-size: 0.75rem; }
        .nav-link { 
            font-size: 0.85rem; 
            transition: all 0.2s ease; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .nav-link:hover { 
            background-color: rgba(0,0,0,0.05);
        }

        /* Estilos para el submenú */
        .nav-item .submenu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            min-width: 180px;
            background: white;
            list-style: none;
            padding: 10px 0;
            z-index: 1001;
        }

        .nav-item:hover .submenu {
            display: block;
        }

        .dropdown-item:hover {
            background-color: #f8f9fa;
            color: v-bind('colors.primary');
        }

        .header-classic { width: 100%; transition: all 0.3s ease; }
        .cursor-pointer { cursor: pointer; }
        </style>