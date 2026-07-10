<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  data: any
}>()

const title = computed(() => props.data?.title || 'Eventos y Noticias Destacados')
const limit = computed(() => {
  const raw = Number(props.data?.limit)
  if (!Number.isFinite(raw) || raw <= 0) return 4
  return Math.min(raw, 6)
})
const postType = computed(() => props.data?.postType || 'all')

const items = ref<any[]>([])
const pending = ref(false)

const getCardAccent = (index: number) => (index % 2 === 0 ? '#e1113f' : '#274e9d')

const formatImageUrl = (url: string | undefined): string => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) return url
  return `http://127.0.0.1:4000/storage/${url}`
}

const parseDate = (dateString?: string) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return Number.isNaN(date.getTime()) ? null : date
}

const capitalize = (text: string) => text ? text.charAt(0).toUpperCase() + text.slice(1) : text

const getCardDate = (dateString?: string) => {
  const date = parseDate(dateString)
  if (!date) return { day: '01', month: 'Enero' }

  const day = date.getDate().toString().padStart(2, '0')
  const month = capitalize(date.toLocaleString('es-ES', { month: 'long' }))
  return { day, month }
}

const formatReadableDate = (dateString?: string) => {
  const date = parseDate(dateString)
  if (!date) return 'Marzo 2026'

  const month = capitalize(date.toLocaleString('es-ES', { month: 'long' }))
  const year = date.getFullYear()
  return `${month} ${year}`
}

const getStatusLabel = (post: any) => {
  const now = new Date()
  const start = parseDate(post?.start_date)
  const end = parseDate(post?.end_date)

  if (start && now < start) return 'Próximamente'
  if (start && end) {
    if (now > end) return 'Finalizado'
    return 'En curso'
  }
  if (start) {
    return now >= start ? 'En curso' : 'Próximamente'
  }
  if (end) {
    return now > end ? 'Finalizado' : 'En curso'
  }
  return 'Próximamente'
}

const getDetailLink = (post: any) => {
  const slug = post?.slug || post?.id
  return slug ? `/news/${slug}` : '#'
}

