<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { formatImageUrl } from '../../../../helpers/url';
import { getPublicApiUrl } from '../../../../config/apiConfig';
import { getPostDetailRoute, sanitizeHref } from '../../../../helpers/sanitize';

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
  category?: { id: number; name: string } | null;
}

export interface GridSectionConfig {
  id: string | number;
  title: string;
  postType: 'all' | 'news' | 'event' | 'calls' | 'assemblies';
  limit: number | string;
  showMoreLink?: boolean;
  moreLinkLabel?: string;
  moreLinkUrl?: string;
}

export interface HubMegasectionConfig {
  id?: string | number;
  showSlider?: boolean;
  sliderTitle?: string;
  badgeLabel?: string;
  showPublishButton?: boolean;
  publishButtonLabel?: string;
  publishButtonUrl?: string;
  grids?: GridSectionConfig[];
}

const props = defineProps<{
  data: HubMegasectionConfig | null;
}>();

const showSlider = computed(() => props.data?.showSlider ?? true);
const sliderTitle = computed(() => String(props.data?.sliderTitle || '').trim() || 'Publicaciones Destacadas');
const badgeLabel = computed(() => String(props.data?.badgeLabel || '').trim());
const showPublishButton = computed(() => Boolean(props.data?.showPublishButton));
const publishButtonLabel = computed(() => String(props.data?.publishButtonLabel || '').trim() || 'Publique su Actividad');
const publishButtonHref = computed(() => sanitizeHref(props.data?.publishButtonUrl, ''));

const defaultGrids: GridSectionConfig[] = [
  { id: 'g1', title: 'Eventos y Actividades Próximas', postType: 'event', limit: 4, showMoreLink: false, moreLinkLabel: 'Ver más publicaciones', moreLinkUrl: '' },
  { id: 'g2', title: 'Noticias y Novedades Editoriales', postType: 'news', limit: 4, showMoreLink: false, moreLinkLabel: 'Ver más publicaciones', moreLinkUrl: '' },
];

const dynamicGrids = computed(() =>
  Array.isArray(props.data?.grids) && props.data.grids.length > 0 ? props.data.grids : defaultGrids
);

const items = ref<FastifyPostRecord[]>([]);
const pending = ref(false);
const searchQuery = ref('');
const currentSliderIndex = ref(0);

const isInternalRoute = (href: string): boolean => href.startsWith('/');

const loadFeedRecords = async (): Promise<FastifyPostRecord[]> => {
  const apiBase = getPublicApiUrl();
  const baseResponse = await fetch(`${apiBase}/news?limit=100`);
  if (!baseResponse.ok) return [];

  const baseJson = await baseResponse.json();
  const records: FastifyPostRecord[] = Array.isArray(baseJson?.data)
    ? baseJson.data
    : Array.isArray(baseJson)
      ? baseJson
      : [];

  // Si hay >=100 registros globales y alguna grilla pide un tipo sin presencia, consultamos ese tipo puntual
  if (records.length >= 100) {
    const requestedTypes = [...new Set(dynamicGrids.value.map((g) => g.postType).filter((t) => t && t !== 'all'))];
    const missingTypes = requestedTypes.filter((t) => !records.some((r) => r.type === t));

    if (missingTypes.length > 0) {
      const extraBatches = await Promise.all(
        missingTypes.map(async (type) => {
          try {
            const resp = await fetch(`${apiBase}/news?limit=24&type=${encodeURIComponent(type)}`);
            if (!resp.ok) return [];
            const json = await resp.json();
            return Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
          } catch {
            return [];
          }
        })
      );
      const seenIds = new Set(records.map((r) => String(r.id)));
      for (const batch of extraBatches) {
        for (const row of batch) {
          if (!seenIds.has(String(row.id))) {
            seenIds.add(String(row.id));
            records.push(row);
          }
        }
      }
    }
  }

  return records;
};

