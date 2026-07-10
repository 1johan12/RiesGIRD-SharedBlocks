<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: any
}>();

// --- PROCESAMIENTO DE CONTENIDO DINÁMICO ---
const title = computed(() => props.data?.title || 'Aliados');
const logos = computed(() => props.data?.logos || []);
</script>

<template>
  <section class="aliados-section">
    <h2 class="section-title" v-if="title">{{ title }}</h2>

    <div class="slider-container" v-if="logos.length > 0">
      <div class="slider-track">
        
        <div v-for="(logo, index) in logos" :key="'first-' + (logo.id || index)" class="slide">
          <img :src="logo.src || '/placeholder-logo.png'" :alt="logo.name" class="logo-img" />
        </div>

        <div v-for="(logo, index) in logos" :key="'second-' + (logo.id || index)" class="slide">
          <img :src="logo.src || '/placeholder-logo.png'" :alt="logo.name" class="logo-img" />
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* --- CONFIGURACIÓN GENERAL --- */
.aliados-section {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  padding: 20px 0;
  background: transparent;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 50px;
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, #cc2c2c 50%, #1e40af 50%);
}

/* --- MÁSCARA DEL CARRUSEL --- */
.slider-container {
  overflow: hidden;
  width: 100%;
  position: relative;
  background: transparent;
  padding: 20px 0;
}

/* 🔥 OPTIMIZACIÓN CRÍTICA: Gradientes cambiados a #ffffff para fundirse en la caja blanca */
.slider-container::before,
.slider-container::after {
  content: "";
  height: 100%;
  position: absolute;
  width: 100px;
  z-index: 2;
  pointer-events: none;
}
.slider-container::before {
  top: 0;
  left: 0;
  background: linear-gradient(to right, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
}
.slider-container::after {
  top: 0;
  right: 0;
  background: linear-gradient(to left, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
}

/* --- RUTA DE ANIMACIÓN (TRACK) --- */
.slider-track {
  display: flex;
  width: max-content; 
  align-items: center;
  animation: scroll-loop 25s linear infinite;
}

.slider-track:hover {
  animation-play-state: paused;
}

/* --- ITEMS INDIVIDUALES --- */
.slide {
  width: 240px; 
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
}

.logo-img {
  max-width: 100%;
  max-height: 65px; 
  object-fit: contain;
  filter: grayscale(100%); 
  opacity: 0.6;
  transition: all 0.3s ease;
}

.slide:hover .logo-img {
  filter: grayscale(0%);
  opacity: 1;
}

/* --- ANIMACIÓN CSS INFINITA SUAVE --- */
@keyframes scroll-loop {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); } 
}

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .slide {
    width: 180px;
    padding: 0 20px;
  }
  .logo-img {
    max-height: 50px;
  }
}
</style>