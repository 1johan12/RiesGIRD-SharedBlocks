<script setup lang="ts">
import { computed, ref } from 'vue'
import SectionTitle from '../../section/title/SectionTitle.vue'
import {formatImageUrl} from '@shared/helpers/url'

export interface InvestigationNode {
  id: string | number
  autor: string
  tipo: string
  titulo: string
  fileUrl?: string
  photoUrl?: string
  imageUrl?: string
}

export interface InvestigationsBlockData {
  title?: string
  introText?: string
  items?: InvestigationNode[]
}

const props = defineProps<{
  data: InvestigationsBlockData | null
}>()

const title = computed(() => props.data?.title || 'Encuentra su investigación')
const introText = computed(
  () =>
    props.data?.introText ||
    'Explora nuestra base de datos de producción científica. Documentos, tesis, policy briefs y artículos desarrollados por los investigadores de nuestras universidades miembro, orientados a resolver los desafíos territoriales del país.'
)

const items = computed<InvestigationNode[]>(() => props.data?.items || [])

const searchQuery = ref('')
const searchGradientId = `search-gradient-${Math.random().toString(36).slice(2, 10)}`

const filteredInvestigations = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return items.value

  return items.value.filter((item) => {
    const autor = (item.autor || '').toLowerCase()
    const tipo = (item.tipo || '').toLowerCase()
    const titulo = (item.titulo || '').toLowerCase()

    return autor.includes(query) || tipo.includes(query) || titulo.includes(query)
  })
})

const getItemImage = (item: InvestigationNode): string => {
  return formatImageUrl(item.photoUrl || item.imageUrl)
}

const preventIfEmpty = (href: string, event: MouseEvent) => {
  if (!href || href === '#') {
    event.preventDefault()
  }
}
</script>

<template>
  <section class="investigations-section">
    <div class="investigations-section__container">
      <header class="investigations-section__header">
        <SectionTitle v-if="title" :title="title" />

        <p v-if="introText" class="investigations-section__intro">
          {{ introText }}
        </p>
      </header>

      <div class="search-engine-block">
        <div class="search-engine-block__card">
          <input
            v-model="searchQuery"
            type="text"
            class="search-engine-block__input"
            placeholder="Buscar..."
          />

          <div class="search-engine-block__action">
            <div class="search-engine-block__divider"></div>

            <button type="button" class="search-engine-block__button" aria-label="Buscar">
              <svg class="search-engine-block__icon" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient
                    :id="searchGradientId"
                    x1="0"
                    y1="0"
                    x2="24"
                    y2="24"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stop-color="#E1113F" />
                    <stop offset="100%" stop-color="#274E9D" />
                  </linearGradient>
                </defs>
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  :stroke="`url(#${searchGradientId})`"
                  stroke-width="2.2"
                />
                <line
                  x1="21"
                  y1="21"
                  x2="16.65"
                  y2="16.65"
                  :stroke="`url(#${searchGradientId})`"
                  stroke-width="2.2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredInvestigations.length" class="investigations-grid">
        <a
          v-for="(item, index) in filteredInvestigations"
          :key="item.fileUrl ? `${index}-${item.fileUrl}` : item.id"
          :href="formatImageUrl(item.fileUrl)"
          :target="item.fileUrl ? '_blank' : '_self'"
          rel="noopener noreferrer"
          class="investigation-card"
          :class="{ 'investigation-card--disabled': !item.fileUrl }"
          @click="preventIfEmpty(formatImageUrl(item.fileUrl), $event)"
        >
          <div class="investigation-card__left">
            <img
              v-if="item.photoUrl || item.imageUrl"
              :src="getItemImage(item)"
              :alt="item.titulo"
              class="investigation-card__photo"
            />

            <div
              v-else
              class="investigation-card__photo-fallback"
            >
              <span class="investigation-card__photo-ring">
                <i class="bi bi-person-fill"></i>
              </span>
            </div>
          </div>

          <div class="investigation-card__divider"></div>

          <div class="investigation-card__content">
            <span class="investigation-card__author">
              {{ item.autor }}
            </span>

            <h3 class="investigation-card__title">
              <span class="investigation-card__type">{{ item.tipo }}:</span>
              <span class="investigation-card__title-text">{{ item.titulo }}</span>
            </h3>
          </div>
        </a>
      </div>

      <div v-else class="investigations-empty">
        <i class="bi bi-search investigations-empty__icon"></i>
        <p class="investigations-empty__text">
          No se encontraron producciones científicas que coincidan con su criterio de búsqueda.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.investigations-section {
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
}

