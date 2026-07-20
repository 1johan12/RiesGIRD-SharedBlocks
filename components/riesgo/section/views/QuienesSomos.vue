<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatImageUrl } from '@shared/helpers/url';

const props = defineProps<{
  data: any
}>()

// --- LÓGICA DE CONTENIDO DINÁMICO ---
const title = computed(() => props.data?.title || '¿Quiénes somos?');
const text = computed(() => props.data?.text || '');
const imageUrl = computed(() => props.data?.imageUrl || '/placeholder-about.png');

// --- LÓGICA DE INTERACTIVIDAD ORIGINAL ---
const isHovered = ref(false)

const handleMouseEnter = () => { isHovered.value = true }
const handleMouseLeave = () => { isHovered.value = false }
</script>

<template>
  <section class="about-section">
    <h2 class="section-title" v-if="title">{{ title }}</h2>
    
    <p class="section-text" v-if="text" v-html="text"></p>

    <div 
      class="image-container"
      :class="{ 'container-hover': isHovered }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      v-if="imageUrl"
    >
      <img 
        :src="formatImageUrl(imageUrl)" 
        alt="Imagen Informativa"
        :style="{ filter: isHovered ? 'brightness(1.05)' : 'brightness(1)' }"
      />
    </div>
  </section>
</template>

<style scoped>
.about-section {
  width: 100%;
  max-width: 858px;
  margin: 0 auto;
  padding: 0 0 52px 0 ;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

/* ===== TÍTULO ===== */
.section-title {
  position: relative;
  display: inline-flex;
  flex-direction: column;

  margin: 0;

  font-family: var(--font-bricolage) !important;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.1;

  color: #111111;

  text-align: center;
}

.section-title::after {
  content: "";

  width: 100%;
  height: 3px;

  margin-top: 10px;

  background: linear-gradient(
    90deg,
    #e1113f 0%,
    #274e9d 100%
  );
}

/* ===== TEXTO ===== */
.section-text {
  width: 100%;
  max-width: 760px;

  margin: 0;

  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.45;

  color: #111111;

  text-align: center;
}

/* ===== IMAGEN ===== */
.image-container {
  width: 620px;
  height: 419px;

  overflow: hidden;
  border-radius: 8px;

  transition: transform 0.3s ease;

  flex-shrink: 0;
}

.container-hover {
  transform: translateY(-4px);
}

.image-container img {
  width: 100%;
  height: 100%;

  object-fit: cover;
  display: block;

  transition:
    transform 0.45s ease,
    filter 0.3s ease;
}

.image-container:hover img {
  transform: scale(1.02);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .about-section {
    gap: 32px;
  }

  .section-title {
    font-size: 24px;
  }

  .section-text {
    font-size: 15px;
    line-height: 1.5;
  }

  .image-container {
    width: 100%;
    max-width: 620px;
    height: auto;
    aspect-ratio: 620 / 419;
  }
}

@media (max-width: 480px) {
  .about-section {
    gap: 24px;
  }

  .section-title {
    font-size: 21px;
  }

  .section-text {
    font-size: 14px;
  }
}
</style>