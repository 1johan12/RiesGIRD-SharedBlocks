<script setup lang="ts">
import { computed } from 'vue';
import { formatImageUrl } from '@shared/helpers/url';

export interface GridItemAsset {
  id: string | number;
  titulo: string;
  resumen: string;
  autor?: string;
  imagen?: string;
  fecha_evento?: string;     // Exclusivo para events / assemblies
  ubicacion_evento?: string; // Exclusivo para events / assemblies
  url_enlace?: string;
}

export interface DynamicGridBlockData {
  title?: string;
  introText?: string;
  contentType: 'news' | 'events' | 'assemblies'; // 🎯 La llave condicional maestra
  items?: GridItemAsset[];
}

const props = defineProps<{
  data: DynamicGridBlockData | null
}>();

// --- PARAMETRIZACIÓN REACTIVA CON DEFAULTS INTELIGENTES ---
const title = computed(() => props.data?.title || 'Últimas Publicaciones de la Red');
const introText = computed(() => props.data?.introText || 'Mantente al tanto de las actividades, acuerdos y novedades científicas impulsadas por nuestros nodos regionales.');
const contentType = computed(() => props.data?.contentType || 'news');
const items = computed(() => props.data?.items || []);

// Helper visual para pintar un Badge semántico según la mutación del bloque
const getSectionBadgeLabel = computed(() => {
  if (contentType.value === 'events') return 'Próximo Evento';
  if (contentType.value === 'assemblies') return 'Asamblea de Rectores';
  return 'Noticia Reciente';
});

// Traduce dinámicamente las clases cromáticas de los badges de la Red
const getSectionBadgeClass = computed(() => {
  if (contentType.value === 'events') return 'badge-blue';
  if (contentType.value === 'assemblies') return 'badge-purple';
  return 'badge-crimson';
});

</script>

<template>
  <section class="dynamic-feed-grid-section" v-if="items.length > 0">
    <div class="feed-grid-fluid-container">

      <div class="text-center-header">
        <div class="title-inline-block">
          <h2 class="main-section-title" v-if="title">{{ title }}</h2>
          <div class="absolute-tricolor-divider"></div>
        </div>
        <p class="section-intro-paragraph" v-if="introText">
          {{ introText }}
        </p>
      </div>

      <div class="dynamic-cards-grid-layout">
        <a
          v-for="(item, i) in items"
          :key="item.url_enlace ? `${i}-${item.url_enlace}` : i"
          :href="item.url_enlace || '#'"
          class="feed-premium-card shadow-soft"
          :class="{ 'card-unlinked': !item.url_enlace }"
        >
          <div class="card-multimedia-frame">
            <img 
              :src="formatImageUrl(item.imagen)" 
              :alt="item.titulo" 
              class="card-img-fluid-render"
            />
            <span class="floating-feed-badge font-bold" :class="getSectionBadgeClass">
              {{ getSectionBadgeLabel }}
            </span>
          </div>

          <div class="card-textual-body">
            
            <h3 class="card-core-title text-truncate-2">
              {{ item.titulo }}
            </h3>

            <p class="card-excerpt-text text-truncate-3">
              {{ item.resumen }}
            </p>

            <div class="conditional-metadata-footer border-top-slate">
              
              <div v-if="contentType === 'news'" class="meta-row-layout fade-in-meta">
                <span class="meta-label-author text-truncate-line" v-if="item.autor">
                  <i class="bi bi-person-circle text-crimson"></i> Por: {{ item.autor }}
                </span>
              </div>

              <div v-else class="meta-row-layout flex-column-gap fade-in-meta">
                <span class="meta-pill-item text-truncate-line" v-if="item.fecha_evento">
                  <i class="bi bi-calendar3 icon-blue"></i> {{ item.fecha_evento }}
                </span>
                <span class="meta-pill-item text-truncate-line" v-if="item.ubicacion_evento">
                  <i class="bi bi-geo-alt-fill icon-purple"></i> {{ item.ubicacion_evento }}
                </span>
              </div>

            </div>

          </div>
        </a>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* =========================================================================
   🎨 MAQUETACIÓN DE ULTRA ALTA FIDELIDAD (CSS PURO LIBRE DE COLISIONES)
   ========================================================================= */

