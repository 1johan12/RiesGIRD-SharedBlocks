<template>
    <header 
        class="classic-header w-100" 
        :class="{ 
            'fixed-top': config.sticky, 
            'is-scrolled': isScrolled,
            'is-transparent': config.isTransparent && !isScrolled 
        }"
        :style="cssVars"
    >
        <div v-if="config.showTopBar" class="top-bar d-none d-lg-block">
            <div class="container-inner d-flex justify-content-between align-items-center h-100">
                <div class="social-links d-flex gap-3">
                    <a v-for="(link, index) in config.socialLinks" :key="'s-'+index" 
                       :href="link.url" 
                       class="top-link-item text-decoration-none">
                        <i :class="link.icon"></i>
                    </a>
                </div>
                <div class="top-links d-flex gap-4">
                    <a v-for="(link, index) in config.topLinks" :key="'t-'+index" 
                       :href="link.url" 
                       class="top-link-item text-decoration-none small fw-bold">
                        {{ link.text }}
                    </a>
                </div>
            </div>
        </div>

        <div class="header-main shadow-sm position-relative z-3 transition-all">
            <div class="container-inner d-flex align-items-center justify-content-between h-100 py-2 py-lg-0">
                
                <component :is="linkComponent" :to="config.logoLink || '/'" class="header-logo text-decoration-none flex-shrink-0">
                    <img v-if="config.logoUrl" 
                         :src="config.logoUrl" 
                         alt="Logo" 
                         class="logo-img transition-all"
                         :style="{ height: currentLogoHeight + 'px' }" />
                    <h2 v-else class="mb-0 fw-bold brand-text">Institución</h2>
                </component>

                <nav class="desktop-menu d-none d-lg-flex align-items-center gap-4">
                    <ul class="nav-list m-0 p-0 d-flex list-unstyled gap-4">
                        
                        <li v-for="item in menu" :key="item.id" class="nav-item position-relative group-hover">
                            <component :is="linkComponent" :to="item.url || '#'" class="nav-link text-uppercase fw-bold text-decoration-none py-4 d-flex align-items-center gap-1">
                                {{ item.title }}
                                <i v-if="item.children?.length" class="bi bi-chevron-down small"></i>
                            </component>
                            
                            <div v-if="item.children?.length" class="dropdown-menu shadow border-0 p-0 m-0 position-absolute rounded-0">
                                <ul class="list-unstyled m-0 p-0">
                                    <li v-for="child in item.children" :key="child.id" class="position-relative dropend-hover">
                                        
                                        <component :is="linkComponent" :to="child.url || '#'" class="dropdown-link d-flex justify-content-between align-items-center px-4 py-3 text-decoration-none border-bottom small fw-bold">
                                            {{ child.title }}
                                            <i v-if="child.children?.length" class="bi bi-chevron-right ms-2 small text-muted"></i>
                                        </component>

                                        <div v-if="child.children?.length" class="dropdown-submenu shadow border-0 p-0 m-0 position-absolute rounded-0">
                                            <ul class="list-unstyled m-0 p-0">
                                                <li v-for="grandchild in child.children" :key="grandchild.id">
                                                    <component :is="linkComponent" :to="grandchild.url || '#'" class="dropdown-link d-block px-4 py-3 text-decoration-none border-bottom small fw-bold">
                                                        {{ grandchild.title }}
                                                    </component>
                                                </li>
                                            </ul>
                                        </div>

                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>

                    <component :is="linkComponent" v-if="config.ctaText" :to="config.ctaUrl" class="btn btn-cta rounded-pill fw-bold px-4 py-2 d-flex align-items-center gap-2">
                        {{ config.ctaText }} <i :class="config.ctaIcon"></i>
                    </component>
                </nav>

                <button class="btn d-lg-none mobile-toggle p-1 border-0" @click="isMobileMenuOpen = !isMobileMenuOpen">
                    <i class="bi fs-1" :class="isMobileMenuOpen ? 'bi-x' : 'bi-list'"></i>
                </button>
            </div>
        </div>

        <div v-if="isMobileMenuOpen" class="mobile-menu d-lg-none shadow bg-white border-top position-absolute w-100 overflow-y-auto" style="max-height: 80vh; left: 0; top: 100%;">
            <div class="p-3">
                <component :is="linkComponent" v-if="config.ctaText" :to="config.ctaUrl" class="btn btn-cta w-100 rounded fw-bold mb-3 d-flex justify-content-center align-items-center gap-2">
                    {{ config.ctaText }} <i :class="config.ctaIcon"></i>
                </component>

                <ul class="list-unstyled m-0">
                    <li v-for="item in menu" :key="'mob-'+item.id" class="border-bottom">
                        <div class="d-flex align-items-center justify-content-between">
                            <component 
                                :is="linkComponent" 
                                :to="item.url || '#'" 
                                class="fw-bold text-decoration-none text-dark d-block p-3 flex-grow-1"
                                @click="handleMobileLinkClick(item)"
                            >
                                {{ item.title }}
                            </component>

                            <button 
                                v-if="item.children?.length" 
                                class="btn border-0 px-4 py-3 text-muted"
                                @click.stop="toggleSubMenu(item.id)"
                            >
                                <i class="bi fs-5" :class="isSubMenuOpen(item.id) ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                            </button>
                        </div>

                        <div v-if="item.children?.length" v-show="isSubMenuOpen(item.id)" class="mobile-submenu bg-light border-top">
                            <ul class="list-unstyled m-0">
                                <li v-for="child in item.children" :key="'mob-child-'+child.id" class="border-bottom">
                                    
                                    <div class="d-flex align-items-center justify-content-between">
                                        <component 
                                            :is="linkComponent" 
                                            :to="child.url || '#'" 
                                            class="d-block p-3 ps-4 text-decoration-none text-secondary small fw-bold flex-grow-1"
                                            @click="handleMobileLinkClick(child)"
                                        >
                                            {{ child.title }}
                                        </component>

                                        <button 
                                            v-if="child.children?.length" 
                                            class="btn border-0 px-4 py-3 text-muted"
                                            @click.stop="toggleSubMenu(child.id)"
                                        >
                                            <i class="bi fs-6" :class="isSubMenuOpen(child.id) ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                                        </button>
                                    </div>

                                    <div v-if="child.children?.length" v-show="isSubMenuOpen(child.id)" class="mobile-submenu bg-white">
                                        <ul class="list-unstyled m-0">
                                            <li v-for="grandchild in child.children" :key="'mob-grand-'+grandchild.id">
                                                <component 
                                                    :is="linkComponent" 
                                                    :to="grandchild.url || '#'" 
                                                    class="d-block py-2 pe-3 ps-5 text-decoration-none text-muted small border-bottom"
                                                    @click="isMobileMenuOpen = false"
                                                >
                                                    - {{ grandchild.title }}
                                                </component>
                                            </li>
                                        </ul>
                                    </div>

                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    config: { type: Object, default: () => ({}) },
    menu: { type: Array as () => any[], default: () => [] },
    linkComponent: { type: [Object, String], default: 'a' }
});

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const activeSubMenus = ref<any[]>([]);

