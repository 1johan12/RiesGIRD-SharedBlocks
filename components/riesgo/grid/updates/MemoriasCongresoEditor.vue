<script setup lang="ts">
import { ref, watch } from 'vue';

// ── 🧠 INTERFACES DE CONTRATO ESTRICTO PARA EL GUARDADO (TIPADO COMPLETO) ──
export interface DocumentoEntregable {
  tipo: 'PDF' | 'PPT' | 'VIDEO' | string;
  titulo: string;
  fileUrl: string;
}

export interface GaleriaMultimedia {
  imageUrl: string;  // Ruta o URL tomada directamente desde la galería de medios
  actionUrl: string; // Enlace de redirección externa al álbum
}

export interface CongresoNode {
  id: number | string;
  year: string;
  eventName: string;
  description: string;
  reportFileUrl: string; // PDF Consolidado del botón inferior
  documentos: DocumentoEntregable[];
  galerias: GaleriaMultimedia[];
}

export interface MemoriasBlockData {
  title: string;
  introText: string;
  historialCongresos: CongresoNode[];
}

const props = defineProps<{ modelValue: MemoriasBlockData | null }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

// --- ESTADO RECONSTRUIDO LOCAL CORREGIDO ---
const localData = ref<MemoriasBlockData>({
  title: props.modelValue?.title || 'Memorias de Congresos Internacionales RiesGIRD-ACC',
  introText: props.modelValue?.introText || 'Revive las ponencias, debates y acuerdos de nuestros principales espacios de articulación.',
  historialCongresos: Array.isArray(props.modelValue?.historialCongresos) 
    ? props.modelValue.historialCongresos.map((b: any) => ({
        id: b.id || Date.now() + Math.random(),
        year: b.year || '2026',
        eventName: b.eventName || '',
        description: b.description || '',
        reportFileUrl: b.reportFileUrl || '',
        documentos: Array.isArray(b.documentos) ? b.documentos.map((d: any) => ({ tipo: d.tipo || 'PDF', titulo: d.titulo || '', fileUrl: d.fileUrl || '' })) : [],
        galerias: Array.isArray(b.galerias) ? b.galerias.map((g: any) => ({ imageUrl: g.imageUrl || '', actionUrl: g.actionUrl || '' })) : []
      }))
    : []
});

// --- CONTROLES REACTIVOS DE SECCIONES DESPLEGABLES (ACORDEONES) ---
const isHeaderSectionOpen = ref(false); // Por defecto cerrado para ahorrar espacio visual
const expandedCongressIdx = ref<number | null>(0); // Mantiene expandido solo el primer año al iniciar

const toggleHeaderSection = () => {
  isHeaderSectionOpen.value = !isHeaderSectionOpen.value;
};

const toggleCongressAccordion = (index: number) => {
  expandedCongressIdx.value = expandedCongressIdx.value === index ? null : index;
};

// --- GESTIÓN INCREMENTAL DE ENTREGABLES CORTOS ---
const addDocumento = (congresoIdx: number) => {
  localData.value.historialCongresos[congresoIdx].documentos.push({
    tipo: 'PDF',
    titulo: 'Nuevo Documento Adjunto',
    fileUrl: ''
  });
};

const removeDocumento = (congresoIdx: number, docIdx: number) => {
  localData.value.historialCongresos[congresoIdx].documentos.splice(docIdx, 1);
};

// --- 🎯 GESTIÓN INCREMENTAL REAL DE GALERÍAS MULTIMEDIA (FOTOS) ---
const addGalleryItem = (congresoIdx: number) => {
  localData.value.historialCongresos[congresoIdx].galerias.push({
    imageUrl: '',  // Placeholder vacío para detonar el previsualizador gris interactivo
    actionUrl: '/'
  });
};

const removeGalleryItem = (congresoIdx: number, galIdx: number) => {
  localData.value.historialCongresos[congresoIdx].galerias.splice(galIdx, 1);
};

