<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {formatImageUrl} from '@shared/helpers/url';

// ── 🧠 CONTRATOS DE INTERFACES ESTRICTAS DE ALTA INGENIERÍA ──
export interface SlideNode {
  id: string | number;
  title: string;
  description: string;
  author: string;
  image: string;
}

export interface SliderBlockData {
  items?: SlideNode[];
}

const props = defineProps<{
  data: SliderBlockData | null
}>();

// --- PARAMETRIZACIÓN REACTIVA DEL PAGE BUILDER ---
const slides = ref<SlideNode[]>(props.data?.items || []);
const currentIndex = ref<number>(0);

// Escucha cambios profundos en el JSON del administrador para repintar en caliente
watch(() => props.data?.items, (newItems) => {
  if (Array.isArray(newItems)) {
    slides.value = newItems;
    // Control defensivo: si reducen la lista y el index queda huérfano, reseteamos a 0
    if (currentIndex.value >= newItems.length) {
      currentIndex.value = 0;
    }
  }
}, { deep: true, immediate: true });

// --- LÓGICA DE CONTROL DE DIAPOSITIVAS ---
const nextSlide = () => {
  if (slides.value.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % slides.value.length;
};

const prevSlide = () => {
  if (slides.value.length === 0) return;
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length;
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
};

</script>

<template>
  <section class="slider-master-section" v-if="slides.length > 0">
    <div class="slider-viewport-container">
      
      <div class="relative-overflow-viewport">
        <transition-group name="slider-fade" tag="div" class="transition-group-track">
          <div 
            v-for="(slide, index) in slides" 
            v-show="currentIndex === index"
            :key="slide.id ? `${slide.id}-${slide.image}` : index"
            class="slide-node-item-track"
          >
            <div class="slide-textual-content-box animate-text">
              <h2 class="slide-main-title">
                {{ slide.title || 'Título de la Diapositiva' }}
              </h2>
              <p class="slide-description-text">
                {{ slide.description || 'Escribe una descripción elocuente aquí...' }}
              </p>
              <p class="slide-author-credits">
                Por: <span class="author-bold-span">{{ slide.author || 'Institución de la Red' }}</span>
              </p>
            </div>

            <div class="slide-multimedia-frame-wrapper">
              <div class="image-aspect-ratio-ratio shadow-premium border-slate">
                <img 
                  :src="formatImageUrl(slide.image)" 
                  :alt="slide.title" 
                  class="img-fluid-render"
                />
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <button 
        @click="prevSlide"
        class="absolute-nav-arrow-btn arrow-left z-index-top shadow-md"
        aria-label="Anterior"
        v-if="slides.length > 1"
      >
        <div class="inner-white-circle-btn group-hover-colors">
          <i class="bi bi-arrow-left svg-crimson"></i>
        </div>
      </button>

      <button 
        @click="nextSlide"
        class="absolute-nav-arrow-btn arrow-right z-index-top shadow-md"
        aria-label="Siguiente"
        v-if="slides.length > 1"
      >
        <div class="inner-white-circle-btn group-hover-colors">
          <i class="bi bi-arrow-right svg-crimson"></i>
        </div>
      </button>

      <div class="dots-navigation-indicators-bar" v-if="slides.length > 1">
        <button
          v-for="(slide, index) in slides"
          :key="'dot-' + (slide.id || index)"
          @click="goToSlide(index)"
          class="dot-indicator-bullet"
          :class="{ 'dot-bullet-active': currentIndex === index }"
          :aria-label="'Ir a la diapositiva ' + (index + 1)"
        />
      </div>

    </div>
  </section>
</template>

<style scoped>
/* =========================================================================
   🎨 ENCAPSULAMIENTO COMPLETO CON CSS PURO (DISEÑO SLIDER PRESERVADO 1:1)
   ========================================================================= */

.slider-master-section {
  --red: #D9043D;
  --blue: #254C9E;

  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px 0;
  background-color: transparent;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  box-sizing: border-box;
  user-select: none;
}

.slider-viewport-container {
  position: relative;
  width: 100%;
  max-width: 1152px; /* max-w-6xl */
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: border-box;
}

.relative-overflow-viewport {
  position: relative;
  overflow: hidden;
  min-height: 540px; /* Asegura holgura para evitar saltos bruscos de altura en textos */
  width: 100%;
}

.transition-group-track {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-node-item-track {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  box-sizing: border-box;
}

/* Textos Superiores */
.slide-textual-content-box {
  max-width: 768px; /* max-w-3xl */
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
  box-sizing: border-box;
}

.slide-main-title {
  font-size: 2.88rem;
  font-weight: 700;
  color: black;
  letter-spacing: -0.025em;
  /* font-family: Inter; */
  line-height: 1.25;
  margin: 0;
}


@media (min-width: 768px) {
  .slide-main-title { font-size: 2.25rem; } /* text-4xl */
}

.slide-description-text {
  color: black; /* text-gray-600 */
  font-size: 0.875rem;
  line-height: 1.625;
  margin: 0;
}
@media (min-width: 768px) {
  .slide-description-text { font-size: 1rem; }
}

.slide-author-credits {
  font-size: 0.75rem;
  font-weight: 600;
  color: black;
  margin: 0;
}
@media (min-width: 768px) {
  .slide-author-credits { font-size: 0.875rem; }
}
.author-bold-span { font-weight: 700; }

@media (max-width:768px){
  .slide-main-title{
    font-size: 20px;
  }
  .image-aspect-ratio-ratio{
    width: 100% !important;
    height: 100% !important;
  }

  .slider-viewport-container{ padding: 0;}
  .content-wrapper { padding: 0; }
  .slide-textual-content-box { padding: 0; }
  .slide-multimedia-frame-wrapper { padding: 0 !important; }
  .slide-description-text { text-align: justify; }
  /* .slide-multimedia-frame-wrapper {} */
}



/* Contenedor Multimedia con Relación de Aspecto Fija (16:8) de la Captura */
.slide-multimedia-frame-wrapper {
  width: 100%;
  max-width: 896px; /* max-w-4xl */
  padding: 0 16px;
  box-sizing: border-box;
}

.image-aspect-ratio-ratio {
  position: relative;
  /* width: 100%; */
  width: 627px;
  height: 253px;
  aspect-ratio: 16 / 8;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid #f1f5f9;

  display: block;
  margin-left: auto;
  margin-right: auto;
  /* width: 50%; */
}

.img-fluid-render {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Recorte inteligente */
  display: block;
}

/* ── CONTROLES FLECHAS FLOTANTES BICOLORES NATIVAS ── */
.absolute-nav-arrow-btn {
  position: absolute;
  top: 65%; /* Alineación vertical calibrada con la caja multimedia */
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 2px; /* El grosor exacto del anillo del gradiente tricolor de la captura */
  background: linear-gradient(to right, var(--red), var(--blue));
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .absolute-nav-arrow-btn { width: 48px; height: 48px; top: 60%; }
}

.absolute-nav-arrow-btn:active { transform: translateY(-50%) scale(0.95); }
.absolute-nav-arrow-btn:hover { opacity: 0.9; }

.arrow-left { left: 8px; }
.arrow-right { right: 8px; }

.inner-white-circle-btn {
  width: 100%;
  height: 100%;
  background-color: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-arrow-svg {
  width: 1.25rem;
  height: 1.25rem;
  transition: color 0.2s;
}

/* Comportamiento cromático invertido en hover por cada botón */
.svg-crimson { color: white; font-size: 30px;}
/* .arrow-left:hover .svg-crimson { color: var(--blue); } */

/* ── INDICADORES DOTS INFERIORES ── */
.dots-navigation-indicators-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}

.dot-indicator-bullet {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #d1d5db; /* bg-gray-300 */
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dot-bullet-active {
  background: linear-gradient(to right, var(--red), var(--blue));
  transform: scale(1.25);
}

/* =========================================================================
   🎬 MOTOR DE TRANSICIONES ANIMADAS (FADE PURO POR HARDWARE ACCELERATED)
   ========================================================================= */

.slider-fade-enter-active,
.slider-fade-leave-active {
  transition: opacity 0.4s ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.slider-fade-enter-from,
.slider-fade-leave-to {
  opacity: 0;
}

/* Sutil animación de entrada para los textos */
.animate-text {
  animation: textSlideUp 0.5s ease-out forwards;
}
@keyframes textSlideUp {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Ajustes Responsive Críticos */
@media (max-width: 768px) {a
  .relative-overflow-viewport { min-height: 440px; }
  .arrow-left { left: -4px; }
  .arrow-right { right: -4px; }
}
@media (max-width: 480px) {
  .image-aspect-ratio-ratio { aspect-ratio: 16 / 10; } /* Ajuste de proporción en pantallas muy pequeñas */
  .relative-overflow-viewport { min-height: 380px; }
  .absolute-nav-arrow-btn { display: none; } /* Se ocultan las flechas en móviles para navegación por dots limpia */
}

.shadow-premium { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04); }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
</style>