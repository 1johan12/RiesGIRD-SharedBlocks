<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { formatImageUrl } from '@shared/helpers/url';

// ── 🧠 CONTRATOS DE INTERFACES ESTRICTAS DE TU API DE FASTIFY ──
export interface FastifyPostRecord {
  id: string | number;
  title: string;
  excerpt?: string;
  modality?: 'in_person' | 'virtual' | 'hybrid' | string;
  type: 'news' | 'event' | 'calls' | 'assemblies' | string;
  start_date?: string;
  created_at?: string;
  target_audience?: string;
  featured_image_path?: string;
  slug?: string;
  autor?: string;
  is_featured?: number | boolean;
}

export interface GridSectionConfig {
  id: string | number;
  title: string;
  postType: 'all' | 'news' | 'event' | 'calls' | 'assemblies';
  limit: number | string;
}

export interface HubMegasectionConfig {
  id?: string | number;
  showSlider?: boolean;
  sliderTitle?: string;
  grids?: GridSectionConfig[];
}

const props = defineProps<{
  data: HubMegasectionConfig | null
}>();

const showSlider = computed(() => props.data?.showSlider ?? true);
const sliderTitle = computed(() => props.data?.sliderTitle || 'Publicaciones Destacadas');
const dynamicGrids = computed(() => props.data?.grids || [
  { id: 'g1', title: 'Eventos y Actividades Próximas', postType: 'event', limit: 4 },
  { id: 'g2', title: 'Noticias y Novedades Editoriales', postType: 'news', limit: 4 }
]);

const items = ref<FastifyPostRecord[]>([]);
const pending = ref(false);
const searchQuery = ref('');
const currentSliderIndex = ref(0);

// Función base de Fetch (Utilizada por el Panel SPA Admin)
const fetchFeedFromFastify = async () => {
  pending.value = true;
  try {
    const url = `https://api.redgirdaccperu.edu.pe/api/public/news?limit=100`;
    const response = await fetch(url);
    if (response.ok) {
      const resData = await response.json();
      const records = resData?.data || resData || [];
      if (records.length > 0) {
        items.value = records;
      } else {
        injectMockData();
      }
    } else {
      injectMockData();
    }
  } catch (error) {
    console.error("Error consumiendo la API directa de Fastify:", error);
    injectMockData();
  } finally {
    pending.value = false;
  }
};

const injectMockData = () => {
  const isNuxtEnvironment = typeof window !== 'undefined' && '__NUXT__' in window;
  if (!isNuxtEnvironment) {
    const hace2Horas = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const hace3Dias = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

    items.value = [
      { id: 1, title: 'Convocatoria de Proyectos de Investigación Regional 2026', excerpt: 'Bases oficiales para la presentación de planes de contingencia territorial universitaria.', modality: 'hybrid', start_date: hace2Horas, created_at: hace2Horas, type: 'calls', is_featured: 1 },
      { id: 2, title: 'Conferencia Internacional sobre Gestión del Riesgo Climático', excerpt: 'Participación de ponentes internacionales en el auditorio de la Red.', modality: 'in_person', start_date: hace3Dias, created_at: hace3Dias, type: 'event', is_featured: 0 },
      { id: 3, title: 'Asamblea General Extraordinaria de Delegados y Rectores', excerpt: 'Sesión ordinaria virtual para la aprobación del nuevo reglamento unificado.', modality: 'virtual', start_date: hace2Horas, created_at: hace2Horas, type: 'assemblies', is_featured: 0 },
      { id: 4, title: 'Taller de Capacitación Especializado en Tecnologías Headless', excerpt: 'Desarrollo de habilidades en arquitecturas modernas con Fastify y Vue 3 SPA.', modality: 'virtual', start_date: hace2Horas, created_at: hace2Horas, type: 'news', is_featured: 0 }
    ];
  } else {
    items.value = [];
  }
};

