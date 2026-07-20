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

const apiBaseUrl = apiConfig.PUBLIC_API_URL || 'http://localhost:4000/api/public/news'

const fetchFeedFromFastify = async (isAppendMode = false) => {
  if (pending.value) return
  pending.value = true

  if (!isAppendMode) {
    currentPage.value = 1
    items.value = []
    isNoMoreRecords.value = false
  }

  try {
    const url = `${apiBaseUrl}?page=${currentPage.value}&limit=${itemsPerPage}&type=${postType.value}`
    
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
          <div class="card-media-wrapper">
            <img :src="formatImageUrl(item.featured_image_path)" :alt="item.title" class="card-img-cover" />
            
            <div class="card-calendar-badge-box">
              <span class="calendar-day-text">{{ getCardDate(item.start_date).day }}</span>
              <span class="calendar-month-text">{{ getCardDate(item.start_date).month }}</span>
            </div>

            <span class="card-status-pill-badge" :style="{ backgroundColor: getCardAccent(index) }">
              {{ getStatusLabel(item) }}
            </span>
          </div>

          <div class="card-informative-contents">
            <span class="card-top-meta-date-label">
              <i class="bi bi-calendar3 me-1"></i> {{ formatReadableDate(item.start_date) }}
              <span class="meta-divider">|</span>
              <i class="bi" :class="item.modality === 'in_person' ? 'bi-building' : 'bi-laptop'"></i> 
              {{ item.modality === 'in_person' ? 'Presencial' : 'Virtual' }}
            </span>

            <h3 class="card-core-headline-title" :title="item.title">
              <span class="headline-text-span">{{ item.title }}</span>
            </h3>

            <p class="card-excerpt-description" v-if="item.excerpt">
              {{ item.excerpt }}
            </p>

            <div class="card-action-trigger-row">
              <a :href="getDetailLink(item)" class="card-hollow-anchor-btn">
                <span class="action-btn-label-text">Visualizar Contenido</span>
                <svg class="arrow-vector-svg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
          
          <div class="card-bottom-accent-hairline" :style="{ backgroundColor: getCardAccent(index) }"></div>
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
/* =========================================================================
   🎨 ARQUITECTURA GRÁFICA CONFIGURADA EN MÁXIMO RIGOR ESTÉTICO (1140PX)
   ========================================================================= */

.feed-infinite-section { width: 100%; padding: 48px 0; background-color: transparent; box-sizing: border-box; }
.feed-infinite-shell { width: 100%; max-width: 1140px; margin: 0 auto; padding: 0 16px; box-sizing: border-box; }
.section-header-wrapper { width: 100%; text-align: center; }

.feed-section-intro {
  max-width: 760px; margin: 14px auto 0; font-family: var(--font-bricolage) !important;
  font-size: 15px; font-weight: 400; line-height: 1.45; color: #475569; text-align: center;
}

/* Grilla Responsiva de 3 Columnas */
.feed-responsive-cards-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; width: 100%; box-sizing: border-box; }
@media (max-width: 992px) { .feed-responsive-cards-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .feed-responsive-cards-grid { grid-template-columns: 1fr; } }

.feed-card-item {
  background-color: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden;
  display: flex; flex-direction: column; box-sizing: border-box; position: relative;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
}
.feed-card-item:hover { transform: translateY(-4px); box-shadow: 0 16px 36px rgba(15, 23, 42, 0.05); border-color: #cbd5e1; }

.card-media-wrapper { position: relative; width: 100%; height: 180px; background-color: #f1f5f9; overflow: hidden; }
.card-img-cover { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.feed-card-item:hover .card-img-cover { transform: scale(1.03); }

/* Calendario Flotante con Borde y Número en Degradado (Fondo Blanco) */
.card-calendar-badge-box {
  position: absolute; top: 12px; left: 12px; width: 44px; height: 46px;
  background-color: #ffffff; border-radius: 8px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.04); z-index: 10; line-height: 1.1;
}
.card-calendar-badge-box::before {
  content: ""; position: absolute; inset: 0; border-radius: 8px; padding: 1.5px;
  background: linear-gradient(135deg, #e1113f 0%, #274e9d 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
}
.calendar-day-text {
  font-family: var(--font-bricolage) !important; font-size: 0.95rem; font-weight: 800;
  background: linear-gradient(135deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.calendar-month-text {
  font-family: var(--font-bricolage) !important; font-size: 0.62rem; font-weight: 700; color: #64748b; text-transform: uppercase;
}

.card-status-pill-badge {
  position: absolute; top: 12px; right: 12px; font-family: var(--font-bricolage) !important;
  font-size: 10px; font-weight: 700; color: #ffffff; padding: 3px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.3px; z-index: 10;
}

.card-informative-contents { padding: 20px; flex: 1; display: flex; flex-direction: column; text-align: left; box-sizing: border-box; }
.card-top-meta-date-label { font-family: var(--font-bricolage) !important; font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; }
.meta-divider { margin: 0 8px; color: #e2e8f0; }

/* Título con Degradado Continuo en Borde y Texto */
.card-core-headline-title {
  font-size: 1rem; line-height: 1.4; margin: 0 0 10px 0;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;
}
.headline-text-span {
  font-family: var(--font-bricolage) !important; font-weight: 700;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  display: inline-block;
}

.card-excerpt-description { font-size: 0.85rem; font-weight: 400; color: #64748b; line-height: 1.45; margin: 0 0 20px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-action-trigger-row { margin-top: auto; width: 100%; }

/* Botón Hollow Outline con Contorno Reactivo al Hover */
.card-hollow-anchor-btn {
  display: inline-flex; align-items: center; justify-content: space-between; width: 100%;
  padding: 10px 16px; border-radius: 8px; border: 1px solid #e2e8f0; background-color: #ffffff; text-decoration: none; color: #475569; transition: all 0.2s ease-in-out; box-sizing: border-box; position: relative;
}
.action-btn-label-text { font-family: var(--font-bricolage) !important; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
.arrow-vector-svg { width: 14px; height: 14px; color: #94a3b8; transition: transform 0.2s, color 0.2s; }

.feed-card-item:hover .card-hollow-anchor-btn {
  border-color: transparent !important;
  background: linear-gradient(90deg, var(--accent-line) 0%, var(--accent-line) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.feed-card-item:hover .card-hollow-anchor-btn::before {
  content: ""; position: absolute; inset: 0; border-radius: 8px; padding: 1.2px;
  background: linear-gradient(90deg, var(--accent-line) 0%, var(--accent-line) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
}
.feed-card-item:hover .arrow-vector-svg { transform: translateX(3px); color: #000000; }

.card-bottom-accent-hairline { width: 100%; height: 3px; position: absolute; bottom: 0; left: 0; }

.scroll-infinite-sentinel-zone { width: 100%; margin-top: 48px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50px; box-sizing: border-box; }
.sentinel-spinner-layout { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.spinner-loader-ring { width: 26px; height: 26px; border: 2.5px solid #edf2f7; border-top-color: #e1113f; border-radius: 50%; animation: spinSentinelGrid 0.6s linear infinite; }
@keyframes spinSentinelGrid { to { transform: rotate(360deg); } }
.spinner-loader-text-label { font-family: var(--font-bricolage) !important; font-size: 0.82rem; font-weight: 700; color: #475569; }
.sentinel-end-text { font-family: var(--font-bricolage) !important; font-size: 0.85rem; font-weight: 700; color: #94a3b8; }

.animate-card-fade { animation: fadeInUpItem 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUpItem { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.feed-empty-fallback-box { padding: 40px 20px; text-align: center; color: #94a3b8; font-family: var(--font-bricolage); }
.mb-10 { margin-bottom: 40px; }
</style>