// --- HELPER DE PREVISUALIZACIÓN DE MINIATURAS ---
const formatThumbUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `http://127.0.0.1:4000/storage/${url}`;
};

// Sincronización bidireccional limpia contra el canvas y orquestador del CMS
watch(localData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });

watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(newVal) !== JSON.stringify(localData.value)) {
    localData.value = {
      title: newVal.title || '',
      introText: newVal.introText || '',
      historialCongresos: Array.isArray(newVal.historialCongresos) ? newVal.historialCongresos : []
    };
  }
}, { deep: true });

// Controlador maestro para añadir nuevos años cronológicos completos
const addCongresoAnio = () => {
  const nuevoAño: CongresoNode = {
    id: Date.now(),
    year: (new Date().getFullYear()).toString(),
    eventName: 'Congreso Internacional Anual',
    description: '',
    reportFileUrl: '',
    documentos: [{ tipo: 'PDF', titulo: 'Declaratoria Oficial', fileUrl: '' }],
    galerias: [] // Comienza limpio listo para añadir fotos de forma incremental
  };
  localData.value.historialCongresos.unshift(nuevoAño); // Lo añade al inicio de la lista
  expandedCongressIdx.value = 0; // Abre automáticamente el acordeón del nuevo elemento
};
</script>

<template>
  <div class="pro-editor bg-white rounded-4 border p-3 mt-2 shadow-sm h-100 overflow-auto-custom">
    <h6 class="fw-bold mb-3 pb-2 border-bottom d-flex align-items-center raw-title">
      <i class="bi bi-pencil-square text-danger fs-5 me-2"></i> Editor de Memorias Pro
    </h6>

    <div class="collapsible-section-wrapper mb-3">
      <div class="collapsible-trigger-header" @click="toggleHeaderSection" :class="{ 'header-active': isHeaderSectionOpen }">
        <span class="fw-bold text-uppercase x-small tracking-wider"><i class="las la-heading me-1 fs-15"></i> 1. Textos del Encabezado</span>
        <i class="bi" :class="isHeaderSectionOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </div>
      
      <div class="collapsible-body-content" v-show="isHeaderSectionOpen">
        <div class="p-3 bg-light border border-top-0 rounded-bottom-3">
          <div class="mb-2">
            <label class="x-small fw-bold text-muted mb-1">Título General de la Sección</label>
            <input type="text" v-model="localData.title" class="form-control form-control-sm font-semibold">
          </div>
          <div class="mb-0">
            <label class="x-small fw-bold text-muted mb-1">Descripción / Subtítulo</label>
            <textarea v-model="localData.introText" class="form-control form-control-sm small-text" rows="3"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-2">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <label class="section-title text-muted mb-0">2. CRONOLOGÍA DE EVENTOS</label>
        <button type="button" class="btn btn-xs btn-outline-success px-2 py-0.5" @click="addCongresoAnio">
          <i class="bi bi-plus-lg"></i> Añadir Año
        </button>
      </div>

      <div class="accordion-container-stack">
        <div 
          v-for="(block, idx) in localData.historialCongresos" 
          :key="block.id || idx"
          class="accordion-item-card mb-2"
        >
          <div 
            class="accordion-item-trigger" 
            @click="toggleCongressAccordion(idx)"
            :class="{ 'accordion-active': expandedCongressIdx === idx }"
          >
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-danger font-mono font-bold py-1 px-1.5">{{ block.year }}</span>
              <span class="fw-bold small text-truncate text-slate-title" style="max-width: 170px;">
                {{ block.eventName || 'Congreso sin título' }}
              </span>
            </div>
            <i class="bi" :class="expandedCongressIdx === idx ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
          </div>

          <div class="accordion-item-body" v-show="expandedCongressIdx === idx">
            <div class="p-3 bg-white border border-top-0 rounded-bottom-3 position-relative">
              
              <button 
                type="button" 
                class="btn btn-xs btn-link text-danger position-absolute top-0 end-0 m-1 p-1"
                @click="localData.historialCongresos.splice(idx, 1)"
                :disabled="localData.historialCongresos.length <= 1"
                title="Eliminar este año por completo"
              >
                <i class="bi bi-trash3-fill"></i>
              </button>

              <div class="row g-2 mb-2">
                <div class="col-4">
                  <label class="x-small fw-bold text-muted mb-0.5">Año</label>
                  <input type="text" v-model="block.year" class="form-control form-control-sm text-center font-bold">
                </div>
                <div class="col-8 pe-4">
                  <label class="x-small fw-bold text-muted mb-0.5">Nombre Corto</label>
                  <input type="text" v-model="block.eventName" class="form-control form-control-sm fw-bold" placeholder="Ej: Congreso Nacional">
                </div>
                <div class="col-12">
                  <label class="x-small fw-bold text-muted mb-0.5">Descripción de Ponencias</label>
                  <textarea v-model="block.description" class="form-control form-control-sm small-text" rows="2" placeholder="Resumen corto de los acuerdos..."></textarea>
                </div>
              </div>

              <div class="mb-3 border-top pt-2">
                <label class="x-small fw-bold text-danger d-block mb-1"><i class="las la-file-pdf"></i> Archivo Consolidado Oficial (PDF Principal)</label>
                <div class="input-group input-group-sm">
                  <input type="text" v-model="block.reportFileUrl" class="form-control font-mono x-small-text" placeholder="Selecciona el reporte final...">
                  <button type="button" class="btn btn-danger" @click="$emit('select-image', { item: block, field: 'reportFileUrl' })">
                    <i class="bi bi-cloud-upload"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3 border-top pt-2">
                <div class="d-flex justify-content-between align-items-center mb-1.5">
                  <span class="x-small fw-bold text-dark"><i class="las la-paperclip"></i> Recursos del Grid (Fichas)</span>
                  <button type="button" class="btn btn-link p-0 text-success x-small fw-bold text-decoration-none" @click="addDocumento(idx)">
                    + Añadir Ficha
                  </button>
                </div>

                <div v-for="(doc, dIdx) in block.documentos" :key="dIdx" class="border rounded p-2 bg-light position-relative mb-2">
                  <button type="button" class="btn-close-mini" @click="removeDocumento(idx, dIdx)">
                    <i class="bi bi-x"></i>
                  </button>

                  <div class="d-flex gap-1 align-items-center mb-1">
                    <select v-model="doc.tipo" class="form-select form-select-xs fw-bold select-type-box">
                      <option value="PDF">PDF</option>
                      <option value="PPT">PPT</option>
                      <option value="VIDEO">VIDEO</option>
                    </select>
                    <input type="text" v-model="doc.titulo" class="form-control form-control-xs font-semibold" placeholder="Título recurso...">
                  </div>
                  
                  <div class="input-group input-group-xs">
                    <input type="text" v-model="doc.fileUrl" class="form-control font-mono x-small-text" placeholder="Ruta del entregable...">
                    <button type="button" class="btn btn-outline-primary px-1.5 py-0" @click="$emit('select-image', { item: doc, field: 'fileUrl' })">
                      <i class="bi bi-file-earmark-plus"></i>
                    </button>
                  </div>
                </div>
                <div v-if="!block.documentos?.length" class="text-center x-small text-muted py-1.5 bg-light rounded">No hay recursos cortos</div>
              </div>

              <div class="border-top pt-2">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="x-small fw-bold text-dark"><i class="las la-camera"></i> Álbum Fotográfico (Incremental)</span>
                  <button type="button" class="btn btn-link p-0 text-primary x-small fw-bold text-decoration-none" @click="addGalleryItem(idx)">
                    + Añadir Foto
                  </button>
                </div>

                <div class="gallery-editor-list-stack">
                  <div 
                    v-for="(gal, gIdx) in block.galerias" 
                    :key="gIdx" 
                    class="gallery-item-editable-row border rounded bg-light p-2 mb-2 d-flex align-items-center gap-2 position-relative"
                  >
                    <div 
                      @click="$emit('select-image', { item: gal, field: 'imageUrl' })"
                      class="editor-thumbnail-preview border rounded shadow-xs text-center clickable"
                      :style="{ backgroundImage: gal.imageUrl ? `url(${formatThumbUrl(gal.imageUrl)})` : 'none' }"
                      title="Haz clic para seleccionar foto de la galería"
                    >
                      <i v-if="!gal.imageUrl" class="bi bi-image text-muted fs-6"></i>
                    </div>

                    <div class="flex-grow-1">
                      <label class="super-small d-block fw-bold text-muted mb-0.5">Link de Acción / Destino</label>
                      <input type="text" v-model="gal.actionUrl" class="form-control form-control-xs font-mono" placeholder="Ej: /album-fotos">
                    </div>

                    <button type="button" class="btn btn-sm text-danger p-1 border-0" @click="removeGalleryItem(idx, gIdx)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                <div v-if="!block.galerias?.length" class="text-center x-small text-muted py-2 border border-dashed rounded bg-white">
                  Presiona "+ Añadir Foto" para conectar imágenes de la galería
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
   🎨 INTERFAZ ERGONÓMICA COMPACTA DESPLEGABLE (BOOTSTRAP PANEL COMPLEMENTS)
   ========================================================================= */

