<script setup lang="ts">
import { ref, watch } from 'vue';
import { formatImageUrl } from '@shared/helpers/url';

// ── 🧠 CONTRATOS DE INTERFACES ESTRICTAS DE ALTA INGENIERÍA DE DATOS ──
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

const props = defineProps<{ modelValue: AssemblyBlockData | null }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

// --- ENFORZAMIENTO DE TIPADO ESTRICTO DE REPOSITORIO MULTI-NIVEL ---
const localData = ref<Required<AssemblyBlockData>>({
  title: props.modelValue?.title || 'Asamblea de Rectores',
  introText: props.modelValue?.introText || 'Las asambleas de rectores son el máximo órgano de gobierno de la red, donde se toman las decisiones estratégicas.',
  assemblies: Array.isArray(props.modelValue?.assemblies)
    ? props.modelValue.assemblies.map((a: any) => ({
        id: a.id || Date.now() + Math.random(),
        year: a.year || '2026',
        title: a.title || 'Asamblea Ordinaria',
        date: a.date || '',
        location: a.location || '',
        agenda: Array.isArray(a.agenda) ? [...a.agenda] : [],
        acuerdos: Array.isArray(a.acuerdos) ? [...a.acuerdos] : [],
        fotos: Array.isArray(a.fotos) ? [...a.fotos] : [],
        documentos: Array.isArray(a.documentos) ? a.documentos.map((d: any) => ({ name: d.name || '', url: d.url || '' })) : []
      }))
    : []
});

// Controladores visuales colapsables del panel administrativo de 320px
const expandedAssemblyIdx = ref<number | null>(0); // Expande solo el primer año por defecto
const isBaseTextsOpen = ref(false);

// Sub-Tab interno de control para la asamblea activa bajo edición (Agenda, Acuerdos, Fotos o Docs)
const activeSubConfigTab = ref<'agenda' | 'acuerdos' | 'fotos' | 'documentos'>('agenda');

const toggleYearAccordion = (index: number) => {
  expandedAssemblyIdx.value = expandedAssemblyIdx.value === index ? null : index;
};

// ── 🎯 CONTROLADORES MAESTROS CON TIPADO ESTRICTO AL MOMENTO DEL PUSH ──
const addAssemblyNodeAnio = () => {
  const nuevoNodo: AssemblyNode = {
    id: Date.now(),
    year: (new Date().getFullYear()).toString(),
    title: 'Asamblea Ordinaria Anual',
    date: '',
    location: '',
    agenda: ['Instalación formal de la RiesGIRD-ACC'],
    acuerdos: [],
    fotos: [],
    documentos: []
  };
  localData.value.assemblies.unshift(nuevoNodo); // Añadir al inicio cronológico
  expandedAssemblyIdx.value = 0; // Abre de golpe el nuevo bloque
};

// Controladores incrementales de arreglos de strings (Agenda & Acuerdos)
const addAgendaItem = (asmIdx: number) => { 
  localData.value.assemblies[asmIdx].agenda.push('Nuevo punto de agenda corporativo'); 
};
const removeAgendaItem = (asmIdx: number, pIdx: number) => {
  localData.value.assemblies[asmIdx].agenda.splice(pIdx, 1);
};

const addAcuerdoItem = (asmIdx: number) => { 
  localData.value.assemblies[asmIdx].acuerdos.push('Escribe el acuerdo oficial adoptado...'); 
};
const removeAcuerdoItem = (asmIdx: number, aIdx: number) => {
  localData.value.assemblies[asmIdx].acuerdos.splice(aIdx, 1);
};

// Controlador incremental de fotos vinculables a la galería centralizada
const addPhotoToAssembly = (asmIdx: number) => { 
  localData.value.assemblies[asmIdx].fotos.push(''); 
};
const removePhotoFromAssembly = (asmIdx: number, fIdx: number) => {
  localData.value.assemblies[asmIdx].fotos.splice(fIdx, 1);
};

// Controlador incremental de documentos descargables
const addDocumentToAssembly = (asmIdx: number) => {
  localData.value.assemblies[asmIdx].documentos.push({ name: 'Acta de Sesión Firmada (PDF)', url: '' });
};
const removeDocumentFromAssembly = (asmIdx: number, dIdx: number) => {
  localData.value.assemblies[asmIdx].documentos.splice(dIdx, 1);
};


