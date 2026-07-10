<script setup lang="ts">
import { computed } from 'vue'
import SectionTitle from '../title/SectionTitle.vue';
const props = defineProps<{
  data: any
}>()

const title = computed(() => props.data?.title || 'La Necesidad Institucional y Social')
const text = computed(
  () =>
    props.data?.text ||
    'La vulnerabilidad del territorio peruano exige un cambio de paradigma educativo. La necesidad de incorporar la GIRD y la ACC en la educación superior responde a las demandas del Sistema Nacional de Gestión del Riesgo de Desastres (SINAGERD) y a la Política Nacional de Cambio Climático. Necesitamos médicos que entiendan la operatividad de hospitales seguros, arquitectos que diseñen con enfoque de riesgo, y economistas que calculen el impacto de los desastres en el presupuesto público.'
)
const imageUrl = computed(() => props.data?.imageUrl || '')

const formatImageUrl = (url: string | undefined): string => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  return `http://127.0.0.1:4000/storage/${url}`
}
</script>

<template>
  <section class="need-section">
    <div class="need-shell">
      <div class="need-card">
        <SectionTitle
          v-if="title"
          :title="title" style="padding-bottom: 40px;"
        />
        <!-- <div class="need-title-wrap" v-if="title">
          <h2 class="need-title">{{ title }}</h2>
          <span class="need-underline"></span>
        </div> -->

        <div class="need-content">
          <div class="need-image-wrap" v-if="imageUrl">
            <img
              :src="formatImageUrl(imageUrl)"
              :alt="title"
              class="need-image"
            />
          </div>

          <div class="need-text-wrap" v-if="text">
            <p class="need-text" v-html="text"></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.need-section {
  width: 100%;
  background: #ffffff;
  padding: 68px 20px;
  box-sizing: border-box;
}

.need-shell {
  width: 100%;
  max-width: 1010px;
  margin: 0 auto;
  background: #f3f7ff;
  border-radius: 12px;
  padding: 42px 26px;
  box-sizing: border-box;
}

.need-card {
  width: 100%;
  max-width: 858px;
  margin: 0 auto;
  background: #ffffff;
  padding: 46px 44px 44px;
  box-sizing: border-box;
  text-align: center; /* ✨ Centra el bloque inline-flex del título perfectamente */
}

.need-title-wrap {
  margin-bottom: 40px;
  display: inline-flex;     /* ✨ Se encoge al tamaño exacto de las letras del título */
  flex-direction: column;   /* Mantiene el título arriba y la línea abajo */
  align-items: center;      /* Centra el subrayado respecto al texto */
}

.need-title {
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-weight: 700;
  font-size: 28px;
  line-height: 1.15;
  color: #000000;
  text-align: center;
}

.need-underline {
  width: 100%;             /* ✨ Ocupa el 100% del contenedor (que ahora mide lo mismo que el texto) */
  height: 3px;
  margin-top: 4px;
  background:  var(--gradient-primary, linear-gradient(90deg, #e1113f 0%, #274e9d 100%));
  border-radius: 999px;
}

.need-content {
  display: grid;
  grid-template-columns: 304px 1fr;
  gap: 56px;
  align-items: center;
}

.need-image-wrap {
  width: 304px;
  aspect-ratio: 304 / 205.15;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.need-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.need-text-wrap {
  width: 100%;
}

.need-text {
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.15;
  color: #111111;
  text-align: left;
}

/* Responsive */
@media (max-width: 900px) {
  .need-shell {
    padding: 28px 18px;
  }

  .need-card {
    padding: 32px 22px;
  }

  .need-content {
    grid-template-columns: 1fr;
    gap: 24px;
    justify-items: center;
  }

  .need-text {
    text-align: center;
  }

  .need-title {
    font-size: 24px;
  }
}

@media (max-width: 520px) {
  .need-section {
    padding: 42px 12px;
  }

  .need-title {
    font-size: 22px;
  }

  .need-underline {
    width: 100%;
  }

  .need-image-wrap {
    width: 100%;
    max-width: 304px;
  }
}
</style>