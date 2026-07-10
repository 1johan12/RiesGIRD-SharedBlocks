<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

// --- CONTRATO DE ENTRADA DEL PAGE BUILDER ---
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
    logoLink: props.config?.logoLink,
    logoHeight: props.config?.logoHeight || 65,
    logoHeightScrolled: props.config?.logoHeightScrolled || 48,
    sticky: props.config?.sticky ?? true,
    isTransparent: props.config?.isTransparent ?? true,
    showTopBar: props.config?.showTopBar ?? false,
    topBarBgColor: props.config?.topBarBgColor || '#db143c',
    topBarTextColor: props.config?.topBarTextColor || '#ffffff',
    navBgColor: props.config?.navBgColor || '#ffffff', 
    navTextColor: props.config?.navTextColor || '#1e293b',
    navTransparentTextColor: props.config?.navTransparentTextColor || '#ffffff',
    navHoverColor: props.config?.navHoverColor || '#db143c',
    socialLinks: props.config?.socialLinks || [],
    topLinks: props.config?.topLinks || [],
    ctaText: props.config?.ctaText || '',
    ctaUrl: props.config?.ctaUrl || '#',
    ctaIcon: props.config?.ctaIcon || ''
}));

const scrolled = ref(false);
const mobileMenuOpen = ref(false); 
const activeMobileSubmenus = ref<Record<string | number, boolean>>({});

const handleScroll = () => { scrolled.value = window.scrollY > 40; };
const handleResize = () => {
    if (window.innerWidth >= 992) {
        mobileMenuOpen.value = false;
        activeMobileSubmenus.value = {}; 
    }
};