const injectMockData = () => {
  const isNuxtEnvironment =
    typeof (globalThis as any).useNuxtApp === 'function' ||
    (typeof window !== 'undefined' && ('__NUXT__' in window || 'NUXT' in window));

  if (!isNuxtEnvironment) {
    const hace2Horas = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const hace3Dias = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

    items.value = [
      { id: 1, slug: 'convocatoria-investigacion-regional-2026', title: 'Convocatoria de Proyectos de Investigación Regional 2026', excerpt: 'Bases oficiales para la presentación de planes de contingencia territorial universitaria.', modality: 'hybrid', start_date: hace2Horas, created_at: hace2Horas, type: 'calls', is_featured: 1, category: { id: 1, name: 'RiesGIRD' } },
      { id: 2, slug: 'conferencia-internacional-riesgo-climatico', title: 'Conferencia Internacional sobre Gestión del Riesgo Climático', excerpt: 'Participación de ponentes internacionales en el auditorio de la Red.', modality: 'in_person', start_date: hace3Dias, created_at: hace3Dias, type: 'event', is_featured: 0, category: { id: 1, name: 'RiesGIRD' } },
      { id: 3, slug: 'asamblea-general-delegados-rectores', title: 'Asamblea General Extraordinaria de Delegados y Rectores', excerpt: 'Sesión ordinaria virtual para la aprobación del nuevo reglamento unificado.', modality: 'virtual', start_date: hace2Horas, created_at: hace2Horas, type: 'assemblies', is_featured: 0, category: { id: 1, name: 'RiesGIRD' } },
      { id: 4, slug: 'taller-capacitacion-gestion-territorial', title: 'Taller de Capacitación Especializado en Gestión Territorial', excerpt: 'Desarrollo de capacidades para nodos universitarios regionales.', modality: 'virtual', start_date: hace2Horas, created_at: hace2Horas, type: 'news', is_featured: 0, category: { id: 1, name: 'RiesGIRD' } },
    ];
  } else {
    items.value = [];
  }
};

const fetchFeedFromFastify = async () => {
  pending.value = true;
  try {
    const records = await loadFeedRecords();
    if (records.length > 0) {
      items.value = records;
    } else {
      injectMockData();
    }
  } catch (error) {
    console.error('Error consumiendo la API pública de Fastify:', error);
    injectMockData();
  } finally {
    pending.value = false;
  }
};

if (typeof (globalThis as any).useAsyncData === 'function') {
  const { data: ssrRecords, pending: ssrPending } = (globalThis as any).useAsyncData(
    () => `megasection-feed-${props.data?.id || 'hub'}`,
    async () => {
      try {
        return await loadFeedRecords();
      } catch {
        return [];
      }
    }
  );

  watch(
    ssrRecords,
    (newVal) => {
      if (Array.isArray(newVal) && newVal.length > 0) {
        items.value = newVal;
      } else {
        injectMockData();
      }
    },
    { immediate: true }
  );

  watch(ssrPending, (val) => {
    pending.value = Boolean(val);
  }, { immediate: true });
} else {
  fetchFeedFromFastify();
}

const isRecentPastTimestamp = (dateStr: string | undefined, windowMs: number, now: number): boolean => {
  if (!dateStr) return false;
  const ts = new Date(dateStr).getTime();
  return !Number.isNaN(ts) && ts <= now && now - ts <= windowMs;
};

const sliderItems = computed(() => {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const highlighted = items.value.filter(
    (post) =>
      post.is_featured === 1 ||
      post.is_featured === true ||
      isRecentPastTimestamp(post.created_at || post.start_date, oneDayMs, now)
  );

  return (highlighted.length > 0 ? highlighted : items.value).slice(0, 5);
});

watch(sliderItems, (list) => {
  if (list.length === 0 || currentSliderIndex.value >= list.length) {
    currentSliderIndex.value = 0;
  }
});

const prevSlide = () => {
  if (sliderItems.value.length <= 1) return;
  currentSliderIndex.value =
    (currentSliderIndex.value - 1 + sliderItems.value.length) % sliderItems.value.length;
};

const nextSlide = () => {
  if (sliderItems.value.length <= 1) return;
  currentSliderIndex.value = (currentSliderIndex.value + 1) % sliderItems.value.length;
};

const getFilteredFeedForGrid = (postType: string, limitCount: number | string) => {
  const query = searchQuery.value.toLowerCase().trim();
  const rawLimit = Number(limitCount);
  const safeLimit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : 4;

  let baseFeed = postType && postType !== 'all'
    ? items.value.filter((p) => p.type === postType)
    : items.value;

  if (query) {
    baseFeed = baseFeed.filter(
      (p) =>
        String(p.title || '').toLowerCase().includes(query) ||
        String(p.excerpt || '').toLowerCase().includes(query) ||
        String(p.category?.name || '').toLowerCase().includes(query)
    );
  }

  return baseFeed.slice(0, safeLimit);
};