.dynamic-feed-grid-section {
  --crimson:   #D9043D;
  --purple:    #653E9B;
  --blue-corp: #254C9E;
  --slate-bg:  #F8FAFC;

  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 64px 20px;
  background-color: #ffffff;
  font-family: system-ui, -apple-system, sans-serif;
  box-sizing: border-box;
}

.feed-grid-fluid-container { width: 100%; }

/* Encabezado */
.text-center-header { text-align: center; max-width: 1024px; margin: 0 auto 56px auto; }
.title-inline-block { position: relative; display: inline-block; padding-bottom: 10px; margin-bottom: 20px; }

.main-section-title {
  font-size: 2rem; font-weight: 800; color: #111827; letter-spacing: -0.025em; margin: 0; line-height: 1.25;
}

.absolute-tricolor-divider {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 4px;
  background: linear-gradient(to right, var(--crimson), var(--purple), var(--blue-corp));
  border-radius: 2px;
}

.section-intro-paragraph { color: #374151; font-size: 1.05rem; line-height: 1.65; max-width: 896px; margin: 0 auto; }

/* ── REJILLA MULTI-COLUMNA RESPONSIVA SIMÉTRICA ── */
.dynamic-cards-grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 Columnas perfectas en desktop */
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 992px) { .dynamic-cards-grid-layout { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .dynamic-cards-grid-layout { grid-template-columns: 1fr; gap: 24px; } }

/* Tarjeta Modular */
.feed-premium-card {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid rgba(241, 245, 249, 0.9);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.03);
  overflow: hidden;
  text-decoration: none;
  box-sizing: border-box;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.feed-premium-card:hover:not(.card-unlinked) {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(37, 76, 158, 0.08);
}
.card-unlinked { cursor: default; }

/* Frame Multimedia (Aspect Ratio 16:9 de Video/Fotos) */
.card-multimedia-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9.5;
  overflow: hidden;
  background-color: #f1f5f9;
}

.card-img-fluid-render {
  width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease;
}
.feed-premium-card:hover .card-img-fluid-render { transform: scale(1.02); }

/* Badges Flotantes Dinámicos */
.floating-feed-badge {
  position: absolute; top: 16px; left: 16px; font-size: 10px; font-weight: 700;
  padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.3px; color: #ffffff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.badge-crimson { background-color: var(--crimson); }
.badge-purple { background-color: var(--purple); }
.badge-blue { background-color: var(--blue-corp); }

/* Cuerpo de Contenido */
.card-textual-body { padding: 24px; display: flex; flex-direction: column; flex-grow: 1; text-align: left; }

.card-core-title {
  font-size: 1.05rem; font-weight: 800; color: #0f172a; line-height: 1.4; margin: 0 0 10px 0;
}

.card-excerpt-text {
  font-size: 0.85rem; color: #475569; line-height: 1.5; margin: 0 0 20px 0; flex-grow: 1;
}

.text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.text-truncate-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.text-truncate-line { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Footer de Metadatos Condicionales */
.conditional-metadata-footer { padding-top: 14px; width: 100%; box-sizing: border-box; }
.border-top-slate { border-top: 1px dashed #e2e8f0; }

.meta-row-layout { display: flex; align-items: center; font-size: 0.78rem; color: #64748b; font-weight: 600; width: 100%; }
.flex-column-gap { flex-direction: column; align-items: flex-start; gap: 6px; }

.meta-label-author i { margin-right: 4px; font-size: 0.85rem; }
.text-crimson { color: var(--crimson); }

.meta-pill-item { display: flex; align-items: center; gap: 6px; width: 100%; }
.meta-pill-item i { font-size: 0.85rem; flex-shrink: 0; }
.icon-blue { color: var(--blue-corp); }
.icon-purple { color: var(--purple); }

/* Animación de entrada de metadatos al cambiar el interruptor en el admin */
.fade-in-meta { animation: metaFade 0.25s ease-out forwards; }
@keyframes metaFade { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }

.shadow-soft { box-shadow: 0 10px 25px rgba(15, 23, 42, 0.02); }
</style>