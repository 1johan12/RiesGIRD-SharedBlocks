<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ScrollHubBlockConfig, ScrollContentBlock, ScrollDocItem } from '../views/AcuerdosScrollHub.vue';

const props = defineProps<{ modelValue: ScrollHubBlockConfig | null }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref<Required<ScrollHubBlockConfig>>({
  titleSection: props.modelValue?.titleSection || 'Repositorio Documental de Acuerdos',
  introSection: props.modelValue?.introSection || 'Consulte los documentos, actas y resoluciones oficiales emitidas por los comités institucionales.',
  maxHeightPx: props.modelValue?.maxHeightPx || 460,
  blocks: Array.isArray(props.modelValue?.blocks) ? JSON.parse(JSON.stringify(props.modelValue.blocks)) : []
});

const isGeneralOpen = ref(true);

const customQuillToolbar = [
  ['bold', 'italic', 'underline'],                         
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],            
  ['clean']                                                
];

const insertNewContentBlock = (type: 'document_grid' | 'html_raw') => {
  const nuevoBloque: ScrollContentBlock = {
    id: 'blk_' + Math.random().toString(36).substring(2, 7),
    type: type,
    blockTitle: type === 'document_grid' ? 'Nuevo Cuadro de Descargas' : 'Nuevo Texto Informativo',
    blockIntro: 'Escribe una breve bajada o introducción aquí...',
    htmlContent: type === 'html_raw' ? '<p>Escribe tu contenido aquí...</p>' : '',
    documents: type === 'document_grid' ? [] : undefined
  };
  localData.value.blocks.push(nuevoBloque);
};

const addFileToBlock = (block: ScrollContentBlock) => {
  if (!block.documents) block.documents = [];
  block.documents.push({
    id: Date.now(),
    title: 'Nuevo Documento Técnico Registrado',
    category: 'Resolución',
    publish_date: new Date().toISOString().split('T')[0],
    file_size: '1.2 MB',
    download_url: '/'
  });
};

watch(localData, (newVal) => { emit('update:modelValue', { ...newVal }); }, { deep: true });

watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(newVal) !== JSON.stringify(localData.value)) {
    localData.value.titleSection = newVal.titleSection || '';
    localData.value.introSection = newVal.introSection || '';
    localData.value.maxHeightPx = newVal.maxHeightPx || 460;
    if (newVal.blocks) localData.value.blocks = JSON.parse(JSON.stringify(newVal.blocks));
  }
}, { deep: true });
</script>

