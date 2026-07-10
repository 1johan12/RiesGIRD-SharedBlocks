<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: any
}>();

// --- LÓGICA REACTIVA DEL PAGE BUILDER ---
const title = computed(() => props.data?.title || 'Caso de Éxito y Alianzas');
const imageUrl = computed(() => props.data?.imageUrl || '');
const subTitle = computed(() => props.data?.subTitle || 'Maestría Conjunta en Gestión de Riesgos y Sostenibilidad');
const highlightLabel = computed(() => props.data?.highlightLabel || 'El Modelo de Éxito:');
const text = computed(() => props.data?.text || 'Un claro ejemplo de nuestra capacidad de articulación es la alianza entre la Universidad Nacional de Ingeniería (UNI) aportando el rigor técnico, la Universidad ESAN aportando la visión en gestión pública y negocios, y el Ministerio de la Producción (PRODUCE) garantizando la aplicabilidad en el sector estatal.');
const bannerText = computed(() => props.data?.bannerText || 'Esta sinergia demuestra que el trabajo en red permite crear programas de posgrado de altísimo nivel, formando funcionarios y especialistas con una visión completa y multidisciplinaria.');

// Helper defensivo para formatear rutas multimedia locales o remotas
const formatImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `http://127.0.0.1:4000/storage/${url}`; // Ajustado a tu puerto local de Fastify
};
</script>

<template>
  <section class="caso-exito-section">
    <div class="container-fluid-ce">
      <div class="caso-exito-section__panel">
        <div class="header-block" v-if="title">
          <h2 class="main-title">{{ title }}</h2>
        </div>

        <div class="content-grid">
          <div class="image-wrapper">
            <img
              v-if="imageUrl"
              :src="formatImageUrl(imageUrl)"
              :alt="title"
              class="success-img"
            />

            <div v-else class="placeholder-success-box">
              <div class="placeholder-content">
                <i class="las la-image icon-placeholder"></i>
                <p class="placeholder-text">Imagen del Caso de Éxito</p>
                <span class="placeholder-subtext">Carga un recurso desde el inspector lateral</span>
              </div>
            </div>
          </div>

          <div class="text-block">
            <h3 class="sub-title" v-if="subTitle">
              {{ subTitle }}
            </h3>

            <div class="description-body">
              <strong class="highlight-label" v-if="highlightLabel">{{ highlightLabel }}</strong>
              <p class="main-paragraph" v-if="text">
                {{ text }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-gradient-banner" v-if="bannerText">
        <p class="banner-text">
          {{ bannerText }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.caso-exito-section {
  width: 100%;
  padding: 22px 0 0;
  background: #ffffff;
  box-sizing: border-box;
}

.container-fluid-ce {
  width: min(100%, 1010px);
  margin: 0 auto;
  padding: 38px 76px 30px;
  box-sizing: border-box;
  background: #f2f7ff;
  border-radius: 8px;
}

.caso-exito-section__panel {
  width: 900px;
  min-height: 387px;
  margin: 0 auto;
  padding: 28px 28px 26px;
  box-sizing: border-box;
  background: #ffffff;
}

.header-block {
  width: 100%;
  margin: 0 0 28px;
  text-align: center;
}

.main-title {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;
  color: #111111;
}

.main-title::after {
  content: "";
  width: 100%;
  height: 3px;
  margin-top: 3px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
}

.content-grid {
  display: grid;
  grid-template-columns: 304px 1fr;
  gap: 70px;
  align-items: start;
}

.image-wrapper {
  width: 304px;
  flex-shrink: 0;
}

.success-img {
  width: 304px;
  height: 205px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.placeholder-success-box {
  width: 304px;
  height: 205px;
  border: 2px dashed #d5dce5;
  border-radius: 8px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.placeholder-content {
  text-align: center;
  color: #64748b;
}

.icon-placeholder {
  font-size: 2.4rem;
  opacity: 0.4;
  margin-bottom: 6px;
}

.placeholder-text {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.placeholder-subtext {
  display: block;
  margin-top: 4px;
  font-size: 11px;
}

.text-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
  min-width: 0;
}

.sub-title {
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
  color: #111111;
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.description-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.highlight-label {
  display: block;
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
  color: #111111;
}

.main-paragraph {
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.55;
  color: #222222;
  text-align: justify;
}

.bottom-gradient-banner {
  width: 858px;
  margin: 24px auto 0;
  padding: 18px 28px;
  box-sizing: border-box;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  border-radius: 0;
}

.banner-text {
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: #ffffff;
  text-align: center;
}

@media (max-width: 980px) {
  .container-fluid-ce {
    width: min(100%, 1010px);
    padding: 28px 24px 24px;
  }

  .caso-exito-section__panel,
  .bottom-gradient-banner {
    width: 100%;
    max-width: 858px;
  }

  .caso-exito-section__panel {
    min-height: auto;
    padding: 24px 20px 22px;
  }

  .content-grid {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 24px;
  }

  .text-block {
    text-align: center;
  }

  .sub-title {
    text-align: center;
  }

  .bottom-gradient-banner {
    margin-top: 22px;
  }
}

@media (max-width: 640px) {
  .main-title {
    font-size: 24px;
  }

  .main-title::after {
    margin-top: 8px;
  }

  .sub-title,
  .highlight-label,
  .main-paragraph,
  .banner-text {
    font-size: 15px;
  }

  .image-wrapper,
  .success-img,
  .placeholder-success-box {
    width: 100%;
    max-width: 304px;
  }

  .bottom-gradient-banner {
    padding: 16px 18px;
  }
}
</style>