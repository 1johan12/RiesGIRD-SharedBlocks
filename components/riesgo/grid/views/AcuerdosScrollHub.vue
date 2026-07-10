<script setup lang="ts">
import { computed } from 'vue';

// ── 🧠 CONTRATOS DE INTERFACES ESTRICTAS DE ALTA INGENIERÍA ──
export interface ScrollDocItem {
  id: string | number;
  title: string;
  category?: string;
  publish_date?: string;
  download_url?: string;
  file_size?: string;
}

export interface ScrollContentBlock {
  id: string | number;
  type: 'document_grid' | 'html_raw'; 
  blockTitle: string;
  blockIntro?: string;                
  htmlContent?: string;               // Propiedad opcional protegida
  documents?: ScrollDocItem[];        // Propiedad opcional protegida
}

export interface ScrollHubBlockConfig {
  titleSection?: string;
  introSection?: string;
  maxHeightPx?: number | string;
  blocks?: ScrollContentBlock[];
}

const props = defineProps<{
  data: ScrollHubBlockConfig | null
}>();

// --- PARAMETRIZACIÓN REACTIVA DEL PAGE BUILDER ---
const titleSection = computed(() => props.data?.titleSection || 'Repositorio y Archivo de Acuerdos Marco');
const introSection = computed(() => props.data?.introSection || 'Consulte los documentos, actas y resoluciones oficiales emitidas por los comités institucionales.');
const maxHeightStyle = computed(() => `${props.data?.maxHeightPx || 460}px`);

// ── 🎯 CORREGIDO: Anclaje explícito <ScrollContentBlock[]> para exterminar el error ts-plugin(2339) de raíz
const dynamicBlocks = computed<ScrollContentBlock[]>(() => props.data?.blocks || [
  {
    id: 'b-1',
    type: 'document_grid',
    blockTitle: 'Acuerdos de Consejo Directivo',
    blockIntro: 'Actas y resoluciones marco vigentes aprobadas por el quórum de rectores.',
    documents: [
      { id: 'd-1', title: 'Acta Oficial Suscrita de la Asamblea Extraordinaria de Rectores - Sede UNMSM', category: 'Acta Oficial', publish_date: '2026-05-14', file_size: '2.4 MB', download_url: '#' },
      { id: 'd-2', title: 'Resolución Marco N° 042-2026/RIESGIRD: Incorporación de Nuevos Nodos Regionales', category: 'Resolución', publish_date: '2026-06-02', file_size: '1.8 MB', download_url: '#' }
    ]
  },
  {
    id: 'b-2',
    type: 'html_raw',
    blockTitle: 'Disposiciones Generales del Comité',
    blockIntro: 'Lineamientos complementarios obligatorios para todas las universidades miembros.',
    htmlContent: '<p>Las presentes resoluciones rigen con carácter obligatorio para todas las universidades de la red.</p>'
  }
]);

const formatShortDate = (dateStr: string | undefined) => {
  if (!dateStr) return 'Junio, 2026';
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};
</script>

<template>
  <section class="scroll-hub-section-wrapper">
    <div class="scroll-hub-container">
      
      <div class="section-header mb-12">
        <div class="section-header__title">
          <h2 class="section-header__text">
            {{ titleSection }}
          </h2>
          <span class="section-header__line" />
        </div>
        <div v-if="introSection" class="section-header__intro-wrap mt-3">
          <p class="section-header__intro">
            {{ introSection }}
          </p>
        </div>
      </div>

      <div class="scroll-viewport-outer-box shadow-soft">
        <div class="scroll-internal-viewport" :style="{ maxHeight: maxHeightStyle }">
          <div class="scroll-blocks-vertical-stack">
            
            <div v-for="block in dynamicBlocks" :key="block.id" class="internal-content-block-node">
              
              <div class="section-header mb-6 align-left-section">
                <div class="section-header__title align-items-start">
                  <h2 class="section-header__text text-left-align">
                    {{ block.blockTitle }}
                  </h2>
                  <span class="section-header__line line-left-align" />
                </div>
                <div v-if="block.blockIntro" class="section-header__intro-wrap mt-2">
                  <p class="section-header__intro text-left-align">
                    {{ block.blockIntro }}
                  </p>
                </div>
              </div>

              <div v-if="block.type === 'document_grid'" class="unified-document-table-box">
                <div 
                  v-for="(doc, index) in block.documents || []" 
                  :key="doc.id || index" 
                  class="table-row-item-grid"
                >
                  <div class="table-cell-icon">
                    <svg class="table-doc-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.75 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>

                  <div class="table-cell-details">
                    <h4 class="table-doc-title-text" :title="doc.title">{{ doc.title }}</h4>
                    <div class="table-meta-pills-row">
                      <span class="table-category-tag">{{ doc.category || 'Resolución' }}</span>
                      <span class="table-date-text">{{ formatShortDate(doc.publish_date) }}</span>
                    </div>
                  </div>

                  <div class="table-cell-action">
                    <span class="table-weight-label" v-if="doc.file_size">{{ doc.file_size }}</span>
                    <a :href="doc.download_url || '#'" class="table-btn-download" :class="index % 2 === 0 ? 'rojo' : 'azul'">
                      <svg class="table-download-svg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12l-4.5 4.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div 
                v-else-if="block.type === 'html_raw' && block.htmlContent" 
                class="html-injected-container-box ql-editor" 
                v-html="block.htmlContent"
              ></div>

            </div>

          </div>
        </div>

        <div class="scroll-edge-fade-overlay"></div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* =========================================================================
   🎨 MAQUETACIÓN PREMIUM CON TU ÁRBOL DE CLASES CSS RECOBRADO 1:1
   ========================================================================= */

