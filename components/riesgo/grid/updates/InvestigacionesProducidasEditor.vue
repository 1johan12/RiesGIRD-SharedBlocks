<script setup lang="ts">
import { ref, watch } from 'vue';
import type { InvestigationsBlockData, InvestigationNode } from '../views/InvestigacionesProducidas.vue';

const props = defineProps<{ modelValue: InvestigationsBlockData | null }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

// --- 🎯 ENFORZAMIENTO DE TIPADO ESTRICTO DE REPOSITORIO PLANO ---
const localData = ref<Required<InvestigationsBlockData>>({
  title: props.modelValue?.title || 'Encuentra su investigacion',
  introText: props.modelValue?.introText || 'Explora nuestra base de datos de producción científica.',
  items: Array.isArray(props.modelValue?.items)
    ? props.modelValue.items.map((b: any) => ({
        id: b.id || Date.now() + Math.random(),
        autor: b.autor || '',
        tipo: b.tipo || 'Título',
        titulo: b.titulo || '',
        fileUrl: b.fileUrl || ''
      }))
    : []
});

// Controladores visuales colapsables del panel administrativo
const expandedInvestigationIdx = ref<number | null>(0); // Mantiene expandido solo la primera ficha científica al entrar
const isBaseTextsOpen = ref(false);

const toggleAccordion = (index: number) => {
  expandedInvestigationIdx.value = expandedInvestigationIdx.value === index ? null : index;
};

// ── 🎯 ACCIONES CON TIPADO ESTRICTO EN EL PUSH INCREMENTAL DE GUARDADO ──
const addInvestigationItem = () => {
  const nuevoNodo: InvestigationNode = {
    id: Date.now(),
    autor: 'Investigador / Comité Técnico RIESGIRD',
    tipo: 'Título',
    titulo: 'Nueva investigación sobre mitigación o desastres naturales',
    fileUrl: '' // Inicia en blanco listo para el Media Manager
  };
  localData.value.items.push(nuevoNodo);
  expandedInvestigationIdx.value = localData.value.items.length - 1; // Expande automáticamente la nueva ficha
};

const removeInvestigationItem = (index: number) => {
  localData.value.items.splice(index, 1);
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
    if (Array.isArray(newVal.items)) {
      localData.value.items = newVal.items;
    }
  }
}, { deep: true });
</script>

