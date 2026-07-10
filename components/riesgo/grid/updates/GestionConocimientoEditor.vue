<script setup lang="ts">
import { ref, watch } from 'vue';
import type { KnowledgeBlockData, DocumentoAsset, CategoriaTab } from '../views/GestionConocimiento.vue';

const props = defineProps<{ modelValue: KnowledgeBlockData | null }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

// --- 🎯 ENFORZAMIENTO DE TIPADO ESTRICTO DE REPOSITORIO DINÁMICO ---
const localData = ref<Required<KnowledgeBlockData>>({
  title: props.modelValue?.title || 'Encuentre su Memoria',
  introText: props.modelValue?.introText || 'Accede a los documentos oficiales que rigen el funcionamiento de nuestra Red.',
  categorias: props.modelValue?.categorias?.length 
    ? JSON.parse(JSON.stringify(props.modelValue.categorias))
    : [
        { label: 'Documentos\nde Gobernanza', value: 'gobernanza' },
        { label: 'Planes\nOperativos', value: 'planes' },
        { label: 'Actas y\nResoluciones', value: 'actas' }
      ],
  documentos: props.modelValue?.documentos 
    ? JSON.parse(JSON.stringify(props.modelValue.documentos))
    : { gobernanza: [], planes: [], actas: [] }
});

// Controles reactivos de colapso y pestaña activa de edición
const activeTabKey = ref<string>('gobernanza');
const isBaseTextsOpen = ref(false);
const isCategoryManagerOpen = ref(false); // Acordeón exclusivo para crear/borrar pestañas

// ── 🚀 ACCIONES MAESTRAS DE CATEGORÍAS CON TIPADO Y ARRANQUE SEGURO ──
const addCustomCategory = () => {
  // Generamos un token aleatorio inmutable para que actúe como llave del diccionario
  const randomToken = 'cat_' + Math.random().toString(36).substring(2, 7);
  
  // Inyectamos el nuevo nodo respetando la interfaz CategoriaTab
  localData.value.categorias.push({
    label: 'Nueva Categoría',
    value: randomToken
  });

  // 🎯 CLAVE DE INGENIERÍA: Inicializamos su repositorio vacío en el diccionario al instante
  localData.value.documentos[randomToken] = [];
  
  // Movemos el foco del administrador a la nueva pestaña creada
  activeTabKey.value = randomToken;
};

const removeCustomCategory = (index: number, catValue: string) => {
  // Removemos la pestaña de la botonera
  localData.value.categorias.splice(index, 1);
  
  // Limpiamos su árbol documental de la memoria para no acumular basura en el JSON
  if (localData.value.documentos[catValue]) {
    delete localData.value.documentos[catValue];
  }

  // Control defensivo: Si eliminamos la pestaña activa, movemos el foco a la primera que quede viva
  if (activeTabKey.value === catValue) {
    activeTabKey.value = localData.value.categorias[0]?.value || '';
  }
};

// ── 📝 ACCIONES DOCUMENTALES INCREMENTALES ──
const addDocumentoToActiveTab = () => {
  if (!localData.value.documentos[activeTabKey.value]) {
    localData.value.documentos[activeTabKey.value] = [];
  }

  const nuevoDocumento: DocumentoAsset = {
    tipo: 'PDF',
    titulo: 'Nuevo Lineamiento o Acta Oficial',
    fileUrl: ''
  };

  localData.value.documentos[activeTabKey.value].push(nuevoDocumento);
};

const removeDocumento = (index: number) => {
  localData.value.documentos[activeTabKey.value].splice(index, 1);
};

// Sincronizador máster contra el Canvas Central libre de loops reactivos
watch(localData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });

watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(newVal) !== JSON.stringify(localData.value)) {
    localData.value.title = newVal.title || '';
    localData.value.introText = newVal.introText || '';
    if (newVal.categorias) localData.value.categorias = JSON.parse(JSON.stringify(newVal.categorias));
    if (newVal.documentos) localData.value.documentos = JSON.parse(JSON.stringify(newVal.documentos));
  }
}, { deep: true });
</script>

