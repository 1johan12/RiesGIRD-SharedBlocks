<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{ 
    config: any, 
    menu: any[],
    linkComponent?: any 
}>();

const linkTag = computed(() => props.linkComponent || 'a');
const getLinkProps = (url: string | null) => {
    const finalUrl = url || '#';
    return linkTag.value === 'a' ? { href: finalUrl } : { to: finalUrl };
};


const safeConfig = computed(() => ({
    logoUrl: props.config?.logoUrl || '',
    logoHeight: props.config?.logoHeight || 65,
    logoHeightScrolled: props.config?.logoHeightScrolled || 45,
    sticky: props.config?.sticky ?? true,
    isTransparent: props.config?.isTransparent ?? true,
    showTopBar: props.config?.showTopBar ?? false,
    topBarBgColor: props.config?.topBarBgColor || '#cc0033',
    topBarTextColor: props.config?.topBarTextColor || '#ffffff',
    
    
    navBgColor: props.config?.navBgColor || '#ffffff', 
    navTextColor: props.config?.navTextColor || '#333333',
    navTransparentTextColor: props.config?.navTransparentTextColor || '#ffffff',
    navHoverColor: props.config?.navHoverColor || '#cc0033',

    socialLinks: props.config?.socialLinks || [],
    topLinks: props.config?.topLinks || [],
    ctaText: props.config?.ctaText || '',
    ctaUrl: props.config?.ctaUrl || '#',
    ctaIcon: props.config?.ctaIcon || ''
}));

const scrolled = ref(false);
const mobileMenuOpen = ref(false); 

const handleScroll = () => { 
    scrolled.value = window.scrollY > 50; 
};


const handleResize = () => {
    if (window.innerWidth >= 992) mobileMenuOpen.value = false;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
});
</script>

<template>
    <div 
        class="header-master" 
        :class="{ 
            'is-sticky': safeConfig.sticky && scrolled, 
            'is-transparent': safeConfig.isTransparent && !scrolled 
        }"
        :style="{
            '--nav-bg': safeConfig.navBgColor,
            '--nav-text': safeConfig.navTextColor,
            '--nav-text-trans': safeConfig.navTransparentTextColor,
            '--nav-hover': safeConfig.navHoverColor
        }"
    >
        <div 
            v-if="safeConfig.showTopBar && (safeConfig.socialLinks.length || safeConfig.topLinks.length || safeConfig.ctaText)" 
            class="top-bar-container transition-all"
            :style="{ backgroundColor: safeConfig.topBarBgColor, color: safeConfig.topBarTextColor }"
        >
            <div class="container d-flex justify-content-between align-items-center h-100">
                <div class="d-flex gap-2">
                    <a v-for="(social, i) in safeConfig.socialLinks" :key="i" 
                       :href="social.url" class="social-icon-btn" 
                       :style="{ borderColor: safeConfig.topBarTextColor + '44', color: safeConfig.topBarTextColor }">
                        <i :class="social.icon"></i>
                    </a>
                </div>

                <div class="d-flex align-items-center gap-3 gap-lg-4">
                    <div class="d-none d-lg-flex gap-3">
                        <a v-for="(link, i) in safeConfig.topLinks" :key="i" 
                           :href="link.url" class="top-mini-link" 
                           :style="{ color: safeConfig.topBarTextColor }">
                            {{ link.text }} <i v-if="link.hasChild" class="las la-angle-down small"></i>
                        </a>
                    </div>
                    <a v-if="safeConfig.ctaText" :href="safeConfig.ctaUrl" 
                       class="top-cta-btn" :style="{ backgroundColor: 'rgba(255,255,255,0.2)', color: safeConfig.topBarTextColor }">
                        <span class="d-none d-sm-inline">{{ safeConfig.ctaText }}</span>
                        <span class="d-inline d-sm-none">Portal</span>
                        <i :class="safeConfig.ctaIcon"></i>
                    </a>
                </div>
            </div>
        </div>

        <header class="navbar-main transition-all" :class="{ 'scrolled-nav': scrolled }">
            <div class="container d-flex justify-content-between align-items-center relative">
                
                <component :is="linkTag" v-bind="getLinkProps('/')" class="logo-box z-index-top">
                    <img v-if="safeConfig.logoUrl" :src="safeConfig.logoUrl" 
                         :style="{ height: (scrolled ? safeConfig.logoHeightScrolled : safeConfig.logoHeight) + 'px' }" 
                         class="transition-all object-fit-contain">
                    <span v-else class="fw-bold fs-4" style="color: var(--nav-text);">LOGO</span>
                </component>

                <nav class="d-none d-lg-block">
                    <ul class="main-menu">
                        <li v-for="item in menu" :key="item.id" class="menu-item-wrapper">
                            <component :is="linkTag" v-bind="getLinkProps(item.url)" class="main-menu-link">
                                {{ item.title }}
                                <i v-if="item.children?.length" class="las la-angle-down ms-1"></i>
                            </component>

                            <ul v-if="item.children?.length" class="submenu-dropdown shadow">
                                <li v-for="child in item.children" :key="child.id">
                                    <component :is="linkTag" v-bind="getLinkProps(child.url)" class="submenu-link">
                                        {{ child.title }}
                                    </component>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>

                <button class="d-lg-none mobile-toggle-btn z-index-top" @click="mobileMenuOpen = !mobileMenuOpen">
                    <i class="las" :class="mobileMenuOpen ? 'la-times' : 'la-bars'"></i>
                </button>
            </div>
        </header>

        <div class="mobile-menu-wrapper d-lg-none" :class="{ 'is-open': mobileMenuOpen }">
            <div class="container mobile-menu-inner"> <ul class="mobile-menu-list">
                    <li v-for="item in menu" :key="item.id" class="mobile-item">
                        <component :is="linkTag" v-bind="getLinkProps(item.url)" class="mobile-link" @click="mobileMenuOpen = false">
                            {{ item.title }}
                        </component>
                        
                        <ul v-if="item.children?.length" class="mobile-submenu-list">
                            <li v-for="child in item.children" :key="child.id">
                                <component :is="linkTag" v-bind="getLinkProps(child.url)" class="mobile-submenu-link" @click="mobileMenuOpen = false">
                                    - {{ child.title }}
                                </component>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<style scoped>