const fetchFeedFromFastify = async () => {
  pending.value = true

  try {
    let url = `http://localhost:4000/api/public/news?limit=${limit.value}`
    if (postType.value !== 'all') {
      url += `&type=${postType.value}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const resData = await response.json()
    const records = Array.isArray(resData?.data) ? resData.data : Array.isArray(resData) ? resData : []

    if (records.length > 0) {
      items.value = records.slice(0, limit.value)
    } else {
      injectMockData()
    }
  } catch {
    injectMockData()
  } finally {
    pending.value = false
  }
}

const injectMockData = () => {
  const isNuxtEnvironment = typeof window !== 'undefined' && '__NUXT__' in window

  if (!isNuxtEnvironment) {
    items.value = [
      {
        id: 1,
        title: 'Foro N°1',
        excerpt: 'Prueba de foro interuniversitario',
        modality: 'in_person',
        start_date: '2026-05-16T05:00:00.000Z',
        end_date: '2026-05-16T05:00:00.000Z',
        featured_image_path:
          'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=900',
        slug: 'foro-n1',
        type: 'event',
      },
      {
        id: 2,
        title: 'Foro N°1',
        excerpt: 'Prueba de foro interuniversitario',
        modality: 'in_person',
        start_date: '2026-05-16T05:00:00.000Z',
        end_date: '2026-05-16T05:00:00.000Z',
        featured_image_path:
          'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=900',
        slug: 'foro-n1',
        type: 'event',
      },
      {
        id: 3,
        title: 'Foro N°1',
        excerpt: 'Prueba de foro interuniversitario',
        modality: 'in_person',
        start_date: '2026-05-16T05:00:00.000Z',
        end_date: '2026-05-16T05:00:00.000Z',
        featured_image_path:
          'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=900',
        slug: 'foro-n1',
        type: 'event',
      },
      {
        id: 4,
        title: 'Foro N°1',
        excerpt: 'Prueba de foro interuniversitario',
        modality: 'in_person',
        start_date: '2026-05-16T05:00:00.000Z',
        end_date: '2026-05-16T05:00:00.000Z',
        featured_image_path:
          'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=900',
        slug: 'foro-n1',
        type: 'event',
      },
    ].slice(0, limit.value)
  } else {
    items.value = []
  }
}

watch([limit, postType], fetchFeedFromFastify, { immediate: true })
</script>

<template>
  <section class="events-section">
    <div class="events-section__surface">
      <header class="events-section__header">
        <h2 v-if="title" class="events-section__title">
          {{ title }}
        </h2>
      </header>

      <div v-if="pending" class="events-section__loading">
        <div class="spinner-border spinner-border-sm text-primary me-2"></div>
        <span>Cargando eventos y noticias destacadas...</span>
      </div>

      <div v-else-if="items.length > 0" class="events-grid">
        <article
          v-for="(post, index) in items"
          :key="post.id || index"
          class="event-card"
          :style="{ '--accent': getCardAccent(index) }"
        >
          <div class="event-card__image-wrap">
            <img
              v-if="post.featured_image_path"
              :src="formatImageUrl(post.featured_image_path)"
              :alt="post.title || 'Imagen destacada'"
              class="event-card__image"
            />
            <div v-else class="event-card__image-placeholder">
              <i class="bi bi-image"></i>
            </div>

            <div class="event-card__date-badge">
              <span class="event-card__day">
                {{ getCardDate(post.start_date || post.created_at).day }}
              </span>
              <span class="event-card__month">
                {{ getCardDate(post.start_date || post.created_at).month }}
              </span>
            </div>
          </div>

          <div class="event-card__body">
            <h3 v-if="post.title" class="event-card__title">
              {{ post.title }}
            </h3>

            <div class="event-card__divider"></div>

            <div class="event-card__meta">
              <div class="event-card__details">
                <div v-if="post.modality" class="detail-item">
                  <i class="bi bi-clock detail-icon" aria-hidden="true"></i>
                  <span>Modalidad: {{ post.modality === 'virtual' ? 'Virtual' : post.modality === 'hybrid' ? 'Híbrida' : 'Presencial' }}</span>
                </div>

                <div class="detail-item">
                  <i class="bi bi-calendar3 detail-icon" aria-hidden="true"></i>
                  <span>Fecha: {{ formatReadableDate(post.start_date || post.created_at) }}</span>
                </div>

                <div class="detail-item">
                  <i class="bi bi-people detail-icon" aria-hidden="true"></i>
                  <span>Estado: {{ getStatusLabel(post) }}</span>
                </div>
              </div>
            </div>

            <router-link
              :to="getDetailLink(post)"
              class="event-card__button"
            >
              Ver más
            </router-link>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.events-section {
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
  padding: 0 0 56px;
}

.events-section__surface {
  width: min(100%, 1076px);
  /* margin: 0 auto; */
  padding: 50px 0;
  box-sizing: border-box;
  /* background: #f2f7ff; */
  border-radius: 8px;
}

.events-section__header {
  text-align: center;
  margin-bottom: 36px;
}

.events-section__title {
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

.events-section__title::after {
  content: "";
  width: 100%;
  height: 3px;
  margin-top: 3px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
}

.events-section__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px 0;
  color: #6b7280;
  font-family: var(--font-bricolage) !important;
  font-size: 14px;
}

.events-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 20px;
}

.event-card {
  width: 239px;
  /* min-height: 362px; */
  box-sizing: border-box;
  padding: 10px 11px 14px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid rgba(17, 17, 17, 0.06);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
}

.event-card__image-wrap {
  position: relative;
  width: 100%;
  height: 129px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 11px;
  flex-shrink: 0;
}

.event-card__image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.event-card__image-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #e5e7eb, #cbd5e1);
  color: #6b7280;
  font-size: 2rem;
}

.event-card__date-badge {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 0px 0px 0px 8px;
  background: var(--accent, #e1113f);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  z-index: 2;
}

.event-card__day {
  font-family: var(--font-bricolage) !important;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
}

.event-card__month {
  font-family: var(--font-bricolage) !important;
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
  text-transform: capitalize;
}

.event-card__body {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.event-card__meta {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-card__title {
  margin: 0;
  font-family: var(--font-helvetica) !important;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.15;
  color: #111111;
  text-align: center;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.event-card__excerpt {
  margin: 3px 0 0;
  font-family: var(--font-helvetica) !important;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.15;
  color: #111111;
  text-align: center;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.event-card__divider {
  width: 100%;
  height: 1px;
  margin: 7px 0 10px;
  background: #c2c2c2;
}

.event-card__details {
  width: fit-content;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 7px;
  align-items: flex-start;
}


.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-raleway) !important;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #87868a;
}

.detail-icon {
  width: 15px;
  height: 15px;
  color: #a1a1aa;
  flex-shrink: 0;
}

.event-card__button {
  width: 171px;
  height: 34px;
  margin-top: 12px;
  align-self: center;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: var(--accent, #e1113f);
  border-radius: 8px;
  text-decoration: none;

  color: #ffffff;
  font-family: var(--font-helvetica) !important;
  font-size: 14px;
  font-weight: normal !important;
  line-height: 1;
}

@media (max-width: 1040px) {
  .events-section__surface {
    padding: 28px 22px 30px;
  }

  .events-grid {
    gap: 18px;
  }
}

@media (max-width: 540px) {
  .events-section__title {
    font-size: 24px;
  }

  .event-card {
    width: min(100%, 239px);
  }
}
</style>