// Sincronizador de reactividad profunda libre de loops reactivos infinitos
watch(localData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });

watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(newVal) !== JSON.stringify(localData.value)) {
    localData.value.title = newVal.title || '';
    localData.value.introText = newVal.introText || '';
    if (Array.isArray(newVal.assemblies)) {
      localData.value.assemblies = newVal.assemblies.map((a: any) => ({
        id: a.id || Date.now() + Math.random(),
        year: a.year || '2026',
        title: a.title || 'Asamblea Ordinaria',
        date: a.date || '',
        location: a.location || '',
        agenda: Array.isArray(a.agenda) ? [...a.agenda] : [],
        acuerdos: Array.isArray(a.acuerdos) ? [...a.acuerdos] : [],
        fotos: Array.isArray(a.fotos) ? [...a.fotos] : [],
        documentos: Array.isArray(a.documentos) ? a.documentos.map((d: any) => ({ name: d.name || '', url: d.url || '' })) : []
      }));
    }
  }
}, { deep: true });
</script>

<template>
  <div class="pro-editor bg-white rounded-4 border p-3 mt-2 shadow-sm h-100 overflow-auto-custom">
    
    <h6 class="fw-bold mb-3 sidebar-title border-bottom pb-2">
      <i class="bi bi-sliders text-danger me-2"></i> Control de Asambleas
    </h6>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-header bg-white p-2 border-0 clickable d-flex justify-content-between align-items-center" @click="isBaseTextsOpen = !isBaseTextsOpen">
        <h6 class="fw-bold mb-0 text-warning small-title"><i class="las la-heading"></i> 1. Títulos Base</h6>
        <i class="bi" :class="isBaseTextsOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </div>
      
      <div class="card-body pt-0 mt-2" v-show="isBaseTextsOpen">
        <div class="mb-3">
          <label class="x-small fw-bold text-muted mb-1">Título Principal</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm fw-bold">
        </div>
        <div class="mb-0">
          <label class="x-small fw-bold text-muted mb-1">Introducción del Órgano</label>
          <textarea v-model="localData.introText" class="form-control form-control-sm small-text" rows="3"></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-primary small-title"><i class="las la-calendar-check"></i> 2. Libros de Actas por Año</h6>
          <button type="button" class="btn btn-xs btn-outline-success px-2 py-0.5 fw-bold" @click="addAssemblyNodeAnio">
            + Año
          </button>
        </div>

        <div class="scroll-stack-wrapper custom-mini-scrollbar">
          <div 
            v-for="(asm, idx) in localData.assemblies" 
            :key="asm.id || idx"
            class="accordion-block-item mb-2"
          >
            <div 
              class="accordion-block-trigger" 
              @click="toggleYearAccordion(idx)"
              :class="{ 'accordion-trigger-active': expandedAssemblyIdx === idx }"
            >
              <div class="d-flex align-items-center gap-2 overflow-hidden">
                <span class="badge bg-danger font-mono font-bold py-1 px-1.5">{{ asm.year }}</span>
                <span class="x-small fw-bold text-slate-title text-truncate" style="max-width: 150px;">
                  {{ asm.title || 'Asamblea Ordinaria' }}
                </span>
              </div>
              <i class="bi" :class="expandedAssemblyIdx === idx ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>

            <div class="accordion-block-body" v-show="expandedAssemblyIdx === idx">
              <div class="p-3 bg-white border border-top-0 rounded-bottom-3 position-relative">
                
                <button type="button" class="btn btn-xs btn-link text-danger position-absolute top-0 end-0 m-1 p-1" @click="localData.assemblies.splice(idx, 1)" :disabled="localData.assemblies.length <= 1">
                  <i class="bi bi-trash3-fill"></i>
                </button>

                <div class="row g-2 mb-3 mt-1">
                  <div class="col-4">
                    <label class="super-small fw-bold text-muted mb-0.5">Año</label>
                    <input type="text" v-model="asm.year" class="form-control form-control-xs text-center font-bold text-danger">
                  </div>
                  <div class="col-8 pe-4">
                    <label class="super-small fw-bold text-muted mb-0.5">Tipo de Asamblea</label>
                    <input type="text" v-model="asm.title" class="form-control form-control-xs fw-bold" placeholder="Ej: Asamblea Ordinaria">
                  </div>
                  <div class="col-6">
                    <label class="super-small fw-bold text-muted mb-0.5">Fecha Física</label>
                    <input type="text" v-model="asm.date" class="form-control form-control-xs small-text" placeholder="Ej: 15 de agosto 2024">
                  </div>
                  <div class="col-6">
                    <label class="super-small fw-bold text-muted mb-0.5">Lugar / Sede</label>
                    <input type="text" v-model="asm.location" class="form-control form-control-xs small-text" placeholder="Ej: Casona San Marcos">
                  </div>
                </div>

                <div class="d-flex flex-wrap gap-0.5 mb-3 border rounded p-1 var-tabs-bg shadow-xs">
                  <button 
                    v-for="subTab in (['agenda', 'acuerdos', 'fotos', 'documentos'] as const)" 
                    :key="subTab"
                    type="button"
                    @click="activeSubConfigTab = subTab"
                    class="btn btn-sub-tab flex-grow-1"
                    :class="activeSubConfigTab === subTab ? 'btn-dark text-white' : 'btn-light border-0 text-secondary'"
                  >
                    {{ subTab.slice(0,4) }}
                  </button>
                </div>

                <div v-if="activeSubConfigTab === 'agenda'" class="fade-in-sub">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="super-small fw-bold text-dark"><i class="bi bi-list-ol"></i> Puntos de Agenda</span>
                    <button type="button" class="btn btn-link p-0 x-small fw-bold text-success text-decoration-none" @click="addAgendaItem(idx)">+ Ítem</button>
                  </div>
                  <div v-for="(point, pIdx) in asm.agenda" :key="pIdx" class="d-flex gap-1 align-items-center mb-1.5 position-relative">
                    <span class="x-small font-mono fw-bold text-muted">{{ pIdx + 1 }}.</span>
                    <input type="text" v-model="asm.agenda[pIdx]" class="form-control form-control-xs small-text fw-semibold">
                    <button type="button" class="btn btn-sm text-danger p-0 border-0" @click="removeAgendaItem(idx, pIdx)" :disabled="asm.agenda.length <= 1">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                </div>

                <div v-else-if="activeSubConfigTab === 'acuerdos'" class="fade-in-sub">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="super-small fw-bold text-dark"><i class="bi bi-check-circle"></i> Resoluciones/Acuerdos</span>
                    <button type="button" class="btn btn-link p-0 x-small fw-bold text-success text-decoration-none" @click="addAcuerdoItem(idx)">+ Acuerdo</button>
                  </div>
                  <div v-for="(acuerdo, aIdx) in asm.acuerdos" :key="aIdx" class="d-flex gap-1 align-items-start mb-1.5">
                    <input type="text" v-model="asm.acuerdos[aIdx]" class="form-control form-control-xs small-text">
                    <button type="button" class="btn btn-sm text-danger p-0 border-0 mt-1" @click="removeAcuerdoItem(idx, aIdx)">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                  <div v-if="!asm.acuerdos?.length" class="text-center super-small text-muted py-2 bg-light rounded border border-dashed">No hay acuerdos cargados</div>
                </div>

                <div v-else-if="activeSubConfigTab === 'fotos'" class="fade-in-sub">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="super-small fw-bold text-dark"><i class="bi bi-camera"></i> Álbum de Fotos (Incremental)</span>
                    <button type="button" class="btn btn-link p-0 x-small fw-bold text-primary text-decoration-none" @click="addPhotoToAssembly(idx)">+ Foto</button>
                  </div>
                  <div class="row g-2">
                    <div v-for="(img, fIdx) in asm.fotos" :key="fIdx" class="col-4 position-relative text-center mb-1">
                      <div 
                        @click="$emit('select-image', { item: asm.fotos, field: fIdx })"
                        class="thumb-preview-box border rounded clickable shadow-xs"
                        :style="{ backgroundImage: img ? `url(${formatImageUrl(img)})` : 'none' }"
                        title="Elegir foto de galería"
                      >
                        <i v-if="!img" class="bi bi-image text-muted"></i>
                      </div>
                      <button type="button" class="btn-remove-photo-badge" @click="removePhotoFromAssembly(idx, fIdx)">×</button>
                    </div>
                  </div>
                  <div v-if="!asm.fotos?.length" class="text-center super-small text-muted py-2 bg-light rounded border border-dashed">No hay capturas registradas</div>
                </div>

                <div v-else-if="activeSubConfigTab === 'documentos'" class="fade-in-sub">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="super-small fw-bold text-dark"><i class="bi bi-file-earmark-pdf"></i> Archivos PDF Descargables</span>
                    <button type="button" class="btn btn-link p-0 x-small fw-bold text-success text-decoration-none" @click="addDocumentToAssembly(idx)">+ Adjunto</button>
                  </div>
                  
                  <div v-for="(doc, dIdx) in asm.documentos" :key="dIdx" class="border rounded p-2 bg-light position-relative mb-2 shadow-xs">
                    <button type="button" class="btn-close-sub-doc" @click="removeDocumentFromAssembly(idx, dIdx)">×</button>
                    <div class="mb-1.5">
                      <input type="text" v-model="doc.name" class="form-control form-control-xs fw-bold font-semibold" placeholder="Nombre (ej: Acta de Sesión)">
                    </div>
                    <div class="input-group input-group-xs">
                      <input type="text" v-model="doc.url" class="form-control font-mono super-small-text bg-white" placeholder="Ruta del archivo adjunto...">
                      <button type="button" class="btn btn-outline-danger py-0 px-1.5" @click="$emit('select-image', { item: doc, field: 'url' })">
                        <i class="bi bi-cloud-arrow-up"></i>
                      </button>
                    </div>
                  </div>
                  <div v-if="!asm.documentos?.length" class="text-center super-small text-muted py-2 bg-light rounded border border-dashed">No hay archivos PDF cargados</div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