.raw-title { font-size: 0.95rem; letter-spacing: -0.2px; }
.section-title { font-size: 0.65rem; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; }
.x-small { font-size: 0.68rem; }
.small-text { font-size: 0.75rem; }
.x-small-text { font-size: 0.7rem; }
.super-small { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.3px; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-mono { font-family: monospace; }
.text-slate-title { color: #334155; }
.mb-1 { margin-bottom: 6px; }

/* ── ESTILOS DE LOS ACORDEONES DESPLEGABLES ── */
.collapsible-trigger-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; background-color: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 8px; cursor: pointer; transition: all 0.2s ease; color: #475569;
}
.collapsible-trigger-header:hover, .header-active {
  background-color: #f1f5f9; color: #0f172a; border-color: #cbd5e1;
}
.header-active { border-radius: 8px 8px 0 0; }

.accordion-item-card { width: 100%; box-sizing: border-box; }
.accordion-item-trigger {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; background-color: #ffffff; border: 1px solid #e2e8f0;
  border-radius: 8px; cursor: pointer; transition: all 0.2s ease;
}
.accordion-item-trigger:hover, .accordion-active {
  background-color: #f8fafc; border-color: #cbd5e1;
}
.accordion-active { border-radius: 8px 8px 0 0; border-bottom-color: transparent !important; }

/* ── MULTIMEDIA: MINIATURA DE GALERÍA DE MEDIOS ── */
.editor-thumbnail-preview {
  width: 42px; height: 42px; background-size: cover; background-position: center;
  background-repeat: no-repeat; background-color: #ffffff; border: 1px solid #cbd5e1;
  border-radius: 6px; display: grid; place-items: center; flex-shrink: 0; cursor: pointer;
  transition: all 0.15s ease-in-out;
}
.editor-thumbnail-preview:hover {
  border-color: #0d6efd; background-color: #f1f7fe; transform: scale(1.02);
}

.form-control-xs, .form-select-xs { font-size: 0.72rem; padding: 0.2rem 0.4rem; height: 28px; }
.select-type-box { width: 80px; flex-shrink: 0; }
.border-dashed { border: 1px dashed #cbd5e1 !important; }

.btn-close-mini {
  position: absolute; top: 0; right: 0; margin: 4px; background: transparent;
  border: none; cursor: pointer; color: #94a3b8; font-size: 0.85rem; padding: 0 4px;
}
.btn-close-mini:hover { color: #ef4444; }

.overflow-auto-custom { box-sizing: border-box; max-height: 84vh; }
.overflow-auto-custom::-webkit-scrollbar { width: 4px; }
.overflow-auto-custom::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.pro-editor { box-sizing: border-box; }
.shadow-xs { box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
</style>