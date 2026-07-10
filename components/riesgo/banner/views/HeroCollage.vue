<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: any
}>()

const title = computed(() => props.data?.title || '')
const logoUrl = computed(() => props.data?.logoUrl || '')

// Usamos la propiedad superior (o puedes cambiarla por una nueva variable si el backend cambia) como la imagen única del collage
const collageUrl = computed(() => props.data?.collageImagenes?.superior || '')

const formatImageUrl = (url: string | undefined): string => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  return `http://127.0.0.1:4000/storage/${url}`
}
</script>

<template>
  <section class="hero-section">
    <div class="hero-container">
      <div class="hero-text-block">
        <h1 v-if="title" class="hero-title">
          {{ title }}
        </h1>

        <div v-if="logoUrl" class="hero-logo-wrapper">
          <img
            :src="formatImageUrl(logoUrl)"
            alt="Brand Logo"
            class="hero-brand-logo"
          />
        </div>
      </div>

      <div v-if="collageUrl" class="hero-collage-block" aria-hidden="true">
        <img
          :src="formatImageUrl(collageUrl)"
          alt="Hero Collage"
          class="collage-img"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  width: 100%;
  background: #ffffff;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
}

.hero-container {
  width: 100%;
  max-width: 1920px;
  min-height: clamp(489px, 34vw, 670px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 670px) minmax(0, 1fr);
  align-items: stretch;
  box-sizing: border-box;
}

.hero-text-block {
  min-width: 0;
  padding: clamp(24px, 2vw, 44px) clamp(24px, 2.8vw, 56px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}

.hero-title {
  max-width: 591px;
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.32;
  text-transform: uppercase;
  color: #111111;
}

.hero-logo-wrapper {
  width: min(100%, 453px);
  margin-top: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-brand-logo {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

.hero-collage-block {
  position: relative;
  min-height: clamp(489px, 34vw, 670px);
  background: #ffffff;
  overflow: hidden;
  isolation: isolate;
}

/* ⚡ LA IMAGEN AHORA SE ADAPTA DE MANERA INTACTA SIN DEFORMARSE */
.collage-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Mantiene la relación de aspecto y cubre el contenedor */
  display: block;
  opacity: 1;
  filter: saturate(1.02) brightness(0.98);
}

/* Capa blanca transparente general sobre toda la imagen si el diseño la conserva */
/* .hero-collage-block::after {
  content: "";
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.5); 
  z-index: 1;
  pointer-events: none;
} */

/* ==========================================================================
   RESPONSIVE (Control de orden fluido)
   ========================================================================== */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
  }

  /* Las imágenes suben arriba */
  .hero-collage-block {
    min-height: 400px;
    order: 1; 
  }

  /* El texto baja */
  .hero-text-block {
    min-height: 220px;
    padding: 28px 24px;
    order: 2; 
  }

  .hero-title {
    max-width: 720px;
  }
}

@media (max-width: 640px) {
  .hero-text-block {
    padding: 22px 16px;
  }

  .hero-title {
    font-size: 14px;
    line-height: 1.3;
  }

  .hero-logo-wrapper {
    width: min(100%, 380px);
    margin-top: 20px;
  }

  .hero-collage-block {
    min-height: 300px;
  }
}
</style>