const toggleMobileSubmenu = (itemId: string | number) => {
    activeMobileSubmenus.value[itemId] = !activeMobileSubmenus.value[itemId];
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
            <div class="top-container-wrapper">
                <div class="social-icons-wrapper">
                    <a v-for="(social, i) in safeConfig.socialLinks" :key="i" 
                       :href="social.url" class="social-icon-btn" 
                       :style="{ borderColor: 'rgba(255,255,255,0.2)', color: safeConfig.topBarTextColor }">
                        <i :class="social.icon"></i>
                    </a>
                </div>

                <div class="top-right-actions">
                    <div class="top-mini-links-box">
                        <a v-for="(link, i) in safeConfig.topLinks" :key="i" 
                           :href="link.url" class="top-mini-link" 
                           :style="{ color: safeConfig.topBarTextColor }">
                            {{ link.text }} <i v-if="link.hasChild" class="bi bi-chevron-down mini-arrow"></i>
                        </a>
                    </div>
                    <a v-if="safeConfig.ctaText" :href="safeConfig.ctaUrl" 
                       class="top-cta-btn" :style="{ backgroundColor: 'rgba(255,255,255,0.18)', color: safeConfig.topBarTextColor }">
                        <span class="cta-desktop-text">{{ safeConfig.ctaText }}</span>
                        <span class="cta-mobile-text">Portal</span>
                        <i :class="[safeConfig.ctaIcon, 'ms-1.5']" v-if="safeConfig.ctaIcon"></i>
                    </a>
                </div>
            </div>
        </div>

        <header class="navbar-main transition-all" :class="{ 'scrolled-nav': scrolled }">
            <div class="navbar-container-wrapper">
                
                <component :is="linkTag" v-bind="getLinkProps(safeConfig.logoLink || '/')" class="logo-box z-index-top">
                    <img v-if="safeConfig.logoUrl" :src="safeConfig.logoUrl" 
                         :style="{ height: (scrolled ? safeConfig.logoHeightScrolled : safeConfig.logoHeight) + 'px' }" 
                         class="transition-all logo-img" alt="Logo">
                    <span v-else class="fw-bold branding-text">LOGO</span>
                </component>

                <nav class="d-none d-lg-block nav-left-aligned-wrapper">
                    <ul class="main-menu">
                        <li v-for="item in menu" :key="item.id" class="menu-item-1">
                            
                            <component :is="linkTag" v-bind="getLinkProps(item.url)" class="main-menu-link">
                                {{ item.title }}
                                <i v-if="item.children?.length" class="bi bi-chevron-down menu-arrow-down"></i>
                            </component>

                            <ul v-if="item.children?.length" class="dropdown-level-2 shadow-lg">
                                <li v-for="child in item.children" :key="child.id" class="menu-item-2">
                                    
                                    <component :is="linkTag" v-bind="getLinkProps(child.url)" class="submenu-link-l2">
                                        <span>{{ child.title }}</span>
                                        <i v-if="child.children?.length" class="bi bi-chevron-right sub-arrow-right"></i>
                                    </component>
                                    
                                    <ul v-if="child.children?.length" class="dropdown-level-3 shadow-lg">
                                        <li v-for="subChild in child.children" :key="subChild.id" class="menu-item-3">
                                            <component :is="linkTag" v-bind="getLinkProps(subChild.url)" class="submenu-link-l3">
                                                {{ subChild.title }}
                                            </component>
                                        </li>
                                    </ul>

                                </li>
                            </ul>

                        </li>
                    </ul>
                </nav>

                <button class="d-lg-none mobile-toggle-btn z-index-top" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menu">
                    <i class="bi" :class="mobileMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
                </button>
            </div>
        </header>

        <div class="mobile-menu-wrapper d-lg-none" :class="{ 'is-open': mobileMenuOpen }">
            <div class="mobile-menu-inner"> 
                <ul class="mobile-main-list">
                    <li v-for="item in menu" :key="item.id" class="mobile-item">
                        
                        <div class="mobile-nav-flex-row">
                            <component :is="linkTag" v-bind="getLinkProps(item.url)" class="mobile-link" @click="mobileMenuOpen = false">
                                {{ item.title }}
                            </component>
                            <button v-if="item.children?.length" class="mobile-expand-sub-btn" @click.stop="toggleMobileSubmenu(item.id)">
                                <i class="bi bi-chevron-down transition-all" :class="{ 'rotate-180': activeMobileSubmenus[item.id] }"></i>
                            </button>
                        </div>
                        
                        <div class="mobile-submenu-collapse" :class="{ 'show': activeMobileSubmenus[item.id] }">
                            <ul class="mobile-submenu-list">
                                <li v-for="child in item.children" :key="child.id" class="mobile-nested-item">
                                    
                                    <div class="mobile-nav-flex-row">
                                        <component :is="linkTag" v-bind="getLinkProps(child.url)" class="mobile-submenu-link" @click="mobileMenuOpen = false">
                                            {{ child.title }}
                                        </component>
                                        <button v-if="child.children?.length" class="mobile-expand-sub-btn" @click.stop="toggleMobileSubmenu('sub-' + child.id)">
                                            <i class="bi bi-chevron-down transition-all" :class="{ 'rotate-180': activeMobileSubmenus['sub-' + child.id] }"></i>
                                        </button>
                                    </div>

                                    <div class="mobile-submenu-collapse" :class="{ 'show': activeMobileSubmenus['sub-' + child.id] }">
                                        <ul class="mobile-sub-submenu-list">
                                            <li v-for="subChild in child.children" :key="subChild.id" class="mobile-sub-nested-item">
                                                <component :is="linkTag" v-bind="getLinkProps(subChild.url)" class="mobile-sub-submenu-link" @click="mobileMenuOpen = false">
                                                    {{ subChild.title }}
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
    </div>
</template>

<style scoped>
/* =========================================================================
   🎨 MAQUETACIÓN PREMIUM EN CASCADA COMPLETA (DISEÑO BLINDADO 1:1)
   ========================================================================= */

.header-master {
  width: 100%; z-index: 1050; position: relative;
  font-family: system-ui, -apple-system, sans-serif; box-sizing: border-box;
}
.is-sticky {
  position: fixed; top: 0; left: 0; width: 100%; background-color: var(--nav-bg);
  box-shadow: 0 10px 35px rgba(15, 23, 42, 0.06); animation: navSlideDown 0.3s ease forwards;
}
.is-transparent:not(.is-sticky) { position: absolute; top: 0; left: 0; }
@keyframes navSlideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }

/* TOP BAR */
.top-bar-container { height: 38px; font-size: 0.76rem; font-weight: 600; display: flex; align-items: center; }
.is-sticky .top-bar-container { height: 0; overflow: hidden; }
.top-container-wrapper { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box; }
.social-icons-wrapper { display: flex; gap: 8px; }
.social-icon-btn { width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid; border-radius: 50%; text-decoration: none; }
.top-right-actions { display: flex; align-items: center; gap: 24px; }
.top-mini-links-box { display: flex; gap: 20px; }
.top-mini-link { text-decoration: none; opacity: 0.9; display: flex; align-items: center; gap: 4px; }
.mini-arrow { font-size: 0.65rem; }
.top-cta-btn { padding: 5px 14px; border-radius: 6px; text-decoration: none; font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: flex; align-items: center; }

/* NAVBAR CONTENEDOR MÁSTER */
.navbar-main { padding: 1.1rem 0; background-color: var(--nav-bg); position: relative; z-index: 1060; transition: padding 0.2s; }
.is-transparent:not(.is-sticky) .navbar-main { background-color: transparent !important; border-bottom: 1px solid rgba(255,255,255,0.12); }
.scrolled-nav { padding: 0.65rem 0; }

/* 🎯 CORREGIDO: JUSTIFY CONTENT EN FLEX-START PARA QUE LA NAVEGACIÓN CORRA FLUIDA A LA IZQUIERDA */
.navbar-container-wrapper { 
  width: 100%; 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 0 24px; 
  display: flex; 
  justify-content: flex-start; 
  align-items: center; 
  position: relative; 
  box-sizing: border-box; 
}

.logo-box { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; }
.logo-img { display: block; object-fit: contain; transition: height 0.2s; }
.branding-text { color: var(--nav-text); font-size: 1.5rem; font-weight: 800; }
.is-transparent:not(.is-sticky) .branding-text { color: var(--nav-text-trans); }

/* 🎯 CORREGIDO: ADIÓS POSICIONAMIENTO ABSOLUTO. AHORA EMPIEZA JUSTO DESPUÉS DEL LOGO CON MARGIN */
.nav-left-aligned-wrapper { 
  position: relative;
  margin-left: 3.5rem; /* El espaciado exacto para separar las pestañas del Logotipo */
  flex-grow: 1;
}

.main-menu { display: flex; list-style: none; margin: 0; padding: 0; gap: 2.2rem; }

/* Nivel 1 */
.menu-item-1 { position: relative; padding: 14px 0; list-style: none; }
.main-menu-link {
  color: var(--nav-text); text-decoration: none; font-size: 0.88rem;
  font-weight: 700; transition: color 0.2s; display: flex; align-items: center; gap: 5px; text-transform: uppercase;
}
.is-transparent:not(.is-sticky) .main-menu-link { color: var(--nav-text-trans); }
.is-transparent:not(.is-sticky) .menu-item-1:hover .main-menu-link { color: var(--nav-hover); }

.menu-arrow-down { font-size: 0.7rem; transition: transform 0.2s; }
.menu-item-1:hover .menu-arrow-down { transform: rotate(180deg); color: var(--nav-hover); }
.menu-item-1:hover .main-menu-link { color: var(--nav-hover); }

/* DROPDOWN NIVEL 2 */
.menu-item-1 ul, .menu-item-1 li { list-style: none; margin: 0; padding: 0; }

.dropdown-level-2 {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
  min-width: 250px;
  border-radius: 12px;
  padding: 8px 0;
  display: none; 
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.1);
  border: 1px solid #e2e8f0;
  border-top: 4px solid var(--nav-hover); 
  z-index: 2000;
}

.menu-item-2 { position: relative; width: 100%; }