/* * 🚀 ARQUITECTURA ISOMÓRFICA DEFENSIVA (MÁXIMO SEO + COMPATIBILIDAD SPA)
 * Aprovechamos los auto-imports globales de Nuxt para inyectar la data en el payload SSR
 * sin que explote el compilador de Vite en tu panel de administración.
 */
if (typeof (globalThis as any).useAsyncData === 'function') {
  // 🔥 ENTORNO NUXT (PÚBLICO): Forzamos bloqueo SSR para indexar contenido en Google
  const blockId = props.data?.id || 'static-hub';
  const { data: ssrRecords, pending: ssrPending } = (globalThis as any).useAsyncData(
    `megasection-feed-${blockId}`,
    async () => {
      const url = `https://api.redgirdaccperu.edu.pe/api/public/news?limit=100`;
      const response = await fetch(url);
      if (response.ok) {
        const resData = await response.json();
        return resData?.data || resData || [];
      }
      return [];
    }
  );

  // Sincronizamos de inmediato el estado rehidratado de Nuxt
  watch(ssrRecords, (newVal) => {
    if (newVal && newVal.length > 0) {
      items.value = newVal;
    } else {
      injectMockData();
    }
  }, { immediate: true });

  watch(ssrPending, (val) => { pending.value = val; }, { immediate: true });
} else {
  // 💻 ENTORNO VUE SPA (ADMIN CANVAS): Flujo reactivo en caliente tradicional de cliente
  watch(() => props.data, () => { fetchFeedFromFastify(); }, { deep: true, immediate: true });
}

// ── ⚙️ LOGICA DE FILTRADO Y PROCESAMIENTO (Mantenida intacta) ──
const sliderItems = computed(() => {
  const ahora = Date.now();
  const unDiaEnMilisegundos = 24 * 60 * 60 * 1000;

  return items.value.filter(post => {
    const esDestacado = post.is_featured === 1 || post.is_featured === true;
    const timestampCreacion = new Date(post.created_at || post.start_date || '').getTime();
    const esReciente24h = (ahora - timestampCreacion) <= unDiaEnMilisegundos;

    return esDestacado || esReciente24h;
  });
});

const getFilteredFeedForGrid = (postType: string, limitCount: number | string) => {
  const query = searchQuery.value.toLowerCase().trim();
  let baseFeed = items.value;

  if (postType !== 'all') {
    if (postType === 'event') {
      baseFeed = items.value.filter(p => p.type === 'event' || p.type === 'calls');
    } else {
      baseFeed = items.value.filter(p => p.type === postType);
    }
  }

  if (query) {
    baseFeed = baseFeed.filter(p => p.title.toLowerCase().includes(query) || p.excerpt?.toLowerCase().includes(query));
  }

  return baseFeed.slice(0, Number(limitCount));
};

const latestNewsSidebar = computed(() => {
  const ahora = Date.now();
  const unDiaEnMilisegundos = 24 * 60 * 60 * 1000000;

  return items.value.filter(post => {
    const esDestacado = post.is_featured === 1 || post.is_featured === true;
    const timestampCreacion = new Date(post.created_at || post.start_date || '').getTime();
    const esReciente24h = (ahora - timestampCreacion) <= unDiaEnMilisegundos;

    return esDestacado || esReciente24h;
  }).slice(0, 4);
});

const translateModality = (modality: string) => {
  const dictionary: Record<string, string> = { in_person: 'Presencial', virtual: 'Virtual', hybrid: 'Híbrido' };
  return dictionary[modality] || modality;
};

const translateType = (type: string) => {
  const dictionary: Record<string, string> = { news: 'Noticia', event: 'Evento', calls: 'Convocatoria', assemblies: 'Asamblea' };
  return dictionary[type] || type;
};

const getParsedDate = (dateString: string | undefined) => {
  if (!dateString) return { day: '24', month: 'Jun' };
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('es-ES', { month: 'short' }).replace('.', '');
  return { day, month };
};

const formatReadableDate = (dateString: string | undefined) => {
  if (!dateString) return 'Junio 2026';
  return new Date(dateString).toLocaleString('es-ES', { month: 'long', year: 'numeric' });
};