const latestNewsSidebar = computed(() => {
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  const recentOrFeatured = items.value.filter(
    (post) =>
      post.is_featured === 1 ||
      post.is_featured === true ||
      isRecentPastTimestamp(post.created_at || post.start_date, sevenDaysMs, now)
  );

  return (recentOrFeatured.length > 0 ? recentOrFeatured : items.value).slice(0, 4);
});

const translateType = (type: string) => {
  const dictionary: Record<string, string> = {
    news: 'Noticia',
    event: 'Evento',
    calls: 'Convocatoria',
    assemblies: 'Asamblea',
  };
  return dictionary[type] || type;
};

const getBadgePrimaryLabel = (post: FastifyPostRecord): string =>
  badgeLabel.value || post.category?.name || 'RiesGIRD';

const getGridMoreHref = (grid: GridSectionConfig): string =>
  grid.showMoreLink ? sanitizeHref(grid.moreLinkUrl, '') : '';

const formatSidebarDate = (dateString: string | undefined) => {
  if (!dateString) return 'Reciente';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'Reciente';
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
};
</script>

<template>
  <div class="megasection-hub-container select-none">

    <div class="grid-slider-master-container content-wrapper mb-12" v-if="showSlider && sliderItems.length > 0">
      <div class="slider-header-wrap">
        <h3 class="slider-block-indicator-title">
          <svg class="lightning-bolt-svg animate-flash" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {{ sliderTitle }}
        </h3>
        <div class="slider-nav-arrows" v-if="sliderItems.length > 1">
          <button type="button" class="slider-arrow-btn" aria-label="Publicación anterior" @click="prevSlide">
            <i class="bi bi-chevron-left" aria-hidden="true"></i>
          </button>
          <button type="button" class="slider-arrow-btn" aria-label="Siguiente publicación" @click="nextSlide">
            <i class="bi bi-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div class="relative-slider-viewport">
        <transition-group name="hub-slider-fade">
          <div
            v-for="(slide, sIdx) in sliderItems"
            v-show="currentSliderIndex === sIdx"
            :key="slide.id"
            class="slider-slide-item"
          >
            <router-link :to="getPostDetailRoute(slide)" class="slider-layout-split-track slider-card-link">
              <div class="slider-media-side">
                <img
                  v-if="slide.featured_image_path"
                  :src="formatImageUrl(slide.featured_image_path)"
                  :alt="slide.title"
                  loading="lazy"
                  decoding="async"
                  class="slider-img-element"
                >
                <div v-else class="media-empty-placeholder">
                  <i class="bi bi-image" aria-hidden="true"></i>
                </div>
                <span class="hot-badge-time">
                  {{ slide.is_featured === 1 || slide.is_featured === true ? 'Destacado' : 'Reciente' }}
                </span>
              </div>
              <div class="slider-textual-side">
                <span class="badge-type-tag">{{ translateType(slide.type) }}</span>
                <h2 class="slider-title-core-text text-truncate-2">{{ slide.title }}</h2>
                <p class="slider-excerpt-core-paragraph text-truncate-3" v-if="slide.excerpt">{{ slide.excerpt }}</p>
                <span class="slider-read-more">Leer publicación &rarr;</span>
              </div>
            </router-link>
          </div>
        </transition-group>
      </div>

      <div class="slider-bullets-strip" v-if="sliderItems.length > 1">
        <button
          v-for="(slide, dIdx) in sliderItems"
          :key="`dot-${slide.id || dIdx}`"
          type="button"
          :aria-label="`Ir a publicación ${dIdx + 1}`"
          @click="currentSliderIndex = dIdx"
          class="bullet-dot-item"
          :class="{ 'bullet-active-node': currentSliderIndex === dIdx }"
        ></button>
      </div>
    </div>

    <div v-if="pending" class="py-5 text-center text-muted opacity-75">
      <span class="small fw-bold">Sincronizando publicaciones...</span>
    </div>

    <main v-else class="two-column-layout">
      <div class="left-column">
        <div v-for="grid in dynamicGrids" :key="grid.id" class="content-wrapper eventos-panel mb-12">
          <section class="eventos-section">
            <h2 class="section-title">{{ grid.title }}</h2>
            <div class="eventos-grid" v-if="getFilteredFeedForGrid(grid.postType, grid.limit).length > 0">
              <router-link
                v-for="(post, index) in getFilteredFeedForGrid(grid.postType, grid.limit)"
                :key="post.id || index"
                :to="getPostDetailRoute(post)"
                class="evento-card"
              >
                <div class="card-top-row">
                  <span class="badge-esan" :title="getBadgePrimaryLabel(post)">
                    <span>{{ getBadgePrimaryLabel(post) }}</span>
                  </span>
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
                  <img
                    v-if="post.featured_image_path"
                    :src="formatImageUrl(post.featured_image_path)"
                    :alt="post.title"
                    loading="lazy"
                    decoding="async"
                    class="evento-img"
                  />
                  <div v-else class="media-empty-placeholder">
                    <i class="bi bi-image" aria-hidden="true"></i>
                  </div>
                </div>
              </router-link>
            </div>
            <div v-else class="text-center text-muted small py-4 bg-light rounded border border-dashed">
              {{ searchQuery.trim()
                ? `No se encontraron resultados para "${searchQuery.trim()}".`
                : 'No se encontraron registros activos para este canal.' }}
            </div>

            <div class="section-footer" v-if="getGridMoreHref(grid)">
              <router-link
                v-if="isInternalRoute(getGridMoreHref(grid))"
                :to="getGridMoreHref(grid)"
                class="btn-grid-more"
              >
                {{ grid.moreLinkLabel || 'Ver más publicaciones' }}
              </router-link>
              <a
                v-else
                :href="getGridMoreHref(grid)"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-grid-more"
              >
                {{ grid.moreLinkLabel || 'Ver más publicaciones' }}
              </a>
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
                  :to="getPostDetailRoute(link)"
                  class="sidebar-mini-card sidebar-mini-card--news"
                >
                  <div class="mini-card-details mini-card-details--news">
                    <div class="card-top-row card-top-row--compact">
                      <span class="badge-esan badge-esan--sm" :title="getBadgePrimaryLabel(link)">
                        <span>{{ getBadgePrimaryLabel(link) }}</span>
                      </span>
                      <span class="badge-type2 badge-type--sm">
                        <span>{{ translateType(link.type) }}</span>
                      </span>
                    </div>

                    <h4 class="mini-card-title mini-card-title--news text-truncate-2" :title="link.title">
                      {{ link.title }}
                    </h4>

                    <p class="mini-card-time">{{ formatSidebarDate(link.start_date || link.created_at) }}</p>
                  </div>

                  <div class="mini-card-thumb mini-card-thumb--sm">
                    <img
                      v-if="link.featured_image_path"
                      :src="formatImageUrl(link.featured_image_path)"
                      :alt="link.title"
                      loading="lazy"
                      decoding="async"
                      class="mini-thumb-img"
                    >
                    <div v-else class="media-empty-placeholder media-empty-placeholder--sm">
                      <i class="bi bi-image" aria-hidden="true"></i>
                    </div>
                  </div>
                </router-link>
              </div>

              <div v-else class="sidebar-empty-state">
                No hay novedades para mostrar.
              </div>
            </div>
          </section>

          <!-- 2. Buscador en tiempo real -->
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
                    aria-label="Buscar publicaciones"
                    class="search-input-field search-input-field--custom"
                  >
                  <button
                    v-if="searchQuery"
                    type="button"
                    class="search-clear-btn"
                    aria-label="Limpiar búsqueda"
                    @click="searchQuery = ''"
                  >
                    &times;
                  </button>
                  <svg v-else class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <!-- 3. Botón CTA opcional ("Publique su Actividad") -->
          <section class="sidebar-box" v-if="showPublishButton && publishButtonHref">
            <div class="sidebar-box__surface sidebar-box__surface--publish">
              <div class="sidebar-publish-shell">
                <router-link
                  v-if="isInternalRoute(publishButtonHref)"
                  :to="publishButtonHref"
                  class="sidebar-publish-button"
                >
                  <span>{{ publishButtonLabel }}</span>
                </router-link>
                <a
                  v-else
                  :href="publishButtonHref"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="sidebar-publish-button"
                >
                  <span>{{ publishButtonLabel }}</span>
                </a>
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