/* VARIABLES Y ESTRUCTURA BASE */
.header-master {
    width: 100%;
    z-index: 1050;
    transition: all 0.4s ease;
    position: relative;
}

.is-sticky {
    position: fixed;
    top: 0;
    left: 0;
    animation: slideDown 0.4s ease forwards;
}

.is-transparent:not(.is-sticky) {
    position: absolute;
    top: 0;
}

@keyframes slideDown {
    from { transform: translateY(-100%); }
    to { transform: translateY(0); }
}

/* TOP BAR */
.top-bar-container {
    height: 40px;
    font-size: 0.75rem;
    font-weight: 600;
}
.is-sticky .top-bar-container { height: 0; overflow: hidden; }

.social-icon-btn {
    width: 24px; height: 24px;
    display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid; border-radius: 50%;
    text-decoration: none; transition: all 0.2s;
}
.top-mini-link { text-decoration: none; opacity: 0.8; }
.top-mini-link:hover { opacity: 1; }
.top-cta-btn {
    padding: 4px 12px; border-radius: 20px;
    text-decoration: none; font-size: 0.7rem; text-transform: uppercase;
}

/* NAVBAR MAIN */
.navbar-main {
    padding: 1rem 0;
    background-color: var(--nav-bg); 
    position: relative;
    z-index: 1060; /* Sobre el menú móvil */
}

.is-transparent:not(.is-sticky) .navbar-main {
    background-color: transparent !important;
    border-bottom: 1px solid rgba(255,255,255,0.15); /* Opcional: línea divisoria */
}

.scrolled-nav {
    padding: 0.5rem 0;
    background-color: var(--nav-bg); /* O rgba con blur si lo prefieres */
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.z-index-top { position: relative; z-index: 1070; }

/* MENÚ DESKTOP */
.main-menu {
    display: flex; list-style: none; margin: 0; padding: 0; gap: 1.5rem;
}

.main-menu-link {
    color: var(--nav-text); /* Color normal */
    text-decoration: none; text-transform: uppercase;
    font-size: 0.8rem; font-weight: 700; transition: color 0.3s;
}

/* Magia del color transparente */
.is-transparent:not(.is-sticky) .main-menu-link,
.is-transparent:not(.is-sticky) .mobile-toggle-btn {
    color: var(--nav-text-trans);
}

.main-menu-link:hover { color: var(--nav-hover); }

/* DROPDOWN DESKTOP */
.menu-item-wrapper { position: relative; padding: 10px 0; }
.submenu-dropdown {
    position: absolute; top: 100%; left: 0;
    background: var(--nav-bg); min-width: 220px;
    list-style: none; padding: 10px 0; display: none;
    border-top: 3px solid var(--nav-hover); border-radius: 0 0 8px 8px;
}
.menu-item-wrapper:hover .submenu-dropdown { display: block; animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity:0; transform: translateY(5px); } to { opacity:1; transform: translateY(0); } }

.submenu-link {
    display: block; padding: 8px 20px;
    color: var(--nav-text); text-decoration: none; font-size: 0.8rem;
}
.submenu-link:hover { background: #f8f9fa; color: var(--nav-hover); padding-left: 25px; transition: all 0.2s;}

/* ================================= */
/* RESPONSIVO: BOTÓN Y MENÚ MÓVIL    */
/* ================================= */

.mobile-toggle-btn {
    background: transparent; border: none;
    font-size: 1.8rem; color: var(--nav-text); cursor: pointer;
    transition: color 0.3s; padding: 0;
}

.mobile-menu-wrapper {
    position: absolute;
    top: 100%; /* Justo debajo del navbar */
    left: 0;
    width: 100%;
    background-color: var(--nav-bg);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    z-index: 1050;
}

.mobile-menu-wrapper.is-open {
    max-height: 100vh; /* Permite que el menú se despliegue */
    overflow-y: auto;
}

.mobile-menu-inner { padding: 1rem 1.5rem 2rem 1.5rem; }

.mobile-menu-list { list-style: none; padding: 0; margin: 0; }

.mobile-item { border-bottom: 1px solid rgba(0,0,0,0.05); }

.mobile-link {
    display: block; padding: 12px 0;
    color: var(--nav-text); text-decoration: none;
    font-weight: 700; text-transform: uppercase; font-size: 0.9rem;
}

.mobile-submenu-list { list-style: none; padding-left: 1rem; margin-bottom: 10px;}
.mobile-submenu-link {
    display: block; padding: 8px 0;
    color: var(--nav-text); opacity: 0.8; text-decoration: none; font-size: 0.85rem;
}
.mobile-submenu-link:hover, .mobile-link:hover { color: var(--nav-hover); }

.transition-all { transition: all 0.3s ease; }
</style>