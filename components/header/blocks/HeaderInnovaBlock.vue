<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { formatImageUrl } from '../../../helpers/url';


interface InnovaData {
  logoUrl?: string;
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  navLinks?: Array<{ id: string | number, label: string, url: string }>;
  topLinks?: Array<{ label: string, url: string }>;
  socialLinks?: Array<{ icon: string, url: string }>;
  primaryColor?: string;
  waveColor?: string;
  bannerOverlay?: string;
}

const props = defineProps<{
  data: InnovaData;
}>();


const safeData = computed(() => {
  const d = props.data || {};
  return {
    logoUrl: d.logoUrl || '/imagenes/logoInnova.png',
    heroImage: d.heroImage || '/imagenes/slider01.png',
    heroTitle: d.heroTitle || 'INNOVA ESAN',
    heroSubtitle: d.heroSubtitle || 'THE BUSINESS CHALLENGE',
    
    navLinks: d.navLinks?.length ? d.navLinks : [
      { id: 1, label: 'Time Line', url: '#timeline' },
      { id: 2, label: 'The Business Challenge', url: '#business' },
      { id: 3, label: 'Postula', url: '#postula' },
      { id: 4, label: 'Premios', url: '#premios' },
      { id: 5, label: 'Venture Lab', url: '#venture' },
      { id: 6, label: 'Visítanos', url: '#visitanos' },
      { id: 7, label: 'Programas', url: '#programas' }
    ],
    
    topLinks: d.topLinks?.length ? d.topLinks : [
      { label: 'esan university', url: '#' },
      { label: 'esan school of business', url: '#' },
      { label: 'esan school of government', url: '#' },
      { label: 'fablab', url: '#' }
    ],
    
    socialLinks: d.socialLinks?.length ? d.socialLinks : [
      /*{ icon: 'fa-brands fa-linkedin-in', url: '#' },
      { icon: 'fa-brands fa-instagram', url: '#' }*/
    ],
    
    primaryColor: d.primaryColor || '#ff8121',
    waveColor: d.waveColor || '#ffffff',
    bannerOverlay: d.bannerOverlay || 'linear-gradient(101deg, rgba(33, 118, 255, 0.85) 0%, rgba(33, 118, 255, 0.30) 45%, rgba(255, 129, 33, 0.40) 70%, rgba(255, 129, 33, 0.85) 100%)'
  };
});


const isMenuOpen = ref(false);
const isSticky = ref(false);


const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value;
const handleScroll = () => isSticky.value = window.scrollY > 50;

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<template>
  <header class="app-header">
    
    <section class="enlaceDirecto">
      <ul class="enlaceDirecto__redes">
        <li v-for="(social, index) in safeData.socialLinks" :key="'social-'+index">
          <a :href="social.url" target="_blank">
            <i :class="social.icon"></i>
          </a>
        </li>
      </ul>
      
      <ul class="enlaceDirecto__nav">
        <li v-for="(link, index) in safeData.topLinks" :key="'top-'+index">
          <a :href="link.url" target="_blank">{{ link.label }}</a>
        </li>
      </ul>      
      
      <ul class="enlaceDirecto__sitios">
        <!--<li><a href="#"><img src="/imagenes/iconPeru.png" alt="Perú" style="height: 14px;"></a></li>
        <li><a href="#"><img src="/imagenes/iconEstadosUnidos.png" alt="USA" style="height: 14px;"></a></li>--> 
      </ul>       
    </section>

    <section class="bannerBloque">
      
      <section :class="['menuBloque', { 'menuBloque--fijo': isSticky }]">
        <div class="menuBloque__logo">
          <a href="#"><img :src="formatImageUrl(safeData.logoUrl)" alt="Logo Principal"></a>
          <i class="fa-solid fa-bars" @click="toggleMenu"></i>
        </div>
        
       <nav :class="['menuPrincipal', { 'menuPrincipal--open': isMenuOpen }]">
  <ul class="menuPrincipal__n1">
    <li v-for="nav in safeData.navLinks" :key="nav.id">
      <a :href="nav.url" @click="isMenuOpen = false">{{ nav.label }}</a>
    </li>
  </ul>
</nav>
      </section>

      <section class="sliderBloque">
        <img class="slide__img" :src="formatImageUrl(safeData.heroImage)" alt="Fondo Hero">
        <div class="slide__overlay"></div> 
        <article class="slide__informacion">
          <h1 class="slide__titulo">
            <span class="font-regular">{{ safeData.heroTitle }}</span><br>
            <span class="font-bold">{{ safeData.heroSubtitle }}</span>
          </h1>                  
        </article>              
      </section>        
    </section>

    <div class="ondaBanner">
      <svg viewBox="0 0 500 150" preserveAspectRatio="none">
        <path d="M-1.97,77.47 C268.90,263.00 246.32,-30.08 502.54,100.17 L500.00,150.00 L0.00,150.00 Z"></path>
      </svg>
    </div>
  </header>
