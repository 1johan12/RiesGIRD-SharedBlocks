<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  data?: any
}>();

const isMenuOpen = ref(false);
const isScrolled = ref(false); 

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});


const logoUrl = computed(() => props.data?.logoUrl || '#');
const menuItems = computed(() => props.data?.menuItems || []);

const currentLogoDesktop = computed(() => {
  if (isScrolled.value && props.data?.logoDesktopScrolled) return props.data.logoDesktopScrolled;
  return props.data?.logoDesktop || '';
});

const currentLogoMobile = computed(() => {
  if (isScrolled.value && props.data?.logoMobileScrolled) return props.data.logoMobileScrolled;
  return props.data?.logoMobile || currentLogoDesktop.value;
});

const currentTextColor = computed(() => {
  return isScrolled.value 
    ? (props.data?.textColorScrolled || '#000000') 
    : (props.data?.textColor || '#ffffff');
});

const initialBgStyle = computed(() => {
  const color = props.data?.bgColor || '#000000';
  const opacity = props.data?.bgOpacity ?? 0;
  return `rgba(${hexToRgb(color)}, ${opacity})`;
});

const scrolledBgStyle = computed(() => {
  const color = props.data?.bgColorScrolled || '#ffffff';
  const opacity = props.data?.bgOpacityScrolled ?? 1;
  return `rgba(${hexToRgb(color)}, ${opacity})`;
});

const currentBgColor = computed(() => isScrolled.value ? scrolledBgStyle.value : initialBgStyle.value);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

function hexToRgb(hex: string) {
  let c: any;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length== 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return [(c>>16)&255, (c>>8)&255, c&255].join(',');
  }
  return '0,0,0'; 
}
</script>

<template>
  <header 
    id="sp-header" 
    class="header-sticky" 
    :class="{ 'is-scrolled': isScrolled }"
    :style="{ backgroundColor: currentBgColor }"
  >
    <div class="container-fluid px-lg-5"> <div class="container-inner">
        <div class="row align-items-center" style="position: relative;">
          
          <div id="sp-logo" class="col-6 col-lg-3 py-3">
            <div class="sp-column">
              <div class="logo">
                <a :href="logoUrl" target="_blank" rel="noopener noreferrer" class="d-inline-block">
                  <img v-if="currentLogoDesktop" :src="currentLogoDesktop" alt="Logo Desktop" class="logo-image d-none d-lg-inline-block">
                  <img v-if="currentLogoMobile || currentLogoDesktop" :src="currentLogoMobile || currentLogoDesktop" alt="Logo Mobile" class="logo-image-phone d-inline-block d-lg-none">
                  <h3 v-if="!currentLogoDesktop && !currentLogoMobile" :style="{ color: currentTextColor }" class="m-0 fw-bold">MI LOGO</h3>
                </a>
              </div>
            </div>
          </div>

          <div id="sp-menu" class="col-6 col-lg-9 position-static">
            <div class="sp-column h-100 d-flex justify-content-end align-items-center">
              <nav class="sp-megamenu-wrapper w-100 text-end" role="navigation">
                
                <a id="offcanvas-toggler" aria-label="Navigation" class="offcanvas-toggler-right d-block d-lg-none ms-auto" href="#" @click.prevent="toggleMenu" :style="{ color: currentTextColor }">
                  <i class="las fs-1" :class="isMenuOpen ? 'la-times' : 'la-bars'"></i>
                </a>

                <ul class="sp-megamenu-parent menu-animation-fade-down d-none d-lg-flex justify-content-end m-0 p-0 list-unstyled">
                  <li v-for="(item, index) in menuItems" :key="index" class="sp-menu-item ms-4 ms-xl-5">
                    <a :href="item.url" :style="{ color: currentTextColor }" class="text-decoration-none fw-bold" style="font-size: 14px; letter-spacing: 0.5px;">
                      {{ item.label }}
                    </a>
                  </li>
                </ul>

              </nav>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="mobile-menu d-lg-none" :class="{ 'is-open': isMenuOpen }" :style="{ backgroundColor: isScrolled ? currentBgColor : '#003057' }">
      <ul class="list-unstyled text-center m-0 py-3">
        <li v-for="(item, index) in menuItems" :key="index" class="py-3">
          <a :href="item.url" :style="{ color: currentTextColor }" @click="isMenuOpen = false" class="text-decoration-none fw-bold d-block fs-5">
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>

<style scoped>
/* LÓGICA DE POSICIONAMIENTO Y SCROLL */
/* LÓGICA DE POSICIONAMIENTO Y SCROLL */
.header-sticky {
  position: sticky; 
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.4s ease;
  
  /* AQUÍ ESTÁ LA MAGIA DE NUEVO */
  /* Jala la sección de abajo (tu Hero) hacia arriba para que el Header quede superpuesto */
  margin-bottom: -90px; 
}

.header-sticky.is-scrolled {
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  backdrop-filter: blur(5px);
  /* Al hacer scroll, mantenemos o ajustamos el margen si es necesario */
}

/* TAMAÑOS DE LOGO */
.logo-image {
  max-height: 50px; 
  width: auto;
  object-fit: contain;
  transition: max-height 0.3s ease;
  
  /* NUEVO: Empuja el logo de escritorio hacia abajo */
  margin-top: 10px; 
}

.logo-image-phone {
  max-height: 40px;
  width: auto;
  object-fit: contain;
  
  margin-top: 10px; 
}

.is-scrolled .logo-image {
  max-height: 40px;
  margin-top: 5px; 
}

/* MENÚ ESCRITORIO HOVER */
.sp-menu-item a {
  transition: opacity 0.3s ease, color 0.3s ease;
}
.sp-menu-item a:hover {
  opacity: 0.7;
}

/* MENÚ MÓVIL DESPLEGABLE */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.mobile-menu.is-open {
  max-height: 400px; /* Suficiente para mostrar los enlaces */
}
</style>