.scroll-hub-section-wrapper {
  --slate-text: #475569;
  width: 100%; padding: 24px 0; box-sizing: border-box;
}

.scroll-hub-container {
  width: 100%; max-width: 1140px; margin: 0 auto; padding: 0 16px; box-sizing: border-box;
}

.scroll-hub-header-zone { width: 100%; margin-bottom: 28px; }

/* ── 🚩 TU ENVOLTURA MODELO ESTRUCTURAL DE COLOR H2 COMPLETAMENTE INCORPORADA ── */
.section-header {
  width: 100%; display: flex; flex-direction: column; align-items: center; box-sizing: border-box;
}
.align-left-section { align-items: flex-start !important; }
.align-items-start { align-items: flex-start !important; }

.section-header__title {
  width: 100%; display: flex; flex-direction: column; align-items: center;
}

.section-header__text {
  width: 100%; margin: 0; text-align: center;
  font-family: var(--font-bricolage) !important; /* 🎯 Tu tipografía definida solicitada */
  font-size: 28px; font-weight: 700; line-height: 1.2; color: #0b0b0b;
  white-space: normal; overflow-wrap: anywhere; word-break: normal; text-wrap: balance;
}
.text-left-align { text-align: left !important; }

.section-header__line {
  width: 220px; height: 3px; margin-top: 5px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%); /* Degradado exacto */
  transition: width 0.2s ease;
}
.line-left-align { width: 140px; margin-right: auto; }

.section-header__intro-wrap { width: 100%; box-sizing: border-box; }
.section-header__intro {
  width: 100%; margin: 0; text-align: center;
  font-family: var(--font-bricolage) !important;
  font-size: 16px; font-weight: 400; line-height: 1.45; color: #111111;
  overflow-wrap: anywhere;
}

@media (max-width: 768px) {
  .section-header__text { font-size: 24px; }
  .section-header__intro { font-size: 15px; }
}
@media (max-width: 480px) {
  .section-header__text { font-size: 20px; }
  .section-header__intro { font-size: 14px; }
}

/* El Caparazón del Repositorio Documental */
.scroll-viewport-outer-box {
  position: relative; width: 100%; background-color: #ffffff; border-radius: 16px;
  border: 1px solid #f1f5f9; overflow: hidden; box-sizing: border-box;
}
.scroll-internal-viewport {
  width: 100%; overflow-y: auto; scroll-behavior: smooth; padding: 32px; box-sizing: border-box;
}

/* Scrollbar premium esbelto */
.scroll-internal-viewport::-webkit-scrollbar { width: 5px; }
.scroll-internal-viewport::-webkit-scrollbar-track { background: #f8fafc; }
.scroll-internal-viewport::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

.scroll-blocks-vertical-stack { display: flex; flex-direction: column; gap: 40px; width: 100%; }
.internal-content-block-node { display: flex; flex-direction: column; width: 100%; box-sizing: border-box; }

/* ── 🎯 EL CUADRO INTEGRADO UNIFICADO COMPACTO DE FILAS SOLICITADO ── */
.unified-document-table-box {
  width: 100%; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;
}

.table-row-item-grid {
  display: flex; align-items: center; gap: 16px; padding: 14px 20px; border-bottom: 1px solid #edf2f7; box-sizing: border-box;
}
.table-row-item-grid:last-child { border-bottom: none; }
.table-row-item-grid:hover { background-color: #f8fafc; }

.table-cell-icon { display: flex; align-items: center; color: #274e9d; flex-shrink: 0; }
.table-doc-svg { width: 18px; height: 18px; }

.table-cell-details { flex: 1; display: flex; flex-direction: column; gap: 2px; text-align: left; overflow: hidden; }
.table-doc-title-text { font-size: 0.88rem; font-weight: 700; color: #1e293b; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.table-meta-pills-row { display: flex; align-items: center; gap: 8px; }
.table-category-tag { font-size: 8px; font-weight: 800; background-color: #f1f5f9; color: #475569; padding: 1px 6px; border-radius: 3px; text-transform: uppercase; }
.table-date-text { font-size: 11px; color: #94a3b8; font-weight: 500; }

.table-cell-action { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.table-weight-label { font-size: 10px; color: #64748b; font-family: monospace; font-weight: 600; }

.table-btn-download {
  width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; color: #ffffff; text-decoration: none; transition: transform 0.2s;
}
.table-btn-download:hover { transform: scale(1.05); }
.rojo { background-color: #e1113f; }
.azul { background-color: #274e9d; }
.table-download-svg { width: 14px; height: 14px; }

/* Contenedor HTML Inyectado de Quill */
.html-injected-container-box { width: 100%; text-align: left; box-sizing: border-box; font-size: 0.92rem; color: var(--slate-text); line-height: 1.6; }

.scroll-edge-fade-overlay {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 16px;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none; z-index: 10;
}
.shadow-soft { box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02); }

.mb-12 { margin-bottom: 48px; }
.mb-6 { margin-bottom: 24px; }
.mt-3 { margin-top: 12px; }
.mt-2 { margin-top: 8px; }
</style>