.submenu-link-l2 {
  display: flex; align-items: center; justify-content: space-between;
  padding: 11px 20px; color: #334155; text-decoration: none; font-size: 0.86rem; font-weight: 600; transition: all 0.2s ease;
}
.sub-arrow-right { font-size: 0.75rem; color: #94a3b8; transition: color 0.2s; }

/* Disparadores Hovers */
.menu-item-1:hover > .dropdown-level-2 { display: block; animation: navFadeIn 0.2s ease-out forwards; }
.menu-item-2:hover > .dropdown-level-3 { display: block; animation: navFadeIn 0.2s ease-out forwards; }

.menu-item-2:hover > .submenu-link-l2 { color: var(--nav-hover); background-color: #f8fafc; }
.menu-item-2:hover .sub-arrow-right { color: var(--nav-hover); }

/* DROPDOWN NIVEL 3 (FLYOUT) */
.dropdown-level-3 {
  position: absolute; top: -8px; left: 100%; background-color: #ffffff; min-width: 250px;
  border-radius: 12px; padding: 8px 0; display: none; box-shadow: 0 15px 35px rgba(15, 23, 42, 0.1);
  border: 1px solid #e2e8f0; border-left: 4px solid var(--nav-hover); z-index: 2010;
}
.dropdown-level-3::before { content: ''; position: absolute; top: 0; left: -15px; width: 15px; height: 100%; background: transparent; }

.submenu-link-l3 { display: block; padding: 11px 20px; color: #475569; text-decoration: none; font-size: 0.85rem; font-weight: 500; transition: all 0.18s; text-align: left; }
.submenu-link-l3:hover { color: var(--nav-hover); background-color: #f8fafc; padding-left: 24px; }

@keyframes navFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* RESPONSIVE MÓVIL (🎯 EL BOTÓN Hamburguesa SE EMPUJA AL FINAL CON MARGIN-LEFT AUTO) */
.mobile-toggle-btn { 
  background: transparent; 
  border: none; 
  font-size: 1.8rem; 
  color: var(--nav-text); 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  margin-left: auto; /* Empuja el gatillo móvil al extremo derecho en responsive */
}
.is-transparent:not(.is-sticky) .mobile-toggle-btn { color: var(--nav-text-trans); }

.mobile-menu-wrapper { position: absolute; top: 100%; left: 0; width: 100%; background-color: #ffffff; box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08); max-height: 0; overflow: hidden; transition: max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1); z-index: 1050; }
.mobile-menu-wrapper.is-open { max-height: 85vh; overflow-y: auto; border-top: 1px solid #f1f5f9; }
.mobile-menu-inner { padding: 10px 24px 30px 24px; box-sizing: border-box; }
.mobile-main-list { list-style: none; padding: 0; margin: 0; }
.mobile-item { border-bottom: 1px solid #f1f5f9; list-style: none; }
.mobile-nav-flex-row { display: flex; justify-content: space-between; align-items: center; width: 100%; }

.mobile-link { display: block; padding: 14px 0; color: #1e293b; text-decoration: none; font-weight: 700; text-transform: uppercase; font-size: 0.88rem; flex-grow: 1; text-align: left; }
.mobile-expand-sub-btn { background: none; border: none; padding: 10px; color: #64748b; cursor: pointer; display: flex; align-items: center; }

.mobile-submenu-collapse { max-height: 0; overflow: hidden; transition: max-height 0.25s ease-out; }
.mobile-submenu-collapse.show { max-height: 1500px; transition: max-height 0.5s ease-in; }
.rotate-180 { transform: rotate(180deg); }

.mobile-submenu-list { list-style: none; padding: 0 0 0 1rem; margin: 4px 0 12px 0; border-left: 2px solid #e2e8f0; }
.mobile-nested-item { list-style: none; }
.mobile-submenu-link { display: block; padding: 10px 0; color: #334155; text-decoration: none; font-size: 0.86rem; font-weight: 700; flex-grow: 1; text-align: left; }

.mobile-sub-submenu-list { list-style: none; padding: 0 0 0 1rem; margin: 4px 0 8px 0; border-left: 2px solid #cbd5e1; }
.mobile-sub-nested-item { list-style: none; }
.mobile-sub-submenu-link { display: block; padding: 8px 0; color: #64748b; text-decoration: none; font-size: 0.82rem; font-weight: 500; text-align: left; }

.mobile-submenu-link:hover, .mobile-sub-submenu-link:hover, .mobile-link:hover { color: var(--nav-hover); }
.z-index-top { position: relative; z-index: 1070; }
.transition-all { transition: all 0.2s ease; }

@media (max-width: 640px) {
  .cta-desktop-text { display: none; }
  .cta-mobile-text { display: inline; }
  .top-mini-links-box { display: none; }
}
</style>