</script>

<template>
  <div class="megasection-hub-container select-none">

    <div class="grid-slider-master-container content-wrapper mb-12" v-if="showSlider && sliderItems.length > 0">
      <div class="slider-header-wrap">
        <h3 class="slider-block-indicator-title">
          <svg class="lightning-bolt-svg animate-flash" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {{ sliderTitle }}
        </h3>
      </div>

      <div class="relative-slider-viewport">
        <transition-group name="hub-slider-fade">
          <div v-for="(slide, sIdx) in sliderItems" v-show="currentSliderIndex === sIdx" :key="slide.id"
            class="slider-layout-split-track">
            <div class="slider-media-side">
              <img :src="formatImageUrl(slide.featured_image_path)" :alt="slide.title" class="slider-img-element">
              <span class="hot-badge-time">Destacado / Reciente</span>
            </div>
            <div class="slider-textual-side">
              <span class="badge-type-tag">{{ translateType(slide.type) }}</span>
              <h2 class="slider-title-core-text text-truncate-2">{{ slide.title }}</h2>
              <p class="slider-excerpt-core-paragraph text-truncate-3" v-if="slide.excerpt">{{ slide.excerpt }}</p>
              <div class="slider-bullets-strip">
                <button v-for="(_, dIdx) in sliderItems" :key="dIdx" @click="currentSliderIndex = dIdx"
                  class="bullet-dot-item" :class="{ 'bullet-active-node': currentSliderIndex === dIdx }"></button>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <div v-if="pending" class="py-5 text-center text-muted opacity-75">
      <span class="small fw-bold">Sincronizando feed de Fastify...</span>
    </div>

    <main v-else class="two-column-layout">
      <div class="left-column">
        <div v-for="grid in dynamicGrids" :key="grid.id" class="content-wrapper eventos-panel mb-12">
          <section class="eventos-section">
            <h2 class="section-title">{{ grid.title }}</h2>
            <div class="eventos-grid" v-if="getFilteredFeedForGrid(grid.postType, grid.limit).length > 0">
              <router-link v-for="(post, index) in getFilteredFeedForGrid(grid.postType, grid.limit)"
                :key="post.id || index"
                :to="'/' + (post.type == 'event' ? 'events' : post.type) + '/' + (post.slug || '')" class="evento-card">
                <div class="card-top-row">
                  <span class="badge-esan"><span>ESAN</span></span>
                  <span class="badge-type">
                    <span>{{ translateType(post.type) }}</span>
                  </span>
                </div>
                <div class="container__content">
                  <h3 class="info-title text-truncate-3" style="text-align: center;" :title="post.title">
                    {{ post.title }}
                  </h3>
                  <p class="info-subtitle text-truncate-2" style="text-align: center;" v-if="post.excerpt">
                    {{ post.excerpt }}
                  </p>
                </div>

                <div class="image-wrapper">
                  <img :src="formatImageUrl(post.featured_image_path)" :alt="post.title" class="evento-img" />
                </div>
              </router-link>
            </div>
            <div v-else class="text-center text-muted small py-4 bg-light rounded border border-dashed">
              No se encontraron registros activos para este canal.
            </div>
            <div class="section-footer">
              <router-link :to="'/' + (grid.postType === 'event' ? 'events' : grid.postType)" class="btn-grid-more">
                Buscar más sobre los Próximos Eventos
              </router-link>
            </div>
          </section>
        </div>
      </div>

      <aside class="right-column">
      <div class="sidebar-stack">

        <!-- 1. Últimas Novedades -->
        <section class="sidebar-box">
          <div class="sidebar-box__surface">
            <div class="sidebar-top-button">
              <span>Últimas Novedades</span>
            </div>

            <div class="sidebar-mini-cards-stack sidebar-mini-cards-stack--news" v-if="latestNewsSidebar.length > 0">
              <router-link
                v-for="link in latestNewsSidebar"
                :key="link.id"
                :to="'/' + (link.type == 'event' ? 'events' : link.type) + '/' + (link.slug || '')"
                class="sidebar-mini-card sidebar-mini-card--news"
              >
                <div class="mini-card-details mini-card-details--news">
                  <div class="card-top-row card-top-row--compact">
                    <span class="badge-esan badge-esan--sm"><span>ESAN</span></span>
                    <span class="badge-type2 badge-type--sm">
                      <span>{{ translateType(link.type) }}</span>
                    </span>
                  </div>

                  <h4 class="mini-card-title mini-card-title--news text-truncate-2" :title="link.title">
                    {{ link.title }}
                  </h4>

                  <p class="mini-card-time">Hace 8 horas</p>
                </div>

                <div class="mini-card-thumb mini-card-thumb--sm">
                  <img :src="formatImageUrl(link.featured_image_path)" :alt="link.title" class="mini-thumb-img">
                </div>
              </router-link>
            </div>

            <div v-else class="sidebar-empty-state">
              No hay novedades para mostrar.
            </div>
          </div>
        </section>

        <!-- 2. Buscar las últimas novedades -->
        <section class="sidebar-box">
          <div class="sidebar-box__surface">
            <div class="sidebar-top-button">
              <span>Busque las últimas novedades</span>
            </div>

            <div class="sidebar-search-wrap">
              <div class="sidebar-native-search-box sidebar-native-search-box--custom">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Buscar..."
                  class="search-input-field search-input-field--custom"
                >
              </div>
            </div>
          </div>
        </section>

        <!-- 3. Publique su Actividad -->
        <section class="sidebar-box">
          <div class="sidebar-box__surface sidebar-box__surface--publish">
            <div class="sidebar-publish-shell">
              <button type="button" class="sidebar-publish-button">
                Publique su Actividad
              </button>
            </div>
          </div>
        </section>

      </div>
    </aside>

    </main>
  </div>