.media-empty-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #94a3b8;
  font-size: 28px;
}

.media-empty-placeholder--sm {
  font-size: 20px;
}

/* ==========================================================================
   MINI-CARDS SIDEBAR
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

.sidebar-mini-card:hover .mini-card-title {
  color: #db143c;
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

.mini-card-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
  margin: 0;
}

/* ==========================================================================
   GRID SLIDER INTERNO MAESTRO
   ========================================================================== */
.grid-slider-master-container {
  background: #ffffff;
  border: 1px solid #e2e8f0;
}

.slider-header-wrap {
  margin-bottom: 20px;
  border-bottom: 1px dashed #cbd5e1;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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

.slider-nav-arrows {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.slider-arrow-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #1e293b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.slider-arrow-btn:hover {
  background: #274e9d;
  border-color: #274e9d;
  color: #ffffff;
}

.lightning-bolt-svg {
  width: 18px;
  height: 18px;
  color: #db143c;
  flex-shrink: 0;
}

.relative-slider-viewport {
  position: relative;
  width: 100%;
  min-height: 180px;
  overflow: hidden;
}

.slider-slide-item {
  width: 100%;
}

.slider-card-link {
  text-decoration: none;
  color: inherit;
}

.slider-card-link:hover .slider-title-core-text {
  color: #274e9d;
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
  transition: color 0.2s ease;
}

.slider-excerpt-core-paragraph {
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.45;
  margin: 0;
}

.slider-read-more {
  font-size: 0.8rem;
  font-weight: 700;
  color: #274e9d;
}

.slider-bullets-strip {
  display: flex;
  gap: 6px;
  margin-top: 14px;
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
   SECCIÓN EVENTOS (SCROLL HORIZONTAL Y TARJETAS)
   ========================================================================== */
.eventos-section {
  width: 100%;
  text-align: left;
  box-sizing: border-box;
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

.badge-esan,
.badge-type {
  min-width: 91px;
  max-width: 120px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-family: var(--font-bricolage);
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.badge-esan {
  background: #e1113f;
  color: #ffffff;
  padding: 0 12px 0 8px;
  overflow: hidden;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
}

.badge-esan > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  max-width: 100%;
}

.badge-type {
  position: relative;
  width: 91px;
  flex: 0 0 91px;
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
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.badge-type2 {
  position: relative;
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

.badge-type2 > span {
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
  min-width: 0;
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
  margin-left: 8px;
}

.search-clear-btn {
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
  margin-left: 4px;
}

.search-clear-btn:hover {
  color: #e1113f;
}

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
   SIDEBAR
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
  width: 100%;
  max-width: 280px;
  height: 48px;
  margin: 0 auto;
  border-radius: 8px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 12px;
}

.sidebar-top-button span {
  font-family: var(--font-bricolage);
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-thickness: 1px;
  line-height: 1.1;
  text-align: center;
}

.sidebar-mini-cards-stack--news {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
}

.sidebar-mini-card--news {
  width: 100%;
  max-width: 293px;
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
  min-width: 59px;
  max-width: 82px;
  height: 14px;
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
  padding: 0 9px 0 5px;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%);
}

.badge-type--sm {
  width: 59px;
  flex: 0 0 59px;
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
  width: 100%;
  max-width: 293px;
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
  width: 100%;
  max-width: 293px;
  height: 48px;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.search-input-field--custom {
  width: 100%;
  height: 36px;
  border: none;
  outline: none;
  background: #f2f2f2;
  border-radius: 8px;
  padding: 0 14px;
  box-sizing: border-box;
  font-family: var(--font-bricolage);
  font-size: 15px;
  font-weight: 400;
  color: #000000;
  text-align: left;
}

.search-input-field--custom::placeholder {
  color: #94a3b8;
}

.sidebar-publish-shell {
  width: 100%;
  max-width: 293px;
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
  width: 100%;
  max-width: 269px;
  height: 42px;
  border: 1px solid transparent;
  border-radius: 8px;
  background:
    linear-gradient(#ffffff, #ffffff) padding-box,
    linear-gradient(90deg, #e1113f 0%, #274e9d 100%) border-box;
  font-family: var(--font-bricolage);
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 12px;
  box-sizing: border-box;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.sidebar-publish-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(39, 78, 157, 0.14);
}

.sidebar-publish-button > span {
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ==========================================================================
   RESPONSIVO
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

  .sidebar-box,
  .sidebar-box__surface,
  .sidebar-native-search-box--custom,
  .sidebar-publish-shell,
  .sidebar-empty-state,
  .sidebar-mini-card--news {
    max-width: 100%;
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
  .content-wrapper {
    padding: 20px 16px;
  }

  .content-wrapper.eventos-panel {
    padding: 20px 16px;
  }

  .evento-card {
    flex: 0 0 min(268px, 100%);
    width: min(268px, 100%);
  }

  .sidebar-box {
    padding: 10px;
  }

  .sidebar-box__surface {
    padding: 12px;
  }

  .sidebar-top-button {
    max-width: 100%;
  }
}
</style>