const isSubMenuOpen = (id: any) => activeSubMenus.value.includes(id);

const toggleSubMenu = (id: any) => {
    const index = activeSubMenus.value.indexOf(id);
    if (index > -1) {
        activeSubMenus.value.splice(index, 1);
    } else {
        activeSubMenus.value.push(id);
    }
};

const handleMobileLinkClick = (item: any) => {
    if (!item.children?.length) {
        isMobileMenuOpen.value = false;
    }
};

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

const currentLogoHeight = computed(() => {
    return isScrolled.value ? (props.config.logoHeightScrolled || 40) : (props.config.logoHeight || 60);
});

const cssVars = computed(() => {
    const isOverlay = props.config.isTransparent && !isScrolled.value;
    return {
        '--top-bg': props.config.topBarBgColor || '#003366',
        '--top-text': props.config.topBarTextColor || '#ffffff',
        '--nav-bg': isOverlay ? 'transparent' : (props.config.navBgColor || '#ffffff'),
        '--nav-text': isOverlay ? (props.config.navTransparentTextColor || '#ffffff') : (props.config.navTextColor || '#333333'),
        '--nav-hover': props.config.navHoverColor || '#cc0033'
    };
});
</script>

<style scoped>
.classic-header {
    z-index: 1040;
    transition: background-color 0.3s;
}
.transition-all { transition: all 0.3s ease-in-out; }
.container-inner { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }

/* Desktop Dropdown Hover */
.nav-item { height: 100%; display: flex; align-items: center; }

.dropdown-menu {
    display: block; 
    top: 100%;
    left: 0;
    min-width: 240px;
    background-color: #ffffff;
    /*border-top: 3px solid var(--nav-hover) !important;*/
    opacity: 0;
    visibility: hidden;
    transform: translateY(15px);
    transition: all 0.25s ease-out;
    pointer-events: none;
    z-index: 1100;
}

/* Nivel 3 (Se abre hacia la derecha) */
.dropdown-submenu {
    display: block;
    top: 0; /* A la misma altura que su padre */
    left: 100%; /* A la derecha del menú Nivel 2 */
    min-width: 240px;
    background-color: #ffffff;
    border-left: 3px solid var(--nav-hover) !important;
    opacity: 0;
    visibility: hidden;
    transform: translateX(-15px);
    transition: all 0.25s ease-out;
    pointer-events: none;
    z-index: 1101;
}

/* Animaciones Hover */
.nav-item.group-hover:hover > .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
}

.dropend-hover:hover > .dropdown-submenu {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
    pointer-events: auto;
}

.nav-link {
    color: var(--nav-text);
    font-size: 0.9rem;
    white-space: nowrap;
}
.nav-item:hover .nav-link { color: var(--nav-hover); }

/* Estilos de links internos */
.dropdown-link { color: #333; transition: all 0.2s; background: #fff; }
.dropdown-link:hover { 
    color: var(--nav-hover); 
    background-color: #f8f9fa; 
    padding-left: 1.75rem !important; 
}

/* Mobile */
.mobile-menu {
    background: white;
    z-index: 2000;
    left: 0;
    top: 100%;
}
.mobile-submenu {
    overflow: hidden;
}

/* Top Bar */
.top-bar { background-color: var(--top-bg); color: var(--top-text); height: 35px; }
.header-main { background-color: var(--nav-bg); }
.btn-cta { background-color: var(--nav-hover); color: white; border: none; }
</style>