/* =========================================================================
      🎨 MAQUETACIÓN NATIVA PANEL COMPACTO (MÁXIMA COMODIDAD INTERACTIVA)
   ========================================================================= */

.sidebar-title { font-size: 0.95rem; letter-spacing: -0.1px; }
.section-title { font-size: 0.65rem; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; }
.x-small { font-size: 0.65rem; }
.small-text { font-size: 0.75rem; }
.super-small { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.2px; }
.super-small-text { font-size: 0.68rem; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-mono { font-family: monospace; }
.small-title { font-size: 0.82rem; }
.text-slate-title { color: #334155; }
.mb-1 { margin-bottom: 6px; }
.shadow-xs { box-shadow: 0 1px 4px rgba(0,0,0,0.02); }
.clickable { cursor: pointer; }

.form-control-xs, .form-select-xs { height: 28px; font-size: 0.72rem; padding: 2px 6px; }

/* Acordeón Principal por Año */
.accordion-block-item { width: 100%; box-sizing: border-box; }
.accordion-block-trigger {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; background-color: #ffffff; border: 1px solid #e2e8f0;
  border-radius: 8px; cursor: pointer; transition: all 0.2s ease;
}
.accordion-block-trigger:hover, .accordion-trigger-active {
  background-color: #f8fafc; border-color: #cbd5e1;
}
.accordion-trigger-active { border-radius: 8px 8px 0 0; border-bottom-color: transparent !important; }

/* Botones del sub-tab de control interno */
.btn-sub-tab { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; padding: 4px 2px; border-radius: 4px; }
.var-tabs-bg { background-color: #f1f5f9; }

/* Miniaturas de Previsualización Fotográfica */
.thumb-preview-box {
  width: 100%; height: 48px; background-size: cover; background-position: center;
  background-repeat: no-repeat; background-color: #ffffff; border: 1px solid #cbd5e1;
  border-radius: 6px; display: grid; place-items: center; cursor: pointer;
}
.thumb-preview-box:hover { border-color: #0d6efd; background-color: #f1f7fe; }

.btn-remove-photo-badge {
  position: absolute; top: -6px; right: -2px; width: 14px; height: 14px;
  background-color: #ef4444; color: white; font-size: 9px; font-weight: 900;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  border: none; cursor: pointer; z-index: 10;
}

.btn-close-sub-doc {
  position: absolute; top: 0; right: 0; margin: 2px 4px; background: transparent;
  border: none; cursor: pointer; color: #94a3b8; font-size: 0.95rem; line-height: 1;
}
.btn-close-sub-doc:hover { color: #ef4444; }

.overflow-auto-custom { box-sizing: border-box; max-height: 82vh; }
.overflow-auto-custom::-webkit-scrollbar { width: 4px; }
.overflow-auto-custom::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.pro-editor { box-sizing: border-box; }

.fade-in-sub { animation: fadeInSub 0.15s ease-out forwards; }
@keyframes fadeInSub { from { opacity: 0; } to { opacity: 1; } }
</style>