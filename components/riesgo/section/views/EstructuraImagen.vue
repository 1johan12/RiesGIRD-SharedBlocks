<script setup lang="ts">
import { computed } from 'vue';
import SectionTitle from '../title/SectionTitle.vue';
import { formatImageUrl } from '@shared/helpers/url';
const props = defineProps<{
  data: any
}>();

const title = computed(() => props.data?.title || 'Estructura de la RiesGIRD-ACC/Perú');
const imageUrl = computed(() => props.data?.imageUrl || '');


</script>

<template>
  <section class="estructura-imagen-section">
    <div class="outer-white-container">
      <div class="blue-container">
        <div class="inner-white-container">
          <SectionTitle v-if="title" :title="title" :padding-bottom="20" />

          <div class="imagen-render-container">
            <img
              v-if="imageUrl"
              :src="formatImageUrl(imageUrl)"
              :alt="title"
              class="diagrama-img-fit"
            />

            <div v-else class="placeholder-imagen-block">
              <div class="text-center text-muted">
                <i class="las la-image opacity-50 display-4 mb-2 d-block"></i>
                <p class="small fw-bold m-0 text-uppercase letter-spacing-1">
                  Espacio reservado para el diagrama estructural
                </p>
                <span class="x-small text-muted d-block mt-1">
                  Sube una imagen desde el panel lateral de atributos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.estructura-imagen-section {
  width: 100%;
  padding: 20px 15px 30px;
  box-sizing: border-box;
  background: transparent;
}

.outer-white-container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  background: #ffffff;
  padding: 24px;
  box-sizing: border-box;
}

.blue-container {
  width: 100%;
  max-width: 1010px;
  margin: 0 auto;
  background: #f2f7ff;
  padding: 40px 0;
  box-sizing: border-box;
  border-radius: 4px;
}

.inner-white-container {
  width: 100%;
  max-width: 906px;
  margin: 0 auto;
  background: #ffffff;
  padding: 24px 26px 30px;
  box-sizing: border-box;
  height: auto;
}

.imagen-render-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.diagrama-img-fit {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
  background-color: #ffffff;
}

.placeholder-imagen-block {
  width: 100%;
  min-height: 380px;
  background-color: #ffffff;
  border: 2px dashed #cbd5e1;
  display: grid;
  place-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.letter-spacing-1 {
  letter-spacing: 0.5px;
}

.x-small {
  font-size: 0.72rem;
}

@media (max-width: 1100px) {
  .outer-white-container {
    padding: 18px;
  }

  .blue-container {
    padding: 28px 0;
  }

  .inner-white-container {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .estructura-imagen-section {
    padding: 14px 10px 24px;
  }

  .outer-white-container {
    padding: 12px;
  }

  .blue-container {
    padding: 18px 0;
  }

  .inner-white-container {
    padding: 16px;
  }

  .placeholder-imagen-block {
    min-height: 260px;
  }
}
</style>