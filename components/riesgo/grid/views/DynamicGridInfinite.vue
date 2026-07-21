<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import SectionTitle from '../../section/title/SectionTitle.vue';
import { formatImageUrl } from '@shared/helpers/url';
import { PUBLIC_API_URL } from '../../../../config/apiConfig.ts';

const props = defineProps<{
  data: any
}>()

const title = computed(() => props.data?.title || 'Eventos y Noticias Destacados')
const introText = computed(() => props.data?.introText || '')

const postType = computed<string>(() => {
  const allowed = ['news', 'event', 'calls', 'assemblies']
  const rawType = props.data?.postType || 'news'
  return allowed.includes(rawType) ? rawType : 'news'
})

const items = ref<any[]>([])
const pending = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10
const isNoMoreRecords = ref(false) 

const getCardAccent = (index: number) => (index % 2 === 0 ? '#e1113f' : '#274e9d')



const parseDate = (dateString?: string) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return Number.isNaN(date.getTime()) ? null : date
}

const capitalize = (text: string) => text ? text.charAt(0).toUpperCase() + text.slice(1) : text

const getCardDate = (dateString?: string) => {
  const date = parseDate(dateString)
  if (!date) return { day: '01', month: 'Ene' }
  const day = date.getDate().toString().padStart(2, '0')
  const month = capitalize(date.toLocaleString('es-ES', { month: 'short' })).replace('.', '')
  return { day, month }
}

const formatReadableDate = (dateString?: string) => {
  const date = parseDate(dateString)
  if (!date) return 'Marzo 2026'
  const month = capitalize(date.toLocaleString('es-ES', { month: 'long' }))
  return `${month} ${date.getFullYear()}`
}

const getStatusLabel = (post: any) => {
  const now = new Date()
  const start = parseDate(post?.start_date)
  const end = parseDate(post?.end_date)
  if (start && now < start) return 'Próximamente'
  if (start && end) return now > end ? 'Finalizado' : 'En curso'
  if (start) return now >= start ? 'En curso' : 'Próximamente'
  return 'Próximamente'
}

const getDetailLink = (post: any) => {
  const slug = post?.slug || post?.id
  return slug ? `/${postType.value}/${slug}` : '#'
}

const apiBaseUrl = PUBLIC_API_URL || 'http://localhost:4000/api/public'

