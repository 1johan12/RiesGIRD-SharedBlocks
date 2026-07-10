<script setup lang="ts">
import { computed } from 'vue';

// ── 🧠 CONTRATO DE INTERFAZ ESTRICTA DE ENTRADA ──
export interface BannerBlockData {
  bannerText?: string;
}

const props = defineProps<{
  data: BannerBlockData | null
}>();

// --- PARAMETRIZACIÓN REACTIVA DEFENSIVA ---
const bannerText = computed(() => props.data?.bannerText || 'Entérate de las últimas novedades, participa en nuestros próximos encuentros y únete a las iniciativas que impulsan el desarrollo territorial sostenible.');
</script>

<template>
  <section class="banner-standalone-section">
    <div class="banner-fluid-max-container">
      
      <div class="banner-gradient-box shadow-premium">
        <p class="banner-core-paragraph-text">
          {{ bannerText }}
        </p>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* =========================================================================
   🎨 ALTA FIDELIDAD EN CSS NATIVO (BLOQUE DESACOPLADO BLINDADO 1:1)
   ========================================================================= */

.banner-standalone-section {
  width: 100%;
  background-color: transparent;
  box-sizing: border-box;
  padding: 24px 0; /* Sutil colchón vertical por defecto */
}

.banner-fluid-max-container {
  width: 100%;
  max-width: 1140px; /* max-w-6xl equivalente para alinearse con tus grillas */
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .banner-fluid-max-container { padding-left: 32px; padding-right: 32px; }
}

/* Caja contenedora con la fusión lineal tricolor RiesGIRD */
.banner-gradient-box {
  width: 100%;
  background: linear-gradient(to right, #D9043D, #653E9B, #254C9E);
  border-radius: 12px; /* rounded-xl */
  padding: 32px;
  box-sizing: border-box;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.banner-gradient-box:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(101, 62, 155, 0.15); /* Efecto neon sutil */
}

@media (min-width: 768px) {
  .banner-gradient-box { padding: 40px; } /* p-8 md:p-10 */
}

/* Tipografía y equilibrado de línea */
.banner-core-paragraph-text {
  color: #ffffff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: 500; /* font-medium */
  line-height: 1.625; /* leading-relaxed */
  max-w: 896px; /* max-w-4xl */
  margin: 0 auto;
  text-align: center;
  text-wrap: balance; /* balance-text nativo de CSS */
}

@media (min-width: 768px) {
  .banner-core-paragraph-text { font-size: 1.125rem; } /* text-lg */
}
@media (min-width: 1024px) {
  .banner-core-paragraph-text { font-size: 1.25rem; } /* text-xl */
}

.shadow-premium { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); }
</style>