</template>
<style scoped>
.megasection-hub-container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 40px 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.two-column-layout {
  width: 100%;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.left-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 📌 Columna Derecha Actualizada */
.right-column {
  width: 370px;
  max-width: 370px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  width: 100%;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
  box-sizing: border-box;
}

.content-wrapper.eventos-panel {
  width: min(100%, 752px);
  padding: 40px 38px;
  box-sizing: border-box;
}


/* ==========================================================================
   2. 🎯 MOTOR HORIZONTAL MINI-CARDS (SIDEBAR STACK)
   ========================================================================== */
.sidebar-mini-cards-stack {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.sidebar-mini-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  text-decoration: none;
  border-bottom: 1px solid #f1f5f9;
  box-sizing: border-box;
  transition: background-color 0.2s ease;
}

.sidebar-mini-card:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.sidebar-mini-card:first-child {
  padding-top: 4px;
}

.sidebar-mini-card:hover .mini-card-title {
  color: #db143c;
}

.mini-card-thumb {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8fafc;
  flex-shrink: 0;
  border: 1px solid #f1f5f9;
}

.mini-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mini-card-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
  overflow: hidden;
}

.mini-card-type-label {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Colores de etiquetas semánticas */
.mini-card-type-label.news {
  color: #db143c;
}

.mini-card-type-label.event {
  color: #25529a;
}

.mini-card-type-label.calls {
  color: #eab308;
}

.mini-card-type-label.assemblies {
  color: #653E9B;
}

.mini-card-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
  margin: 0;
}


/* ==========================================================================
   3. GRID SLIDER INTERNO MAESTRO
   ========================================================================== */
.grid-slider-master-container {
  background: #ffffff;
  border: 1px solid #e2e8f0;
}

.slider-header-wrap {
  margin-bottom: 20px;
  border-bottom: 1px dashed #cbd5e1;
  padding-bottom: 12px;
  text-align: left;
}

.slider-block-indicator-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.2px;
}

.lightning-bolt-svg {
  width: 18px;
  height: 18px;
  color: #db143c;
}