const fetchFeedFromFastify = async (isAppendMode = false) => {
  if (pending.value) return
  pending.value = true

  if (!isAppendMode) {
    currentPage.value = 1
    items.value = []
    isNoMoreRecords.value = false
  }

  try {
    const url = `${apiBaseUrl}/news?page=${currentPage.value}&limit=${itemsPerPage}&type=${postType.value}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const resData = await response.json()
    const records = Array.isArray(resData?.data) ? resData.data : Array.isArray(resData) ? resData : []

    if (records.length > 0) {
      if (isAppendMode) {
        items.value = [...items.value, ...records] 
      } else {
        items.value = records
      }
      if (records.length < itemsPerPage) {
        isNoMoreRecords.value = true 
      }
    } else {
      if (isAppendMode) isNoMoreRecords.value = true
      else injectMockData()
    }
  } catch (error) {
    console.error("Error devorando lote incremental:", error)
    if (!isAppendMode) injectMockData()
  } finally {
    pending.value = false
  }
}

const loadNextPageChunk = () => {
  if (pending.value || isNoMoreRecords.value) return
  currentPage.value++
  fetchFeedFromFastify(true)
}

// ── 🎯 INTERSECTION OBSERVER DETECTOR DE FONDO DE PÁGINA
const sentinelAnchor = ref<HTMLElement | null>(null)
let scrollObserver: IntersectionObserver | null = null

const initInfiniteScroll = () => {
  if (!sentinelAnchor.value) return
  scrollObserver = new IntersectionObserver((entries) => {
    const trigger = entries[0]
    if (trigger.isIntersecting && !pending.value && !isNoMoreRecords.value) {
      loadNextPageChunk()
    }
  }, { root: null, rootMargin: '160px', threshold: 0.1 })
  scrollObserver.observe(sentinelAnchor.value)
}

const injectMockData = () => {
  const isNuxtEnvironment = typeof window !== 'undefined' && '__NUXT__' in window
  if (!isNuxtEnvironment) {
    const mocks = []
    for (let i = 1; i <= 15; i++) {
      mocks.push({
        id: i,
        title: `MOCK - Publicación de la Red Universitaria RIESGIRD Tipo [${postType.value.toUpperCase()}] N° ${i}`,
        excerpt: 'Catálogo indexado con soporte para scroll infinito y carga por bloques asíncronos de alto rendimiento.',
        modality: i % 2 === 0 ? 'in_person' : 'virtual',
        start_date: '2026-07-16T05:00:00.000Z',
        featured_image_path: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400',
        slug: `slug-item-${i}`,
        type: postType.value,
      })
    }
    items.value = mocks
    isNoMoreRecords.value = false
  } else {
    items.value = []
  }
}

watch([postType], () => {
  fetchFeedFromFastify(false)
}, { immediate: true })

onMounted(() => {
  setTimeout(() => { initInfiniteScroll(); }, 200)
})

onUnmounted(() => {
  if (scrollObserver && sentinelAnchor.value) {
    scrollObserver.unobserve(sentinelAnchor.value)
    scrollObserver.disconnect()
  }
})
</script>
<template>
  <section class="feed-infinite-section">
    <div class="feed-infinite-shell">
      <div class="section-header-wrapper mb-10">
        <SectionTitle v-if="title" :title="title" />
        <p v-if="introText" class="feed-section-intro">
          {{ introText }}
        </p>
      </div>

      <div class="feed-responsive-cards-grid" v-if="items.length > 0">
        <article
          v-for="(item, index) in items"
          :key="item.id || index"
          class="feed-card-item animate-card-fade"
          :style="{ '--accent-line': getCardAccent(index) }"
        >
          <a :href="getDetailLink(item)" class="feed-card-link">
            <div class="card-top-row">
              <span class="badge-esan"><span>ESAN</span></span>
              <span class="badge-type">
                <span>
                  {{
                    item?.type === 'event'
                      ? 'Evento'
                      : item?.type === 'calls'
                        ? 'Convocatoria'
                        : item?.type === 'assemblies'
                          ? 'Asamblea'
                          : 'Noticia'
                  }}
                </span>
              </span>
            </div>

            <div class="container__content">
              <span class="card-top-meta-date-label">
                <i class="bi bi-calendar3 me-1"></i>
                {{ formatReadableDate(item?.start_date) }}
                <span class="meta-divider">|</span>
                <i class="bi" :class="item?.modality === 'in_person' ? 'bi-building' : 'bi-laptop'"></i>
                {{ item?.modality === 'in_person' ? 'Presencial' : 'Virtual' }}
              </span>

              <h3 class="card-core-headline-title" :title="item?.title || 'Sin título'">
                <span class="headline-text-span">
                  {{ item?.title || 'Sin título' }}
                </span>
              </h3>

              <p class="card-excerpt-description" v-if="item?.excerpt">
                {{ item.excerpt }}
              </p>
            </div>

            <div class="image-wrapper">
              <img
                v-if="item?.featured_image_path"
                :src="formatImageUrl(item.featured_image_path)"
                :alt="item?.title || 'Publicación'"
                class="card-img-cover"
              />
              <div v-else class="card-img-placeholder">
                Sin imagen
              </div>
            </div>
          </a>

          <div
            class="card-bottom-accent-hairline"
            :style="{ backgroundColor: getCardAccent(index) }"
          ></div>
        </article>
      </div>

      <div v-else class="feed-empty-fallback-box">
        <p>No se encontraron publicaciones vigentes bajo el filtro de este bloque.</p>
      </div>

      <div ref="sentinelAnchor" class="scroll-infinite-sentinel-zone">
        <div v-if="pending" class="sentinel-spinner-layout">
          <div class="spinner-loader-ring"></div>
          <span class="spinner-loader-text-label">Cargando lote de 10 elementos...</span>
        </div>
        <div v-if="isNoMoreRecords && items.length > 0" class="sentinel-end-text">
          ✨ Archivo completo desplegado.
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feed-infinite-section {
  width: 100%;
  padding: 48px 0;
  background-color: transparent;
  box-sizing: border-box;
}

.feed-infinite-shell {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: border-box;
}

.section-header-wrapper {
  width: 100%;
  text-align: center;
}

.feed-section-intro {
  max-width: 760px;
  margin: 14px auto 0;
  font-family: var(--font-bricolage) !important;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.45;
  color: #475569;
  text-align: center;
}

.feed-responsive-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 992px) {
  .feed-responsive-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .feed-responsive-cards-grid {
    grid-template-columns: 1fr;
  }
}

.feed-card-item {
  position: relative;
  min-width: 0;
  height: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
}

.feed-card-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

.feed-card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.05);
  border-color: #cbd5e1;
}

.feed-card-item:hover .headline-text-span {
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 22px;
  padding: 14px 14px 0;
  box-sizing: border-box;
}

.badge-esan,
.badge-type {
  width: 91px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-family: var(--font-bricolage);
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  flex: 0 0 91px;
  white-space: nowrap;
}

.badge-esan {
  background: #e1113f;
  color: #ffffff;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
}

.badge-type {
  position: relative;
  width: 91px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.badge-type::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  clip-path: polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%);
  pointer-events: none;
  z-index: 1;
}

.badge-type::after {
  content: "";
  position: absolute;
  inset: 1px;
  background: #ffffff;
  clip-path: polygon(9.5px 0, 100% 0, 100% 100%, 9.5px 100%, 0.5px 50%);
  pointer-events: none;
  z-index: 2;
}

.badge-type > span {
  position: relative;
  z-index: 3;
  font-family: var(--font-bricolage);
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.container__content {
  padding: 12px 14px 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.card-top-meta-date-label {
  font-family: var(--font-bricolage) !important;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  line-height: 1.2;
}

.meta-divider {
  margin: 0 8px;
  color: #e2e8f0;
}

.card-core-headline-title {
  margin: 0;
  font-size: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.headline-text-span {
  font-family: var(--font-bricolage) !important;
  font-weight: 700;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.card-excerpt-description {
  font-size: 0.85rem;
  font-weight: 400;
  color: #64748b;
  line-height: 1.45;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.image-wrapper {
  width: 100%;
  height: 154px;
  overflow: hidden;
  background: #f3f4f6;
  position: relative;
}

.card-img-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.card-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: #94a3b8;
  font-family: var(--font-bricolage);
  font-size: 12px;
  font-weight: 700;
}

.feed-card-item:hover .card-img-cover {
  transform: scale(1.03);
}

.card-bottom-accent-hairline {
  width: 100%;
  height: 3px;
  position: absolute;
  bottom: 0;
  left: 0;
}

.scroll-infinite-sentinel-zone {
  width: 100%;
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  box-sizing: border-box;
}

.sentinel-spinner-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.spinner-loader-ring {
  width: 26px;
  height: 26px;
  border: 2.5px solid #edf2f7;
  border-top-color: #e1113f;
  border-radius: 50%;
  animation: spinSentinelGrid 0.6s linear infinite;
}

@keyframes spinSentinelGrid {
  to {
    transform: rotate(360deg);
  }
}

.spinner-loader-text-label {
  font-family: var(--font-bricolage) !important;
  font-size: 0.82rem;
  font-weight: 700;
  color: #475569;
}

.sentinel-end-text {
  font-family: var(--font-bricolage) !important;
  font-size: 0.85rem;
  font-weight: 700;
  color: #94a3b8;
}

.animate-card-fade {
  animation: fadeInUpItem 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUpItem {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feed-empty-fallback-box {
  padding: 40px 20px;
  text-align: center;
  color: #94a3b8;
  font-family: var(--font-bricolage);
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
  background: #ffffff;
}

.mb-10 {
  margin-bottom: 40px;
}
</style>