<template>
  <div class="p-3 custom-scroll-sidebar">
    <h6 class="fw-bold mb-3 border-bottom pb-2 sidebar-title-main">
      <i class="bi bi-file-earmark-post-fill text-danger me-2"></i> Repositorio Avanzado
    </h6>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-header bg-white p-2 border-0 clickable d-flex justify-content-between align-items-center" @click="isGeneralOpen = !isGeneralOpen">
        <span class="fw-bold small text-warning"><i class="bi bi-gear-fill me-1"></i> 1. Cabecera del Módulo</span>
        <i class="bi" :class="isGeneralOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </div>
      <div class="card-body pt-0 mt-2" v-show="isGeneralOpen">
        <div class="mb-2">
          <label class="super-small fw-bold text-muted mb-0.5">Título Máster (H2)</label>
          <input type="text" v-model="localData.titleSection" class="form-control form-control-sm fw-bold">
        </div>
        <div class="mb-2">
          <label class="super-small fw-bold text-muted mb-0.5">Texto Introductorio General</label>
          <textarea v-model="localData.introSection" class="form-control form-control-sm small-text" rows="2"></textarea>
        </div>
        <div class="row g-2">
          <div class="col-12">
            <label class="super-small fw-bold text-muted mb-0.5">Alto Límite (px)</label>
            <input type="number" v-model="localData.maxHeightPx" class="form-control form-control-sm font-mono text-center fw-bold">
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-2">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="fw-bold small text-primary"><i class="bi bi-layers-half me-1"></i> 2. Bloques del Scroll</span>
          <div class="btn-group btn-group-xs">
            <button type="button" class="btn btn-outline-primary fw-bold" @click="insertNewContentBlock('document_grid')">+ Cuadro</button>
            <button type="button" class="btn btn-outline-secondary fw-bold" @click="insertNewContentBlock('html_raw')">+ Texto</button>
          </div>
        </div>

        <div class="scroll-inner-stack custom-mini-scrollbar">
          <div v-for="(block, idx) in localData.blocks" :key="block.id" class="border rounded p-2 bg-light mb-3 position-relative shadow-xs">
            
            <button type="button" class="btn btn-link text-danger position-absolute top-0 end-0 p-1 py-0 x-small border-0" @click="localData.blocks.splice(idx,1)">
              <i class="bi bi-trash-fill"></i>
            </button>

            <span class="badge position-absolute top-0 start-0 m-1 text-uppercase super-small" :class="block.type === 'document_grid' ? 'bg-primary' : 'bg-secondary'">{{ block.type === 'document_grid' ? 'Cuadro' : 'Texto' }}</span>

            <div class="row g-2 mt-2">
              <div class="col-12">
                <label class="super-small fw-bold text-muted mb-0.5">Título del Bloque Interno (H2)</label>
                <input type="text" v-model="block.blockTitle" class="form-control form-control-sm fw-bold">
              </div>
              <div class="col-12">
                <label class="super-small fw-bold text-muted mb-0.5">Introducción Corta Interna</label>
                <input type="text" v-model="block.blockIntro" class="form-control form-control-sm small-text">
              </div>

              <div class="col-12" v-if="block.type === 'html_raw'">
                <label class="super-small fw-bold text-secondary mb-1 d-block">Contenido Enriquecido</label>
                <div class="quill-editor-sidebar-wrapper">
                  <QuillEditor 
                    v-model:content="block.htmlContent" 
                    contentType="html" 
                    theme="snow"
                    :toolbar="customQuillToolbar"
                    placeholder="Escribe, pon negrita o añade listas con viñetas..."
                  />
                </div>
              </div>

              <div class="col-12" v-else>
                <div class="d-flex justify-content-between align-items-center mb-1.5">
                  <span class="super-small fw-bold text-dark">Filas del Cuadro:</span>
                  <button type="button" class="btn btn-link p-0 text-success super-small text-decoration-none fw-bold" @click="addFileToBlock(block)">+ Ficha</button>
                </div>

                <div v-for="(doc, dIdx) in block.documents" :key="dIdx" class="bg-white border rounded p-2 mb-1.5 position-relative">
                  <button type="button" class="btn btn-link text-danger position-absolute top-0 end-0 p-0 px-1 x-small border-0" @click="block.documents?.splice(dIdx,1)"><i class="bi bi-x-circle-fill"></i></button>
                  <input type="text" v-model="doc.title" class="form-control form-control-xs small-text fw-bold mb-1" placeholder="Título">
                  <div class="row g-1">
                    <div class="col-6"><input type="text" v-model="doc.category" class="form-control form-control-xs super-small-text text-center" placeholder="Tag"></div>
                    <div class="col-6"><input type="text" v-model="doc.file_size" class="form-control form-control-xs super-small-text text-center font-mono" placeholder="Peso"></div>
                  </div>
                  <input type="text" v-model="doc.download_url" class="form-control form-control-xs font-mono super-small-text mt-1" placeholder="Ruta link...">
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
.sidebar-title-main { font-size: 0.95rem; }
.small-text { font-size: 0.72rem; line-height: 1.4; }
.super-small { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.2px; }
.super-small-text { font-size: 0.68rem; }
.font-mono { font-family: monospace; }
.clickable { cursor: pointer; }
.shadow-xs { box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.mb-1 { margin-bottom: 6px; }

.form-control-xs, .form-select-xs { height: 28px; font-size: 0.72rem; padding: 2px 6px; }
.scroll-inner-stack { max-height: 48vh; overflow-y: auto; padding-right: 2px; }
.custom-mini-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-mini-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }

/* ── CONTENCIÓN DE SEGURIDAD PARA EL CONTROLADOR DE QUILL EN SIDEBAR ── */
.quill-editor-sidebar-wrapper :deep(.ql-container) {
  min-height: 160px; max-height: 240px; overflow-y: auto; font-size: 0.8rem; background-color: #ffffff;
}
.quill-editor-sidebar-wrapper :deep(.ql-toolbar) {
  padding: 4px; background-color: #f8fafc; border-bottom: 1px solid #ccc !important;
}
.custom-scroll-sidebar { box-sizing: border-box; }
</style>