.relative-slider-viewport {
  position: relative;
  width: 100%;
  min-height: 180px;
  overflow: hidden;
}

.slider-layout-split-track {
  display: flex;
  gap: 24px;
  align-items: center;
  width: 100%;
  text-align: left;
}

.slider-media-side {
  flex: 40;
  position: relative;
  aspect-ratio: 16 / 9.5;
  border-radius: 10px;
  overflow: hidden;
  background-color: #f1f5f9;
}

.slider-img-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hot-badge-time {
  position: absolute;
  bottom: 8px;
  left: 8px;
  font-size: 8px;
  font-weight: 800;
  background: #db143c;
  color: #ffffff;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.slider-textual-side {
  flex: 60;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.badge-type-tag {
  background-color: #f1f5f9;
  color: #db143c;
  font-size: 9px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.slider-title-core-text {
  font-size: 1.2rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;
}

.slider-excerpt-core-paragraph {
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.45;
  margin: 0;
}

.slider-bullets-strip {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.bullet-dot-item {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #cbd5e1;
  border: none;
  cursor: pointer;
  padding: 0;
}

.bullet-active-node {
  background-color: #25529a;
  width: 15px;
  border-radius: 4px;
}


/* ==========================================================================
   4. SECCIÓN NUEVA DE EVENTOS (SCROLL HORIZONTAL Y TARJETAS ACTUALIZADAS)
   ========================================================================== */
.eventos-section {
  width: 100%;
  text-align: left;
  box-sizing: border-box;
}

.title-link {
  text-decoration: none;
  display: inline-block;
  width: 100%;
  text-align: left;
}

.section-title {
  position: relative;
  display: inline-block;
  margin: 0 0 32px;
  padding-bottom: 8px;
  font-family: var(--font-bricolage);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.1;
  color: #000000;
  letter-spacing: -0.02em;
}

.section-title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
}

.eventos-grid {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 18px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 6px 2px 14px;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  scrollbar-width: thin;
  scrollbar-color: #e1113f #e9edf7;
  scrollbar-gutter: stable;
}

/* Custom Scrollbar */
.eventos-grid::-webkit-scrollbar {
  height: 10px;
}

.eventos-grid::-webkit-scrollbar-track {
  background: #e9edf7;
  border-radius: 999px;
}

.eventos-grid::-webkit-scrollbar-thumb {
  border-radius: 999px;
  border: 2px solid #e9edf7;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
}

.eventos-grid::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}

.evento-card {
  flex: 0 0 268px;
  width: 268px;
  height: 308px;
  padding: 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 8px;
  background: #ffffff;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  scroll-snap-align: start;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  justify-content: space-between;
}

.evento-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 14px rgba(0, 0, 0, 0.18);
}

.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 22px;
}

/* Elementos de Insignias / Badges */
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

/* CAPA BASE (Atrás) */
.badge-type::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  clip-path: polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%);
  pointer-events: none;
  z-index: 1;
}

/* CAPA RELLENO (Adelante) */
.badge-type::after {
  content: "";
  position: absolute;
  inset: 1px;
  background: #ffffff;
  clip-path: polygon(9.5px 0, 100% 0, 100% 100%, 9.5px 100%, 0.5px 50%);
  pointer-events: none;
  z-index: 2;
}

/* TEXTO CON DEGRADADO */
.badge-type>span {
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


/* inicio de rectuangulo derecho */
.badge-type2 {
  width: 91px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-family: var(--font-bricolage);
  font-size: 8px;
  font-weight: 600;
  line-height: 1;
  flex: 0 0 91px;
  white-space: nowrap;
}
.badge-type2 {
  position: relative;
  width: 91px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.badge-type2::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  clip-path: polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%);
  pointer-events: none;
  z-index: 1;
}

.badge-type2::after {
  content: "";
  position: absolute;
  inset: 1px;
  background: #ffffff;
  clip-path: polygon(9.5px 0, 100% 0, 100% 100%, 9.5px 100%, 0.5px 50%);
  pointer-events: none;
  z-index: 2;
}

