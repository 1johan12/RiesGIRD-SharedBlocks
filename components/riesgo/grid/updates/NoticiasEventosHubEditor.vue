<script setup lang="ts">
import { ref, watch } from 'vue';
import type { HubMegasectionConfig, GridSectionConfig } from '../views/NoticiasEventosHub.vue';

const props = defineProps<{ modelValue: HubMegasectionConfig | null }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref<Required<HubMegasectionConfig>>({
  showSlider: props.modelValue?.showSlider ?? true,
  sliderTitle: props.modelValue?.sliderTitle || 'Publicaciones Destacadas',
  grids: Array.isArray(props.modelValue?.grids) 
    ? JSON.parse(JSON.stringify(props.modelValue.grids)) 
    : [
        { id: 'g1', title: 'Eventos y Actividades Próximas', postType: 'event', limit: 4 },
        { id: 'g2', title: 'Noticias y Novedades Editoriales', postType: 'news', limit: 4 }
      ]
});

const isSliderConfigOpen = ref(false);

const addCustomGridBlock = () => {
  const nuevoBloque: GridSectionConfig = {
    id: 'grid_' + Math.random().toString(36).substring(2, 7),
    title: 'Nueva Grilla de Contenido',
    postType: 'all',
    limit: 4
  };
  localData.value.grids.push(nuevoBloque);
};

const removeGridBlock = (index: number) => {
  localData.value.grids.splice(index, 1);
};

watch(localData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });

watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(newVal) !== JSON.stringify(localData.value)) {
    localData.value.showSlider = newVal.showSlider ?? true;
    localData.value.sliderTitle = newVal.sliderTitle || '';
    if (newVal.grids) localData.value.grids = JSON.parse(JSON.stringify(newVal.grids));
  }
}, { deep: true });
</script>

<template>
  <div class="p-3 custom-hub-sidebar">
    <h6 class="fw-bold mb-3 border-bottom pb-2 sidebar-title-main">
      <i class="bi bi-grid-1x2-fill text-danger me-2"></i> Mánager del Hub Global
    </h6>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-header bg-white p-2 border-0 clickable d-flex justify-content-between align-items-center" @click="isSliderConfigOpen = !isSliderConfigOpen">
        <span class="fw-bold small text-warning"><i class="bi bi-lightning-charge-fill me-1"></i> 1. Módulo Grid Slider</span>
        <i class="bi" :class="isSliderConfigOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </div>
      
      <div class="card-body pt-0 mt-2" v-show="isSliderConfigOpen">
        <div class="form-check form-switch mb-2">
          <input class="form-check-input" type="checkbox" v-model="localData.showSlider" id="sw-slider">
          <label class="form-check-label small fw-bold text-secondary cursor-pointer" for="sw-slider">Encender Slider Superior</label>
        </div>
        <div class="mb-1" v-if="localData.showSlider">
          <label class="super-small fw-bold text-muted mb-0.5">Título del Slider</label>
          <input type="text" v-model="localData.sliderTitle" class="form-control form-control-xs fw-semibold">
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-2">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="fw-bold small text-primary"><i class="bi bi-list-stars me-1"></i> 2. Bloques de Grillas</span>
          <button type="button" class="btn btn-xs btn-outline-success px-2 py-0.5 fw-bold" @click="addCustomGridBlock">+ Añadir Grilla</button>
        </div>

        <div class="scroll-inner-stack custom-mini-scrollbar">
          <div v-for="(grid, idx) in localData.grids" :key="grid.id" class="border rounded p-2 bg-light mb-3 position-relative shadow-xs">
            <button type="button" class="btn btn-link text-danger position-absolute top-0 end-0 p-1 py-0 x-small border-0" @click="removeGridBlock(idx)" :disabled="localData.grids.length <= 1">
              <i class="bi bi-trash3-fill"></i>
            </button>

            <div class="row g-2 mt-1">
              <div class="col-12">
                <label class="super-small fw-bold text-muted mb-0.5">Título de la Sección / Grilla</label>
                <input type="text" v-model="grid.title" class="form-control form-control-xs fw-bold">
              </div>
              <div class="col-6">
                <label class="super-small fw-bold text-danger mb-0.5">Tipado del Feed</label>
                <select v-model="grid.postType" class="form-select form-select-xs fw-semibold">
                  <option value="all">Todo (Mix)</option>
                  <option value="news">Noticias</option>
                  <option value="event">Eventos</option>
                  <option value="calls">Convocatorias</option>
                  <option value="assemblies">Asambleas</option>
                </select>
              </div>
              <div class="col-6">
                <label class="super-small fw-bold text-muted mb-0.5">Límite de Cards</label>
                <select v-model="grid.limit" class="form-select form-select-xs">
                  <option :value="2">2 Cards</option>
                  <option :value="4">4 Cards</option>
                  <option :value="6">6 Cards</option>
                  <option :value="8">8 Cards</option>
                </select>
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
.x-small { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3px; }
.super-small { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.2px; }
.clickable { cursor: pointer; }
.form-control-xs, .form-select-xs { height: 28px; font-size: 0.72rem; padding: 2px 6px; }
.scroll-inner-stack { max-height: 52vh; overflow-y: auto; padding-right: 2px; }
.custom-mini-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-mini-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.custom-hub-sidebar { box-sizing: border-box; }
</style>