<template>
  <div class="p-3 custom-knowledge-sidebar">
    
    <h6 class="fw-bold mb-3 table-title-main border-bottom pb-2">
      <i class="bi bi-sliders text-primary me-2"></i> Repositorio Avanzado
    </h6>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-header bg-white p-2 border-0 clickable d-flex justify-content-between align-items-center" @click="isBaseTextsOpen = !isBaseTextsOpen">
        <h6 class="fw-bold mb-0 text-warning small-title"><i class="las la-heading"></i> 1. Títulos de Sección</h6>
        <i class="bi" :class="isBaseTextsOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </div>
      
      <div class="card-body pt-0 mt-2" v-show="isBaseTextsOpen">
        <div class="mb-2">
          <label class="x-small fw-bold text-muted mb-1">Título de la Sección</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm fw-bold">
        </div>
        <div class="mb-0">
          <label class="x-small fw-bold text-muted mb-1">Párrafo Introductorio</label>
          <textarea v-model="localData.introText" class="form-control form-control-sm small-text" rows="3"></textarea>
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-header bg-white p-2 border-0 clickable d-flex justify-content-between align-items-center" @click="isCategoryManagerOpen = !isCategoryManagerOpen">
        <h6 class="fw-bold mb-0 text-success small-title"><i class="las la-tags"></i> 2. Configurar Pestañas</h6>
        <i class="bi" :class="isCategoryManagerOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </div>
      
      <div class="card-body pt-0 mt-2" v-show="isCategoryManagerOpen">
        <span class="x-small text-muted mb-2 d-block">Modifica el texto o añade nuevas pestañas al menú superior interactivo:</span>
        
        <div class="category-manager-list mb-2">
          <div 
            v-for="(cat, cIdx) in localData.categorias" 
            :key="cat.value" 
            class="d-flex align-items-center gap-1 mb-2 bg-white p-1.5 rounded border shadow-xs"
          >
            <input type="text" v-model="cat.label" class="form-control form-control-xs fw-bold" placeholder="Nombre Pestaña">
            
            <button 
              type="button" 
              class="btn btn-sm btn-outline-danger px-1.5 border-0 py-0" 
              @click="removeCustomCategory(cIdx, cat.value)"
              :disabled="localData.categorias.length <= 1"
              title="Borrar pestaña y sus archivos"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <button type="button" @click="addCustomCategory" class="btn btn-xs btn-outline-success w-100 font-bold">
          + Crear Nueva Pestaña / Categoría
        </button>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-2 text-primary small-title"><i class="las la-folder-open"></i> 3. Cargar Archivos</h6>
        
        <label class="x-small fw-bold text-muted mb-1.5 d-block">Pestaña bajo edición actual:</label>
        <div class="d-flex flex-wrap gap-1 mb-3 bg-white p-1 rounded border shadow-xs">
          <button 
            v-for="cat in localData.categorias" 
            :key="cat.value"
            type="button"
            @click="activeTabKey = cat.value"
            class="btn btn-xs font-semibold flex-grow-1 text-truncate"
            :class="activeTabKey === cat.value ? 'btn-primary text-white' : 'btn-light border-0 text-secondary'"
            style="max-width: 120px;"
          >
            {{ cat.label.replace('\n', ' ') }}
          </button>
        </div>

        <span class="x-small fw-bold text-dark d-block mb-2">
          Documentos inyectados en la pestaña activa:
        </span>

        <div class="scroll-stack-wrapper custom-mini-scrollbar">
          <div 
            v-for="(doc, idx) in localData.documentos[activeTabKey]" 
            :key="idx"
            class="border rounded p-2 bg-light mb-3 position-relative shadow-xs"
          >
            <button type="button" @click="removeDocumento(idx)" class="btn btn-xs btn-link text-danger position-absolute top-0 end-0 p-1">
              <i class="bi bi-trash3-fill"></i>
            </button>

            <div class="row g-2 mt-1">
              <div class="col-4">
                <label class="super-small fw-bold text-muted mb-0.5">Extensión</label>
                <select v-model="doc.tipo" class="form-select form-select-xs fw-bold text-secondary">
                  <option value="PDF">PDF</option>
                  <option value="PPT">PPT</option>
                  <option value="VIDEO">VIDEO</option>
                  <option value="DOCX">DOCX</option>
                </select>
              </div>
              <div class="col-8 pe-3">
                <label class="super-small fw-bold text-muted mb-0.5">Título o Nombre</label>
                <input type="text" v-model="doc.titulo" class="form-control form-control-xs fw-semibold">
              </div>

              <div class="col-12 mt-1">
                <label class="super-small fw-bold text-danger d-block mb-0.5">Enlace de Descarga</label>
                <div class="input-group input-group-xs">
                  <input type="text" v-model="doc.fileUrl" class="form-control font-mono super-small-text bg-white" placeholder="Ruta del archivo adjunto...">
                  <button type="button" class="btn btn-outline-danger py-0 px-1.5" @click="$emit('select-image', { item: doc, field: 'fileUrl' })">
                    <i class="las la-cloud-upload-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!localData.documentos[activeTabKey]?.length" class="text-center x-small text-muted py-4 bg-white border border-dashed rounded mb-2">
            No hay documentos registrados en esta pestaña.
          </div>
        </div>

        <button type="button" @click="addDocumentoToActiveTab" class="btn btn-sm btn-outline-success w-100 mt-2">
          <i class="las la-plus"></i> Añadir Documento a esta Pestaña
        </button>

      </div>
    </div>

  </div>
</template>

<style scoped>
.table-title-main { font-size: 0.95rem; letter-spacing: -0.1px; }
.x-small { font-size: 0.65rem; }
.small-text { font-size: 0.75rem; }
.super-small { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.2px; }
.super-small-text { font-size: 0.68rem; }
.font-semibold { font-weight: 600; }
.font-mono { font-family: monospace; }
.small-title { font-size: 0.82rem; }
.mb-1 { margin-bottom: 6px; }
.shadow-xs { box-shadow: 0 1px 4px rgba(0,0,0,0.02); }
.clickable { cursor: pointer; }
.flex-grow-1 { flex: 1; }

.form-control-xs, .form-select-xs { height: 28px; font-size: 0.72rem; padding: 2px 6px; }

.scroll-stack-wrapper { max-height: 42vh; overflow-y: auto; padding-right: 4px; }
.scroll-stack-wrapper::-webkit-scrollbar { width: 4px; }
.scroll-stack-wrapper::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.custom-knowledge-sidebar { box-sizing: border-box; }
</style>