.badge-type2>span {
  position: relative;
  z-index: 3;
  font-family: var(--font-bricolage);
  font-size: 8px;
  font-weight: 600;
  line-height: 1;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
/* fin de rectangulo derecho */

/* Elementos de Información Interna */
.info-title {
  margin: 0;
  font-family: var(--font-bricolage);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.15;
  color: #000000;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.info-subtitle {
  margin: 0;
  font-family: var(--font-bricolage);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.45;
  color: #999999;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.image-wrapper {
  width: 100%;
  min-width: 224px;
  height: 154px;
  overflow: hidden;
  border-radius: 4px;
  background: #f3f4f6;
}

.evento-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.section-footer {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}

.btn-grid-more {
  width: min(100%, 376px);
  height: 45px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  color: #ffffff;
  text-decoration: none;
  font-family: var(--font-bricolage);
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  box-shadow: 0 4px 12px rgba(17, 17, 17, 0.12);
  padding: 0 18px;
  box-sizing: border-box;
  text-align: center;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.btn-grid-more:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(17, 17, 17, 0.16);
  opacity: 0.98;
}


/* ==========================================================================
   5. COMPONENTES EXTRA PRESERVADOS (WIDGETS, UTILITIES Y ANIMACIONES)
   ========================================================================== */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mb-12 {
  margin-bottom: 32px;
}

.mt-4 {
  margin-top: 16px;
}

.text-decoration-none {
  text-decoration: none;
}

/* Sidebar Componentes Nativos */
.sidebar-widget-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 0 0 16px 0;
  text-align: left;
}

.sidebar-native-search-box {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  background-color: #f8fafc;
}

.search-input-field {
  width: 100%;
  border: none;
  outline: none;
  font-size: 0.82rem;
  color: #64748b;
  background: transparent;
}

.search-icon-svg {
  width: 16px;
  height: 16px;
  color: #25529a;
  flex-shrink: 0;
  margin-left: auto;
}

.bg-cta-gradient {
  background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
  border-color: #e2e8f0;
  padding: 32px;
}

.cta-cloud-icon {
  width: 38px;
  height: 38px;
  color: #25529a;
  display: block;
  margin: 0 auto;
}

.fw-bold-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #000000;
  margin: 6px 0 2px 0;
}

.x-small-desc {
  font-size: 0.78rem;
  line-height: 1.4;
  margin: 0;
}

/* Transiciones & Animaciones */
.hub-slider-fade-enter-active,
.hub-slider-fade-leave-active {
  transition: opacity 0.4s ease-in-out;
  position: absolute;
  width: 100%;
}

.hub-slider-fade-enter-from,
.hub-slider-fade-leave-to {
  opacity: 0;
}