.investigations-section__container {
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: 0 20px 56px;
  box-sizing: border-box;
}

.investigations-section__header {
  width: 100%;
  text-align: center;
}

.investigations-section__intro {
  max-width: 1040px;
  margin: 20px auto 0;
  font-family: var(--font-bricolage) !important;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.3;
  color: #111111;
  text-align: center;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.search-engine-block {
  width: 100%;
  max-width: 502px;
  margin: 34px auto 0;
}

.search-engine-block__card {
  width: 100%;
  height: 42px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: stretch;
  overflow: hidden;
}

.search-engine-block__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0 18px;
  box-sizing: border-box;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 400;
  color: #555555;
  text-align: center;
}

.search-engine-block__input::placeholder {
  color: #a3a3a3;
}

.search-engine-block__action {
  display: flex;
  align-items: stretch;
  flex: 0 0 auto;
}

.search-engine-block__divider {
  width: 2px;
  background: #274e9d;
  align-self: stretch;
}

.search-engine-block__button {
  width: 42px;
  height: 42px;
  border: none;
  background: #ffffff;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.search-engine-block__icon {
  width: 22px;
  height: 22px;
  display: block;
}

.investigations-grid {
  width: min(100%, 845px);
  margin: 36px auto 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 403px));
  justify-content: center;
  gap: 32px;
  align-items: start;
}

.investigation-card {
  width: 100%;
  min-height: 133px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: stretch;
  padding: 10px;
  box-sizing: border-box;
  text-decoration: none;
  color: inherit;
}

.investigation-card--disabled {
  opacity: 0.82;
  cursor: default;
}

.investigation-card__left {
  width: 133px;
  min-width: 133px;
  height: 133px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.investigation-card__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.investigation-card__photo-fallback {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.investigation-card__photo-ring {
  width: 84px;
  height: 84px;

  border-radius: 50%;
  border: 2px solid rgba(255,255,255,.95);

  display: flex;
  align-items: center;
  justify-content: center;

  color: #fff;
}

.investigation-card__photo-ring i {
  font-size: 56px;
  line-height: 1;
}

.investigation-card__divider {
  width: 1px;
  align-self: stretch;
  background: linear-gradient(180deg, #e1113f 0%, #274e9d 100%);
  flex-shrink: 0;
  margin: 0 12px;
}

.investigation-card__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

.investigation-card__author {
  display: block;
  margin-bottom: 6px;
  font-family: var(--font-raleway) !important;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  color: #555555;
  text-decoration: underline;
  text-underline-offset: 2px;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.investigation-card__title {
  margin: 0;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: #111111;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.investigation-card__type {
  color: #111111;
}

.investigation-card__title-text {
  color: #111111;
  margin-left: 4px;
}

.investigations-empty {
  margin-top: 40px;
  text-align: center;
  color: #94a3b8;
}

.investigations-empty__icon {
  display: block;
  font-size: 2.5rem;
  opacity: 0.45;
  margin-bottom: 8px;
}

.investigations-empty__text {
  margin: 0;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
}

@media (max-width: 980px) {
  .investigations-grid {
    grid-template-columns: 1fr;
    max-width: 403px;
  }

  .investigation-card {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .investigations-section__container {
    padding-left: 14px;
    padding-right: 14px;
  }

  .investigations-section__intro {
    font-size: 18px;
  }

  .search-engine-block {
    max-width: 100%;
  }

  .investigations-grid {
    margin-top: 30px;
  }

  .investigation-card__left {
    width: 118px;
    min-width: 118px;
    height: 118px;
  }

  .investigation-card__photo-ring {
    width: 64px;
    height: 64px;
  }

  .investigation-card__photo-ring i {
    font-size: 42px;
  }

  .investigation-card__title {
    font-size: 13px;
  }
}
</style>