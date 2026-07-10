<script setup lang="ts">
import { ref, watch } from 'vue';

// ── 🧠 CONTRATOS DE CONEXIÓN DE ESTRUCTURA DEL PAGE BUILDER SINCED ──
export interface GridInfiniteConfig {
  title?: string;          // 🎯 CORREGIDO: Clave exacta amarrada a la vista pública
  introText?: string;      // 🎯 CORREGIDO: Clave exacta amarrada a la vista pública
  postType?: string;       // 🎯 required|in:news,event,calls,assemblies
  limitFetch?: number | string;
}

const props = defineProps<{
  modelValue: GridInfiniteConfig | null
}>();

const emit = defineEmits(['update:modelValue']);

// Localizador reactivo defensivo poblado con tus parámetros institucionales
const localData = ref<Required<GridInfiniteConfig>>({
  title: props.modelValue?.title || 'Eventos y Noticias Destacados', // 🎯 CORREGIDO
  introText: props.modelValue?.introText || 'Explore nuestro catálogo de informes, artículos de contingencia y producción científica.', // 🎯 CORREGIDO
  postType: props.modelValue?.postType || 'news', 
  limitFetch: props.modelValue?.limitFetch || 10
});

const isGeneralOpen = ref(true);
const isSourceOpen = ref(true);

// 🎯 Catálogo indexado estricto amarrado a tus validaciones: news, event, calls, assemblies
const contentTypesCatalog = [
  { value: 'news', label: '📰 Noticias de la Red' },
  { value: 'event', label: '📅 Eventos y Agendas' },
  { value: 'calls', label: '📣 Convocatorias Abiertas' },
  { value: 'assemblies', label: '🏛️ Asambleas de Rectores' }
];

// Vigilante profundo para despachar las actualizaciones instantáneas al Core Store del Canvas
watch(localData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });

// Sincronizador de entrada si el lienzo modifica el objeto desde fuera
watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(newVal) !== JSON.stringify(localData.value)) {
    localData.value.title = newVal.title || '';         // 🎯 CORREGIDO
    localData.value.introText = newVal.introText || ''; // 🎯 CORREGIDO
    localData.value.postType = newVal.postType || 'news'; 
    localData.value.limitFetch = newVal.limitFetch || 10;
  }
}, { deep: true });
</script>

<template>
  <div class="p-3 custom-grid-infinite-sidebar">
    <h6 class="fw-bold mb-3 border-bottom pb-2 sidebar-title-main">
      <i class="bi bi-grid-3x3-gap-fill text-danger me-2"></i> Grilla Infinita Editor
    </h6>

    <div class="card mb-3 border-0 shadow-sm">
      <div 
        class="card-header bg-white p-2 border-0 clickable d-flex justify-content-between align-items-center" 
        @click="isGeneralOpen = !isGeneralOpen"
      >
        <span class="fw-bold small text-warning"><i class="bi bi-pencil-square me-1"></i> 1. Textos de Cabecera</span>
        <i class="bi" :class="isGeneralOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </div>
      
      <div class="card-body pt-0 mt-2" v-show="isGeneralOpen">
        <div class="mb-2.5">
          <label class="super-small fw-bold text-muted mb-1 d-block">Título Máster de Sección (H2)</label>
          <input 
            type="text" 
            v-model="localData.title" 
            class="form-control form-control-sm fw-bold text-dark"
            placeholder="Ej: Eventos y Noticias Destacados"
          >
        </div>

        <div class="mb-1">
          <label class="super-small fw-bold text-muted mb-1 d-block">Descripción / Subtítulo Corto</label>
          <textarea 
            v-model="localData.introText" 
            class="form-control form-control-sm small-text" 
            rows="4"
            placeholder="Escribe la bajada introductoria del bloque..."
          ></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div 
        class="card-header bg-white p-2 border-0 clickable d-flex justify-content-between align-items-center" 
        @click="isSourceOpen = !isSourceOpen"
      >
        <span class="fw-bold small text-primary"><i class="bi bi-database-fill-gear me-1"></i> 2. Control de Origen</span>
        <i class="bi" :class="isSourceOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </div>
      
      <div class="card-body pt-0 mt-2" v-show="isSourceOpen">
        <div class="mb-2.5">
          <label class="super-small fw-bold text-primary mb-1 d-block">¿Qué TIPO de contenido cargará?</label>
          <select 
            v-model="localData.postType" 
            class="form-select form-select-sm fw-bold text-dark cursor-pointer"
          >
            <option 
              v-for="type in contentTypesCatalog" 
              :key="type.value" 
              :value="type.value"
            >
              {{ type.label }}
            </option>
          </select>
          <div class="form-text-hint mt-1">
            Manda estrictamente el tipo validado por tu Enum hacia la API de Fastify.
          </div>
        </div>

        <div class="mb-1">
          <label class="super-small fw-bold text-muted mb-1 d-block">Lote de Arranque Inicial (Items)</label>
          <input 
            type="number" 
            v-model="localData.limitFetch" 
            class="form-control form-control-sm text-center font-mono fw-bold"
            min="10"
            step="10"
          >
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.sidebar-title-main { font-size: 0.95rem; color: #0f172a; }
.small-text { font-size: 0.72rem; line-height: 1.4; color: #334155; }
.super-small { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.3px; }
.font-mono { font-family: monospace; }
.clickable { cursor: pointer; }
.mb-2 { margin-bottom: 10px; }
.cursor-pointer { cursor: pointer; }

.form-control-sm, .form-select-sm { 
  height: 32px; font-size: 0.75rem; padding: 4px 8px; border-radius: 6px;
}
textarea.form-control-sm { height: auto; }

.form-text-hint {
  font-size: 0.65rem;
  color: #94a3b8;
  line-height: 1.3;
}

.custom-grid-infinite-sidebar { box-sizing: border-box; }
.shadow-sm { box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important; }
</style>