</template>

<style scoped lang="scss">
/* --- CONFIGURACIÓN DE VARIABLES DINÁMICAS --- */


$color-primario: var(--global-primary, v-bind('safeData.primaryColor'));
$fuente-principal: var(--global-font, 'Arial, Helvetica, sans-serif');


$color-onda: v-bind('safeData.waveColor');
$overlay-fondo: v-bind('safeData.bannerOverlay');
$blanco: #ffffff;
$oscuro: #2b2b2b; 
$transicion: 0.3s ease-in-out;

.app-header {
  position: relative;
  width: 100%;
  font-family: $fuente-principal; 
}

/* --- TOP BAR (Barra superior oscura) --- */
.enlaceDirecto {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 5%;
  background-color: $oscuro;
  color: $blanco;
  
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 15px;
  }

  a { 
    text-decoration: none; 
    color: $blanco; 
    text-transform: uppercase; 
    font-size: 11px; 
    font-weight: 600;
    letter-spacing: 0.5px;
    transition: color 0.2s;

    &:hover { color: $color-primario; }
  }

  .enlaceDirecto__redes {
    flex: 1;
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border: 1px solid rgba(255,255,255,0.5);
      border-radius: 50%;
      font-size: 10px;
      &:hover { 
        border-color: $color-primario; 
        color: $color-primario;
      }
    }
  }

  .enlaceDirecto__nav {
    flex: 2;
    justify-content: center;
    
    li {
      display: flex;
      align-items: center;
      &:not(:last-child)::after {
        content: '|';
        color: rgba(255,255,255,0.4);
        margin-left: 15px;
        font-size: 10px;
      }
    }
  }

  .enlaceDirecto__sitios {
    flex: 1;
    justify-content: flex-end;
  }

  @media (max-width: 991px) {
    flex-flow: column;
    gap: 15px;
    padding: 15px;
    .enlaceDirecto__redes { order: 3; justify-content: center; }
    .enlaceDirecto__nav { order: 2; flex-wrap: wrap; text-align: center; }
    .enlaceDirecto__sitios { order: 1; justify-content: center; }
  }
}

/* --- HERO BANNER --- */
.bannerBloque {
  position: relative;
  height: 550px;
  
  .sliderBloque {
    height: 100%;
    position: relative;
    overflow: hidden;

    .slide__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }

    .slide__overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: $overlay-fondo;
      z-index: 2;
    }

    .slide__informacion {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 8%;
      z-index: 3;
    }

    .slide__titulo {
      color: $blanco;
      text-transform: uppercase;
      line-height: 1.1;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      
      .font-regular { 
        font-weight: 400; 
        font-size: 3rem; 
      }
      .font-bold { 
        font-weight: 800; 
        font-size: 3.5rem; 
      }
      
      @media (max-width: 768px) {
        .font-regular { font-size: 2rem; }
        .font-bold { font-size: 2.2rem; }
      }
    }
  }

  /* --- MENÚ NAVEGACIÓN --- */
  .menuBloque {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 8%;
    z-index: 10;
    transition: all $transicion;

    &--fijo {
      position: fixed;
      background: rgba(43, 43, 43, 0.95);
      backdrop-filter: blur(5px);
      padding: 10px 8%;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      border-bottom: 2px solid $color-primario; 
      
      .menuBloque__logo img { width: 140px; }
    }

    .menuBloque__logo {
      display: flex;
      align-items: center;
      img { width: 180px; transition: width $transicion; }
      .fa-solid { 
        display: none; 
        font-size: 28px; 
        color: $blanco; 
        cursor: pointer; 
        margin-left: 20px;
      }
    }
  }

  .menuPrincipal {
    &__n1 {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 25px;
      
      a {
        color: $blanco;
        text-decoration: none;
        font-weight: 600;
        font-size: 13px;
        transition: color $transicion;
        text-transform: uppercase;
        
        &:hover { color: $color-primario; } 
      }
    }
  }

  @media (max-width: 991px) {
    .menuBloque {
      padding: 15px 5%;
      background: rgba(43, 43, 43, 0.95);
      flex-direction: column;

      .menuBloque__logo {
        width: 100%;
        justify-content: space-between;
        .fa-solid { display: block; }
      }
    }

    .menuPrincipal {
      width: 100%;
      max-height: 0;
      overflow: hidden;
      transition: max-height $transicion;

      &--open {
        max-height: 400px;
        padding-top: 15px;
      }

      &__n1 {
        flex-direction: column;
        gap: 0;
        a {
          display: block;
          padding: 12px 0;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
      }
    }
  }
}

/* --- ONDA INFERIOR --- */
.ondaBanner {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 90px;
  overflow: hidden;
  line-height: 0;
  z-index: 5;

  svg {
    height: 100%;
    width: 100%;
    path {
      stroke: none;
      fill: $color-onda; 
    }
  }
  
  @media (max-width: 768px) { height: 40px; }
}
</style>