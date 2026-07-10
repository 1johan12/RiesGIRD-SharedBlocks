<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// ── 🧠 CONTRATOS DE INTERFACES ESTRICTAS DE TU BASE DE DATOS FASTIFY ──
export interface AssemblyDocument {
  name: string;
  url: string;
}

export interface AssemblyNode {
  id: string | number;
  year: string;
  title: string;
  date: string;
  location: string;
  agenda: string[];
  acuerdos: string[];
  fotos: string[];
  documentos: AssemblyDocument[];
}

export interface AssemblyBlockData {
  title?: string;
  introText?: string;
  assemblies?: AssemblyNode[];
}

const props = defineProps<{
  data: AssemblyBlockData | null
}>();

const title = computed(() => props.data?.title || 'Asamblea de Rectores');
const introText = computed(() => props.data?.introText || 'Las asambleas de rectores son el máximo órgano de gobierno de la red, donde se toman las decisiones estratégicas.');
const assemblies = computed(() => props.data?.assemblies || []);

const selectedYear = ref<string>('');
const activeTab = ref<'agenda' | 'acuerdos' | 'fotos' | 'documentos'>('agenda');

const dynamicYears = computed(() => {
  const years = assemblies.value.map(a => a.year).filter(Boolean);
  return [...new Set(years)].sort((a, b) => Number(b) - Number(a));
});

watch(dynamicYears, (newYears) => {
  if (newYears.length > 0 && !selectedYear.value) {
    selectedYear.value = newYears[0];
  }
}, { immediate: true });

const currentAssembly = computed<AssemblyNode | null>(() => {
  if (!selectedYear.value) return null;
  return assemblies.value.find(a => a.year === selectedYear.value) || null;
});

watch(selectedYear, () => {
  activeTab.value = 'agenda';
});
</script>

