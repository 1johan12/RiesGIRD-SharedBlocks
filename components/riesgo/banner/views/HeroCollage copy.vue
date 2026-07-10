<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: any
}>();


const title = computed(() => props.data?.title || '');
const logoUrl = computed(() => props.data?.logoUrl || '/placeholder-logo.png');


const collage = computed(() => ({
  superior: props.data?.collageImagenes?.superior || '/placeholder-img.png',
  izquierda: props.data?.collageImagenes?.izquierda || '/placeholder-img.png',
  centroAbajo: props.data?.collageImagenes?.centroAbajo || '/placeholder-img.png',
  derecha: props.data?.collageImagenes?.derecha || '/placeholder-img.png'
}));
</script>

<template>
  <section class="hero-section">
    <div class="hero-container">
      
      <div class="hero-text-block">
        <h1 class="hero-title" v-if="title">
          {{ title }}
        </h1>
        
        <div class="hero-logo-wrapper" v-if="logoUrl">
          <img :src="logoUrl" alt="Brand Logo" class="hero-brand-logo" />
        </div>
      </div>

      <div class="hero-collage-block">
        
        <div class="collage-item clip-top">
          <img :src="collage.superior" alt="Imagen Superior" class="collage-img" />
          <div class="overlay-tint"></div>
        </div>

        <div class="collage-item clip-left">
          <img :src="collage.izquierda" alt="Imagen Izquierda" class="collage-img" />
          <div class="overlay-tint"></div>
        </div>

        <div class="collage-item clip-center">
          <img :src="collage.centroAbajo" alt="Imagen Centro Abajo" class="collage-img" />
          <div class="overlay-tint"></div>
        </div>

        <div class="collage-item clip-right">
          <img :src="collage.derecha" alt="Imagen Derecha" class="collage-img" />
          <div class="overlay-tint"></div>
        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
/* --- ESTILOS ESTRUCTURALES --- */
.hero-section {
  width: 100%;
  background-color: #ffffff;
  overflow: hidden;
  position: relative;
  padding: 20px 0;
}

.hero-container {
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 45% 55%;
  align-items: center;
  min-height: 480px;
}

/* --- BLOQUE DE TEXTO --- */
.hero-text-block {
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.hero-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0c0a09;
  line-height: 1.6;
  margin-bottom: 35px;
  letter-spacing: 0.3px;
}

.hero-logo-wrapper {
  width: 100%;
  max-width: 360px;
  display: flex;
  justify-content: center;
}

.hero-brand-logo {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* --- COLLAGE DIAGONAL CON MÁSCARAS --- */
.hero-collage-block {
  position: relative;
  width: 100%;
  height: 480px;
  background-color: #ffffff;
}

.collage-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.collage-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.05) brightness(0.95);
}

.overlay-tint {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(37, 82, 154, 0.08) 0%, rgba(219, 20, 60, 0.05) 100%);
  mix-blend-mode: multiply;
  pointer-events: none;
}

/* --- CORTES ASIMÉTRICOS EXACTOS (CLIP-PATH) --- */
.clip-top {
  clip-path: polygon(0 0, 100% 0, 100% 30%, 46% 67%, 0 32%);
  z-index: 4;
}

.clip-left {
  clip-path: polygon(0 35%, 44% 70%, 25% 100%, 0 100%);
  z-index: 3;
}

.clip-center {
  clip-path: polygon(46% 73%, 76% 51%, 89% 100%, 27% 100%);
  z-index: 2;
}

.clip-right {
  clip-path: polygon(100% 33%, 100% 100%, 91% 100%, 78% 50%);
  z-index: 5;
}

.collage-item:hover {
  transform: scale(1.015);
  z-index: 10;
}

/* --- RESPONSIVE ADAPTATION --- */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .hero-text-block { padding: 20px; }
  .hero-title { font-size: 1.1rem; }
  .hero-collage-block { height: 400px; }
}

@media (max-width: 640px) {
  .hero-title { font-size: 1rem; }
  .hero-collage-block { height: 300px; }
}
</style>