<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: any
}>();

// --- LÓGICA REACTIVA DEL PAGE BUILDER ---
const title = computed(() => props.data?.title || '¿Qué es un Laboratorio Territorial?');
const text = computed(() => props.data?.text || 'A diferencia de un laboratorio tradicional de cuatro paredes, un Living Lab es una zona geográfica específica (una cuenca, una ciudad, un valle agrícola) donde implementamos y validamos tecnologías y estrategias sociales junto con las personas que habitan el lugar.');
</script>
<template>
  <section class="naturaleza-section">
    <div class="naturaleza-section__outer">
      <div class="naturaleza-section__inner">
        <div class="naturaleza-section__header">
          <h2 v-if="title" class="naturaleza-section__title">
            {{ title }}
          </h2>

          <p
            v-if="text"
            class="naturaleza-section__text"
            v-html="text"
          ></p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.naturaleza-section {
  width: 100%;
  background: #ffffff;
  padding: 20px 0 0;
  box-sizing: border-box;
}

.naturaleza-section__outer {
  width: min(100%, 1010px);
  margin: 0 auto;
  padding: 28px 76px;
  box-sizing: border-box;
  background: #f2f7ff;
  border-radius: 8px;
}

.naturaleza-section__inner {
  width: min(100%, 858px);
  margin: 0 auto;
  padding: 42px 40px 36px;
  box-sizing: border-box;
  background: #ffffff;
}

.naturaleza-section__header {
  text-align: center;
}

.naturaleza-section__title {
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

.naturaleza-section__title::after {
  content: "";
  width: 100%;
  height: 3px;
  margin-top: 3px;

  background: linear-gradient(
    90deg,
    #e1113f 0%,
    #274e9d 100%
  );
}

.naturaleza-section__text {
  max-width: 680px;

  margin: 25px auto 0;

  font-family: var(--font-bricolage) !important;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.45;

  color: #111111;

  text-align: center;
}

@media (max-width: 980px) {
  .naturaleza-section__outer {
    padding: 24px;
  }

  .naturaleza-section__inner {
    width: 100%;
    padding: 32px 24px;
  }
}

@media (max-width: 640px) {
  .naturaleza-section {
    padding: 16px 0 0;
  }

  .naturaleza-section__outer {
    padding: 16px;
  }

  .naturaleza-section__inner {
    padding: 28px 16px;
  }

  .naturaleza-section__title {
    font-size: 24px;
  }

  .naturaleza-section__text {
    font-size: 14px;
    line-height: 1.5;
  }
}
</style>