<template>
  <section class="asambleas-master-section select-none">
    <div class="asambleas-inner-container">
      
      <div class="section-header">
        <div class="section-header__title">
          <h2 class="section-header__text" v-if="title">
            {{ title }}
          </h2>
          <span class="section-header__line" />
        </div>
        <div v-if="introText" class="section-header__intro-wrap">
          <p class="section-header__intro">
            {{ introText }}
          </p>
        </div>
      </div>

      <div class="dropdown-filter-block" v-if="dynamicYears.length > 0">
        <div class="custom-select-card-wrap">
          <select v-model="selectedYear" class="native-dropdown-select">
            <option value="">Seleccione el año</option>
            <option v-for="year in dynamicYears" :key="year" :value="year">{{ year }}</option>
          </select>
          <div class="custom-arrow-layout-wrap">
            <div class="divider-vertical-red"></div>
            <svg class="dropdown-chevron-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div class="assembly-display-panel shadow-premium" v-if="currentAssembly">
        
        <div class="panel-left-hairline-header mb-4">
          <h3 class="assembly-card-main-title">
            {{ currentAssembly.title || 'Asamblea Oficial de Rectores' }}
          </h3>
        </div>

        <div class="assembly-meta-horizontal-row mb-6">
          <div class="meta-icon-item" v-if="currentAssembly.date">
            <svg class="meta-svg-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ currentAssembly.date }}</span>
          </div>
          
          <div class="meta-icon-item" v-if="currentAssembly.location">
            <svg class="meta-svg-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{{ currentAssembly.location }}</span>
          </div>
        </div>

        <div class="subtabs-navigation-strip mb-8">
          <button 
            v-for="tab in (['agenda', 'acuerdos', 'fotos', 'documentos'] as const)"
            :key="tab"
            @click="activeTab = tab"
            class="subtab-action-btn"
            :class="{ 'subtab-is-active': activeTab === tab }"
          >
            {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </div>

        <div class="tabs-dynamic-render-viewport">
          
          <div v-if="activeTab === 'agenda'" class="fade-in-viewport">
            <div class="agenda-items-grid-layout" v-if="currentAssembly.agenda?.length > 0">
              <div 
                v-for="(punto, index) in currentAssembly.agenda" 
                :key="index"
                class="agenda-card-node-item border-translucent"
              >
                <div class="agenda-index-squared-badge">
                  {{ index + 1 }}
                </div>
                <p class="agenda-node-core-text">
                  {{ punto }}
                </p>
              </div>
            </div>
            <div v-else class="tab-empty-fallback-placeholder">No se registraron puntos de agenda para esta sesión.</div>
          </div>

          <div v-else-if="activeTab === 'acuerdos'" class="fade-in-viewport">
            <div class="acuerdos-compact-unified-box" v-if="currentAssembly.acuerdos?.length > 0">
              <div v-for="(acuerdo, aIdx) in currentAssembly.acuerdos" :key="aIdx" class="acuerdo-table-row">
                <div class="acuerdo-bullet-check-circle-green">
                  <svg class="check-vector-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p class="acuerdo-text-core-fit-green">{{ acuerdo }}</p>
              </div>
            </div>
            <div v-else class="tab-empty-fallback-placeholder">Los acuerdos de esta sesión se encuentran en proceso de refrendo oficial.</div>
          </div>

          <div v-else-if="activeTab === 'fotos'" class="fade-in-viewport">
            <div class="gallery-photo-grid-layout" v-if="currentAssembly.fotos?.length > 0">
              <div v-for="(img, fIdx) in currentAssembly.fotos" :key="fIdx" class="gallery-photo-card shadow-mini">
                <img :src="img" alt="Fotografía del congreso" class="img-gallery-render" />
              </div>
            </div>
            <div v-else class="tab-empty-fallback-placeholder">El archivo de registro fotográfico para este año no se encuentra disponible.</div>
          </div>

          <div v-else-if="activeTab === 'documentos'" class="fade-in-viewport">
            <div class="documents-compact-unified-box" v-if="currentAssembly.documentos?.length > 0">
              <a 
                v-for="(doc, dIdx) in currentAssembly.documentos" 
                :key="dIdx"
                :href="doc.url"
                target="_blank"
                class="document-table-row"
              >
                <div class="document-icon-avatar">
                  <svg class="document-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.75 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div class="document-info-body">
                  <h4 class="document-row-title-text">{{ doc.name }}</h4>
                  <span class="document-row-action-link-label">Descargar archivo oficial →</span>
                </div>
              </a>
            </div>
            <div v-else class="tab-empty-fallback-placeholder">No se han adjuntado actas ni resoluciones firmadas en formato digital.</div>
          </div>

        </div>

      </div>

      <div v-else class="global-no-data-fallback-box">
        <p>No se encontraron registros de actas de asambleas de rectores cargados en el sistema.</p>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* =========================================================================
   ========================================================================= */

.asambleas-master-section {
  --bg-slate: #f8fafc;
  --crimson-red: #e1113f;
  --blue-corp: #274e9d;
  --green-emerald: #10b981; 
  
  width: 100%;
  padding: 40px 0;
  background-color: transparent;
  box-sizing: border-box;
}

.asambleas-inner-container {
  width: 100%; max-width: 1140px; margin: 0 auto; padding: 0 16px; box-sizing: border-box;
}

.section-header {
  width: 100%; display: flex; flex-direction: column; align-items: center; box-sizing: border-box;
}
.section-header__title {
  width: 100%; display: flex; flex-direction: column; align-items: center;
}
.section-header__text {
  width: 100%; margin: 0; text-align: center;
  font-family: var(--font-bricolage) !important;
  font-size: 28px; font-weight: 700; line-height: 1.2; color: #0b0b0b;
  white-space: normal; overflow-wrap: anywhere; word-break: normal; text-wrap: balance;
}
.section-header__line {
  width: 220px; height: 3px; margin-top: 3px;
  background: linear-gradient(90deg, var(--crimson-red) 0%, var(--blue-corp) 100%);
  transition: width 0.2s ease;
}
.section-header__intro-wrap {
  width: 100%; box-sizing: border-box; margin-top: 12px;
}
.section-header__intro {
  width: 100%; margin: 0; text-align: center;
  font-family: var(--font-bricolage) !important;
  font-size: 16px; font-weight: 400; line-height: 1.45; color: #111111;
  overflow-wrap: anywhere; word-break: break-word;
}

@media (max-width: 768px) {
  .section-header__text { font-size: 24px; }
  .section-header__intro { font-size: 14px; }
}

/* Combo Box Selector */
.dropdown-filter-block {
  max-width: 320px; margin: 32px auto 40px auto; width: 100%;
}
.custom-select-card-wrap {
  position: relative; display: flex; align-items: center; background-color: #ffffff; border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0; padding: 10px 16px 10px 20px; box-sizing: border-box;
}
.native-dropdown-select {
  width: 100%; color: #334155; background: transparent; border: none; outline: none; appearance: none; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding-right: 32px;
}
.custom-arrow-layout-wrap {
  position: absolute; right: 0; top: 0; bottom: 0; display: flex; align-items: center; padding-right: 16px; pointer-events: none;
}
.divider-vertical-red {
  height: 1.25rem; border-left: 2px solid var(--crimson-red); margin-right: 12px;
}
.dropdown-chevron-icon { width: 14px; height: 14px; color: var(--crimson-red); }

/* Panel de Información */
.assembly-display-panel {
  background-color: #ffffff; border-radius: 16px; border: 1px solid #f1f5f9; padding: 40px; width: 100%; box-sizing: border-box;
}
.panel-left-hairline-header { border-left: 3px solid #000000; padding-left: 12px; text-align: left; }
.assembly-card-main-title { font-size: 1.5rem; font-weight: 650; color: #111827; letter-spacing: -0.025em; margin: 0; }

.assembly-meta-horizontal-row {
  display: flex; flex-wrap: wrap; gap: 16px; font-size: 0.75rem; color: #9ca3af; font-weight: 500;
}
.meta-icon-item { display: flex; align-items: center; }
.meta-svg-icon { width: 1rem; height: 1rem; margin-right: 6px; color: var(--blue-corp); flex-shrink: 0; }

/* ── 🎯 CORREGIDO: PESTAÑAS HOLLOW CON TEXTO Y BORDE DEGRADADO (FONDO LIMPIO 1:1) ── */
.subtabs-navigation-strip {
  display: flex; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px; width: 100%; box-sizing: border-box;
}

.subtab-action-btn {
  padding: 6px 18px; font-size: 0.6rem; font-weight: 500; border-radius: 8px; border: 1px solid #e2e8f0;
  background-color: #f3f4f6; color: #9ca3af; cursor: pointer; font-family: var(--font-bricolage) !important;
  transition: all 0.2s ease-in-out; box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  position: relative;
}
.subtab-action-btn:hover { color: #111827; background-color: #e5e7eb; }

/* Inyección de máscara para delinear contorno degradado conservando fondo transparente */
.subtab-is-active {
  background-color: transparent !important;
  border: 1px solid transparent !important;
  box-shadow: 0 4px 12px rgba(39, 78, 157, 0.04);
  
  background: linear-gradient(90deg, var(--crimson-red) 0%, var(--blue-corp) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.subtab-is-active::before {
  content: ""; position: absolute; inset: 0; border-radius: 8px; padding: 1.5px;
  background: linear-gradient(90deg, var(--crimson-red) 0%, var(--blue-corp) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none;
}

.tabs-dynamic-render-viewport { width: 100%; box-sizing: border-box; }

/* ── 🎯 CORREGIDO: DESPLIEGUE DE AGENDA 1:1 CON CONTORNOS EN DEGRADADO FINO SIN RELLENOS ── */
.agenda-items-grid-layout {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; width: 100%;
}
@media (max-width: 768px) { .agenda-items-grid-layout { grid-template-columns: 1fr; } }

.agenda-card-node-item {
  display: flex; align-items: center; background-color: #f5f7ff; border-radius: 12px; padding: 16px 20px; box-sizing: border-box; border: 1px solid rgba(226, 232, 240, 0.7);
}

/* El cuadro numérico: Contorno degradado y número degradado, fondo limpio rígido */
.agenda-index-squared-badge {
  flex-shrink: 0; width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-bricolage) !important; font-size: 0.85rem; font-weight: 800;
  margin-right: 18px; background-color: #ffffff; position: relative;
  
  background: linear-gradient(135deg, var(--crimson-red) 0%, var(--blue-corp) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.agenda-index-squared-badge::before {
  content: ""; position: absolute; inset: 0; border-radius: 8px; padding: 1.5px;
  background: linear-gradient(135deg, var(--crimson-red) 0%, var(--blue-corp) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none;
}

/* El texto de la derecha con gradiente nítido en la tipografía */
.agenda-node-core-text {
  flex: 1; text-align: left;
  font-family: var(--font-bricolage) !important;
  font-size: 0.9rem; font-weight: 400; line-height: 1.4; margin: 0;
  background: linear-gradient(90deg, var(--crimson-red) 0%, var(--blue-corp) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ── 🎯 CORREGIDO: ACUERDOS EN COMPACTO MEDIO VERDOSO INSTITUCIONAL SIN DEGRADADOS ── */
.acuerdos-compact-unified-box {
  width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;
}
.acuerdo-table-row {
  display: flex; align-items: center; gap: 16px; padding: 14px 20px; border-bottom: 1px solid #edf2f7; box-sizing: border-box;
}
.acuerdo-table-row:last-child { border-bottom: none; }
.acuerdo-table-row:hover { background-color: #f0fdf4; } 

.acuerdo-bullet-check-circle-green {
  flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%;
  background: var(--green-emerald);
  display: grid; place-items: center; color: #ffffff;
}
.check-vector-svg { width: 11px; height: 11px; }

.acuerdo-text-core-fit-green {
  margin: 0; font-family: var(--font-bricolage) !important; font-size: 0.9rem; font-weight: 600; color: #1e293b; text-align: left;
}

/* Fotos compartimento */
.gallery-photo-grid-layout { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; width: 100%; }
@media (max-width: 992px) { .gallery-photo-grid-layout { grid-template-columns: repeat(2, 1fr); } }
.gallery-photo-card { border-radius: 10px; height: 110px; overflow: hidden; border: 1px solid #e2e8f0; background-color: #f8fafc; }
.img-gallery-render { width: 100%; height: 100%; object-fit: cover; }

/* Documentos en Cuadro Integrado unificado */
.documents-compact-unified-box {
  width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;
}
.document-table-row {
  display: flex; align-items: center; gap: 16px; padding: 14px 20px; border-bottom: 1px solid #edf2f7; text-decoration: none; box-sizing: border-box;
}
.document-table-row:last-child { border-bottom: none; }
.document-table-row:hover { background-color: #f8fafc; }

.document-icon-avatar { display: flex; align-items: center; color: var(--crimson-red); flex-shrink: 0; }
.document-icon-svg { width: 18px; height: 18px; }

.document-info-body { flex: 1; display: flex; flex-direction: column; gap: 1px; text-align: left; overflow: hidden; }
.document-row-title-text {
  font-family: var(--font-bricolage) !important; font-size: 0.88rem; font-weight: 700; color: #1e293b; margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.document-row-action-link-label { font-size: 10px; color: var(--blue-corp); font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }

/* Fallbacks */
.tab-empty-fallback-placeholder { padding: 40px 20px; text-align: center; color: #94a3b8; font-size: 0.85rem; border: 1px dashed #e2e8f0; border-radius: 8px; background-color: #f8fafc; font-family: var(--font-bricolage); }
.global-no-data-fallback-box { padding: 40px; text-align: center; color: #94a3b8; font-family: var(--font-bricolage); }

.fade-in-viewport { animation: navFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes navFadeIn { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }

.mb-12 { margin-bottom: 48px; }
.mb-6 { margin-bottom: 24px; }
.mb-4 { margin-bottom: 16px; }
.mb-8 { margin-bottom: 32px; }
</style>