<template>
  <div class="p-3 custom-investigations-sidebar">
    
    <h6 class="fw-bold mb-3 sidebar-main-title border-bottom pb-2">
      <i class="bi bi-sliders text-danger me-2"></i> Repositorio Científico
    </h6>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-header bg-white p-2 border-0 clickable d-flex justify-content-between align-items-center" @click="isBaseTextsOpen = !isBaseTextsOpen">
        <h6 class="fw-bold mb-0 text-warning small-title"><i class="las la-heading"></i> 1. Títulos Base</h6>
        <i class="bi" :class="isBaseTextsOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </div>
      
      <div class="card-body pt-0 mt-2" v-show="isBaseTextsOpen">
        <div class="mb-3">
          <label class="x-small fw-bold text-muted mb-1">Título de la Sección</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm fw-bold">
        </div>
        <div class="mb-0">
          <label class="x-small fw-bold text-muted mb-1">Reseña Descriptiva</label>
          <textarea v-model="localData.introText" class="form-control form-control-sm small-text" rows="3"></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-primary small-title"><i class="las la-file-alt"></i> 2. Fichas Científicas</h6>
          <span class="badge bg-secondary text-white small font-mono">{{ localData.items.length }}</span>
        </div>

        <div class="scroll-stack-wrapper custom-mini-scrollbar">
          <div 
            v-for="(item, idx) in localData.items" 
            :key="item.id || idx"
            class="accordion-item-box mb-2"
          >
            <div 
              class="accordion-item-bar" 
              @click="toggleAccordion(idx)"
              :class="{ 'accordion-bar-active': expandedInvestigationIdx === idx }"
            >
              <div class="d-flex align-items-center gap-1.5 overflow-hidden">
                <span class="badge bg-primary x-small font-bold text-uppercase py-1">{{ item.tipo }}</span>
                <span class="x-small fw-bold text-slate-title text-truncate" style="max-width: 150px;">
                  {{ item.titulo || 'Nueva investigación...' }}
                </span>
              </div>
              <i class="bi" :class="expandedInvestigationIdx === idx ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>

            <div class="accordion-item-body-content" v-show="expandedInvestigationIdx === idx">
              <div class="p-3 bg-white border border-top-0 rounded-bottom-3 position-relative">
                
                <button 
                  type="button" 
                  class="btn btn-xs btn-link text-danger position-absolute top-0 end-0 p-1 m-0.5"
                  @click="removeInvestigationItem(idx)"
                  :disabled="localData.items.length <= 1"
                  title="Eliminar esta ficha"
                >
                  <i class="bi bi-trash3-fill"></i>
                </button>

                <div class="row g-2 mt-1">
                  <div class="col-12">
                    <label class="super-small fw-bold text-muted mb-0.5">Autor / Comité Redactante</label>
                    <input type="text" v-model="item.autor" class="form-control form-control-xs fw-semibold" placeholder="Ej: Equipo Nodo Centro">
                  </div>
                  
                  <div class="col-4">
                    <label class="super-small fw-bold text-muted mb-0.5">Clasificación</label>
                    <select v-model="item.tipo" class="form-select form-select-xs fw-bold text-secondary">
                      <option value="Título">Título</option>
                      <option value="Policy Brief">Policy Brief</option>
                      <option value="Artículo">Artículo</option>
                      <option value="Tesis">Tesis</option>
                    </select>
                  </div>

                  <div class="col-8 pe-3">
                    <label class="super-small fw-bold text-muted mb-0.5">Título de la Publicación</label>
                    <input type="text" v-model="item.titulo" class="form-control form-control-xs fw-bold">
                  </div>

                  <div class="col-12 border-top pt-2 mt-2">
                    <label class="super-small fw-bold text-danger d-block mb-1">Documento Científico Adjunto (Descarga)</label>
                    <div class="input-group input-group-xs">
                      <input type="text" v-model="item.fileUrl" class="form-control font-mono super-small-text bg-white" placeholder="Ningún archivo linkeado...">
                      <button type="button" class="btn btn-outline-danger py-0 px-1.5" @click="$emit('select-image', { item: item, field: 'fileUrl' })">
                        <i class="las la-cloud-upload-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <button type="button" @click="addInvestigationItem" class="btn btn-sm btn-outline-success w-100 mt-2 font-bold">
          <i class="las la-plus"></i> Registrar Nueva Ficha Científica
        </button>

      </div>
    </div>

  </div>
</template>

<style scoped>
.sidebar-main-title { font-size: 0.95rem; letter-spacing: -0.1px; }
.section-title { font-size: 0.65rem; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; }
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
.text-slate-title { color: #334155; }

.form-control-xs, .form-select-xs { height: 28px; font-size: 0.72rem; padding: 2px 6px; }

/* Acordeones */
.accordion-item-box { width: 100%; box-sizing: border-box; }
.accordion-item-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; background-color: #ffffff; border: 1px solid #e2e8f0;
  border-radius: 8px; cursor: pointer; transition: all 0.2s ease;
}
.accordion-item-bar:hover, .accordion-bar-active {
  background-color: #f8fafc; border-color: #cbd5e1;
}
.accordion-bar-active { border-radius: 8px 8px 0 0; border-bottom-color: transparent !important; }

.scroll-stack-wrapper { max-height: 48vh; overflow-y: auto; padding-right: 4px; }
.scroll-stack-wrapper::-webkit-scrollbar { width: 4px; }
.scroll-stack-wrapper::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.custom-investigations-sidebar { box-sizing: border-box; }
</style>