@keyframes flashIcon {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.animate-flash {
  animation: flashIcon 2s infinite;
}


/* ==========================================================================
   6. 🚀 NUEVOS COMPONENTES DEL SIDEBAR AÑADIDOS
   ========================================================================== */
.sidebar-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.sidebar-box {
  width: 100%;
  background: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 12px;
}

.sidebar-box__surface {
  width: 100%;
  background: #f5f7ff;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 14px 18px 18px;
}

.sidebar-box__surface--publish {
  padding: 16px 18px;
}

.sidebar-top-button {
  width: 280px;
  height: 48px;
  margin: 0 auto;
  border-radius: 8px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.sidebar-top-button span {
  font-family: var(--font-bricolage);
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-thickness: 1px;
  line-height: 1;
  text-align: center;
}

.sidebar-mini-cards-stack--news {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
}

.sidebar-mini-card--news {
  width: 293px;
  min-height: 107px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 13px 10px 10px 12px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  box-shadow: none;
  border: none;
  overflow: hidden;
}

.mini-card-details--news {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 7px;
  padding-top: 1px;
}

.card-top-row--compact {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  min-height: 14px;
}

.badge-esan--sm,
.badge-type--sm {
  width: 59px;
  height: 14px;
  flex: 0 0 59px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-family: var(--font-bricolage);
  font-size: 8px !important;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.badge-esan--sm {
  background: #e1113f;
  color: #ffffff;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%);
}

.badge-type--sm {
  position: relative;
  background: #ffffff;
}

.badge-type--sm::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  clip-path: polygon(7px 0, 100% 0, 100% 100%, 7px 100%, 0 50%);
  pointer-events: none;
  z-index: 1;
}

.badge-type--sm::after {
  content: "";
  position: absolute;
  inset: 1px;
  background: #ffffff;
  clip-path: polygon(6px 0, 100% 0, 100% 100%, 6px 100%, 0.5px 50%);
  pointer-events: none;
  z-index: 2;
}

.badge-type--sm > span {
  position: relative;
  z-index: 3;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.mini-card-title--news {
  margin: 0;
  font-family: var(--font-bricolage);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  color: #000000;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mini-card-time {
  margin: 0;
  font-family: var(--font-bricolage);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  color: #999999;
}

.mini-card-thumb--sm {
  width: 70px;
  height: 70px;
  flex: 0 0 70px;
  border-radius: 4px;
  overflow: hidden;
  background: #e9edf7;
}

.sidebar-empty-state {
  margin-top: 15px;
  width: 293px;
  margin-left: auto;
  margin-right: auto;
  min-height: 107px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999999;
  font-family: var(--font-bricolage);
  font-size: 12px;
  text-align: center;
  padding: 12px;
  box-sizing: border-box;
}

.sidebar-search-wrap {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.sidebar-native-search-box--custom {
  width: 293px;
  height: 48px;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.search-input-field--custom {
  width: 269px;
  height: 36px;
  border: none;
  outline: none;
  background: #f2f2f2;
  border-radius: 8px;
  padding: 0 14px;
  box-sizing: border-box;
  font-family: var(--font-bricolage);
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  text-align: center;
}

.search-input-field--custom::placeholder {
  color: #bcbcbc;
  text-align: center;
}

.sidebar-publish-shell {
  width: 293px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 18px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sidebar-publish-button {
  width: 269px;
  height: 42px;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 8px;
  background:
    linear-gradient(#ffffff, #ffffff) padding-box,
    linear-gradient(90deg, #e1113f 0%, #274e9d 100%) border-box;
  font-family: var(--font-bricolage);
  font-size: 16px;
  font-weight: 400;
  color: transparent;
  -webkit-background-clip: padding-box, border-box;
  background-clip: padding-box, border-box;
  background-image: linear-gradient(#ffffff, #ffffff), linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  background-origin: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  position: relative;
}

.sidebar-publish-button::before {
  content: "Publique su Actividad";
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-bricolage);
  font-size: 16px;
  font-weight: 400;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}


/* ==========================================================================
   7. 📱 RESPONSIVO NATIVO INTEGRADO (MEDIA QUERIES)
   ========================================================================== */
@media (max-width: 1024px) {
  .two-column-layout {
    flex-direction: column;
  }

  .right-column {
    width: 100%;
    max-width: 100%;
    position: static;
  }

  .sidebar-box {
    width: 100%;
  }

  .sidebar-box__surface,
  .sidebar-native-search-box--custom,
  .sidebar-publish-shell,
  .sidebar-empty-state {
    width: 100%;
  }

  .sidebar-mini-card--news {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .slider-layout-split-track {
    flex-direction: column;
    text-align: center;
  }

  .slider-textual-side {
    align-items: center;
  }
}

@media (max-width: 480px) {
  .sidebar-box {
    padding: 10px;
  }

  .sidebar-box__surface {
    padding: 12px;
  }

  .sidebar-top-button {
    width: 100%;
  }

  .sidebar-native-search-box--custom {
    padding: 0 10px;
  }

  .search-input-field--custom {
    width: 100%;
  }

  .sidebar-publish-shell {
    width: 100%;
  }
}
</style>