<script setup lang="ts">
import { computed } from 'vue';

type LineamientoItem = {
  id?: string | number
  color?: string
  texto?: string
}

const props = defineProps<{
  data: any
}>()

// --- PROCESAMIENTO DE CONTENIDO DINÁMICO ---
const title = computed(() => props.data?.title || 'Lineamientos')
const titleLink = computed(() => props.data?.titleLink || '#')
const introText = computed(() => props.data?.introText || '')
const lineamientos = computed<LineamientoItem[]>(() => props.data?.lineamientos || [])

/* Helpers */
const resolveAccentColor = (value: string | undefined, index: number): string => {
  const fallback = index % 2 === 0 ? '#274E9D' : '#E1113F'
  if (!value) return fallback

  const normalized = value.trim().toLowerCase()

  if (normalized === 'azul' || normalized === 'blue') return '#25529a'
  if (normalized === 'rojo' || normalized === 'red') return '#e1113f'

  return value
}

const getCardStyle = (item: LineamientoItem, index: number) => ({
  '--accent-color': resolveAccentColor(item.color, index),
})
</script>

<template>
  <section v-if="lineamientos.length" class="lineamientos-section">
    <div class="lineamientos-section__surface">
      <header class="lineamientos-section__header">
        <NuxtLink
          v-if="title && titleLink !== '#'"
          class="lineamientos-section__title-link"
        >
          <h2 class="lineamientos-section__title">
            {{ title }}
          </h2>
        </NuxtLink>

        <h2 v-else-if="title" class="lineamientos-section__title">
          {{ title }}
        </h2>

        <p v-if="introText" class="lineamientos-section__intro">
          {{ introText }}
        </p>
      </header>

      <div class="lineamientos-grid">
        <article
          v-for="(item, index) in lineamientos"
          :key="item.id || index"
          class="lineamiento-card"
          :style="getCardStyle(item, index)"
        >
          <div class="lineamiento-card__accent">
            <i class="bi bi-check-circle lineamiento-card__icon" aria-hidden="true"></i>
          </div>

          <div class="lineamiento-card__body">
            <p v-if="item.texto" class="lineamiento-card__text">
              {{ item.texto }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lineamientos-section {
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
  padding: 28px 0;
}

.lineamientos-section__surface {
  width: min(100%, 1076px);
  margin: 0 auto;
  padding: 50px 28px;
  box-sizing: border-box;
  background: #f2f7ff;
  border-radius: 8px;
}

.lineamientos-section__header {
  text-align: center;
  margin-bottom: 40px;
}

.lineamientos-section__title-link {
  display: inline-block;
  text-decoration: none;
  color: inherit;
}

.lineamientos-section__title {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin: 0;

  font-family: var(--font-bricolage) !important;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;
  color: #111111;
}

.lineamientos-section__title::after {
  content: "";
  width: 100%;
  height: 3px;
  margin-top: 3px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
}

.lineamientos-section__intro {
  max-width: 760px;
  margin: 14px auto 0;

  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.45;
  color: #111111;
}

.lineamientos-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 30px;
}

.lineamiento-card {
  width: 379px;
  min-height: 124px;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  overflow: hidden;

  background: #ffffff;
  border: 1px solid var(--accent-color, #25529a);
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(17, 17, 17, 0.08);
}

.lineamiento-card__accent {
  width: 96px;
  flex: 0 0 96px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: var(--accent-color, #25529a);
}

.lineamiento-card__icon {
  font-size: 41px;
  line-height: 1;
  color: #ffffff;
}

.lineamiento-card__body {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  padding: 16px 18px 16px 20px;
  box-sizing: border-box;
  background: #ffffff;
}

.lineamiento-card__text {
  margin: 0;

  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.28;
  color: #111111;

  text-align: justify;
  text-justify: inter-word;
}

@media (max-width: 860px) {
  .lineamientos-section__surface {
    padding: 24px 18px 28px;
  }

  .lineamientos-section__header {
    margin-bottom: 30px;
  }

  .lineamientos-grid {
    gap: 20px;
  }

  .lineamiento-card {
    width: 100%;
    max-width: 379px;
  }
}

@media (max-width: 560px) {
  .lineamientos-section__title {
    font-size: 24px;
  }

  .lineamientos-section__intro {
    font-size: 14px;
  }

  .lineamiento-card {
    min-height: 112px;
  }

  .lineamiento-card__accent {
    width: 84px;
    flex-basis: 84px;
  }

  .lineamiento-card__icon {
    font-size: 36px;
  }

  .lineamiento-card__body {
    padding: 14px 14px 14px 16px;
  }

  .lineamiento-card__text {
    font-size: 14px;
    line-height: 1.3;
  }
}
</style>