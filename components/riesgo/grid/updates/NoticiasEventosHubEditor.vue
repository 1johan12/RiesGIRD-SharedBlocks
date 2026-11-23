<script setup lang="ts">
import { ref, watch } from 'vue';
import type { HubMegasectionConfig, GridSectionConfig } from '../views/NoticiasEventosHub.vue';

const props = defineProps<{ modelValue: HubMegasectionConfig | null }>();
const emit = defineEmits(['update:modelValue']);

const normalizeGrids = (grids: unknown): GridSectionConfig[] => {
  if (!Array.isArray(grids) || grids.length === 0) {
    return [
      { id: 'g1', title: 'Eventos y Actividades Próximas', postType: 'event', limit: 4, showMoreLink: false, moreLinkLabel: 'Ver más publicaciones', moreLinkUrl: '' },
      { id: 'g2', title: 'Noticias y Novedades Editoriales', postType: 'news', limit: 4, showMoreLink: false, moreLinkLabel: 'Ver más publicaciones', moreLinkUrl: '' },
    ];
  }
  return grids.map((g: any, idx: number) => ({
    id: g?.id || `grid_${idx + 1}`,
    title: g?.title || 'Grilla de Publicaciones',
    postType: ['all', 'news', 'event', 'calls', 'assemblies'].includes(g?.postType) ? g.postType : 'all',
    limit: Number(g?.limit) > 0 ? Number(g.limit) : 4,
    showMoreLink: Boolean(g?.showMoreLink),
    moreLinkLabel: g?.moreLinkLabel || 'Ver más publicaciones',
    moreLinkUrl: g?.moreLinkUrl || '',
  }));
};

const normalizeState = (src: HubMegasectionConfig | null): Required<HubMegasectionConfig> => ({
  id: src?.id || 'hub_main',
  showSlider: src?.showSlider ?? true,
  sliderTitle: src?.sliderTitle !== undefined ? src.sliderTitle : 'Publicaciones Destacadas',
  badgeLabel: src?.badgeLabel || '',
  showPublishButton: Boolean(src?.showPublishButton),
  publishButtonLabel: src?.publishButtonLabel !== undefined ? src.publishButtonLabel : 'Publique su Actividad',
  publishButtonUrl: src?.publishButtonUrl || '',
  grids: normalizeGrids(src?.grids),
});

const localData = ref<Required<HubMegasectionConfig>>(normalizeState(props.modelValue));
const isSliderConfigOpen = ref(false);
const isSidebarConfigOpen = ref(false);

const addCustomGridBlock = () => {
  localData.value.grids.push({
    id: 'grid_' + Math.random().toString(36).substring(2, 7),
    title: 'Nueva Grilla de Contenido',
    postType: 'all',
    limit: 4,
    showMoreLink: false,
    moreLinkLabel: 'Ver más publicaciones',
    moreLinkUrl: '',
  });
};

const removeGridBlock = (index: number) => {
  localData.value.grids.splice(index, 1);
};

watch(
  localData,
  (newVal) => {
    emit('update:modelValue', JSON.parse(JSON.stringify(newVal)));
  },
  { deep: true }
);

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;
    const incoming = normalizeState(newVal);
    if (JSON.stringify(incoming) !== JSON.stringify(localData.value)) {
      localData.value = incoming;
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="p-3 custom-hub-sidebar">
    <h6 class="fw-bold mb-3 border-bottom pb-2 sidebar-title-main">
      <i class="bi bi-grid-1x2-fill text-danger me-2"></i> Mánager del Hub Global
    </h6>

    <div class="card mb-3 border-0 shadow-sm">
      <div
        class="card-header bg-white p-2 border-0 clickable d-flex justify-content-between align-items-center"
        @click="isSliderConfigOpen = !isSliderConfigOpen"
      >
        <span class="fw-bold small text-warning">
          <i class="bi bi-lightning-charge-fill me-1"></i> 1. Slider Destacado
        </span>
        <i class="bi" :class="isSliderConfigOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </div>

      <div class="card-body pt-0 mt-2" v-show="isSliderConfigOpen">
        <div class="form-check form-switch mb-2">
          <input class="form-check-input" type="checkbox" v-model="localData.showSlider" id="sw-slider">
          <label class="form-check-label small fw-bold text-secondary clickable" for="sw-slider">
            Encender Slider Superior
          </label>
        </div>
        <div class="mb-1" v-if="localData.showSlider">
          <label class="super-small fw-bold text-muted mb-0.5">Título del Slider</label>
          <input type="text" v-model="localData.sliderTitle" class="form-control form-control-xs fw-semibold">
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body p-2">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="fw-bold small text-primary">
            <i class="bi bi-list-stars me-1"></i> 2. Bloques de Grillas
          </span>
          <button
            type="button"
            class="btn btn-xs btn-outline-success px-2 py-0.5 fw-bold"
            @click="addCustomGridBlock"
          >
            + Añadir Grilla
          </button>
        </div>

        <div class="scroll-inner-stack custom-mini-scrollbar">
          <div
            v-for="(grid, idx) in localData.grids"
            :key="grid.id"
            class="border rounded p-2 bg-light mb-3 position-relative shadow-xs"
          >
            <button
              type="button"
              class="btn btn-link text-danger position-absolute top-0 end-0 p-1 py-0 x-small border-0"
              @click="removeGridBlock(idx)"
              :disabled="localData.grids.length <= 1"
              aria-label="Eliminar grilla"
            >
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

              <div class="col-12 border-top pt-2 mt-2">
                <div class="form-check form-switch mb-1">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="grid.showMoreLink"
                    :id="`sw-more-${grid.id}`"
                  >
                  <label class="form-check-label super-small fw-bold text-secondary clickable" :for="`sw-more-${grid.id}`">
                    Mostrar botón "Ver más"
                  </label>
                </div>
                <div v-if="grid.showMoreLink" class="row g-1 mt-1">
                  <div class="col-6">
                    <input
                      type="text"
                      v-model="grid.moreLinkLabel"
                      class="form-control form-control-xs"
                      placeholder="Ver más publicaciones"
                    >
                  </div>
                  <div class="col-6">
                    <input
                      type="text"
                      v-model="grid.moreLinkUrl"
                      class="form-control form-control-xs"
                      placeholder="/noticias o https://..."
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div
        class="card-header bg-white p-2 border-0 clickable d-flex justify-content-between align-items-center"
        @click="isSidebarConfigOpen = !isSidebarConfigOpen"
      >
        <span class="fw-bold small text-info">
          <i class="bi bi-sliders me-1"></i> 3. Badges y Botón Lateral
        </span>
        <i class="bi" :class="isSidebarConfigOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </div>

      <div class="card-body pt-0 mt-2" v-show="isSidebarConfigOpen">
        <div class="mb-2">
          <label class="super-small fw-bold text-muted mb-0.5">Etiqueta fija en tarjetas (Opcional)</label>
          <input
            type="text"
            v-model="localData.badgeLabel"
            class="form-control form-control-xs"
            placeholder="Vacío = categoría automática / RiesGIRD"
          >
        </div>

        <div class="form-check form-switch mb-2">
          <input class="form-check-input" type="checkbox" v-model="localData.showPublishButton" id="sw-publish-btn">
          <label class="form-check-label small fw-bold text-secondary clickable" for="sw-publish-btn">
            Mostrar botón lateral CTA
          </label>
        </div>
        <div v-if="localData.showPublishButton" class="row g-2">
          <div class="col-12">
            <label class="super-small fw-bold text-muted mb-0.5">Texto del Botón</label>
            <input type="text" v-model="localData.publishButtonLabel" class="form-control form-control-xs">
          </div>
          <div class="col-12">
            <label class="super-small fw-bold text-muted mb-0.5">Ruta o Enlace destino</label>
            <input
              type="text"
              v-model="localData.publishButtonUrl"
              class="form-control form-control-xs"
              placeholder="/contacto o mailto:..."
            >
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
.scroll-inner-stack { max-height: 44vh; overflow-y: auto; padding-right: 2px; }
.custom-mini-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-mini-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.custom-hub-sidebar { box-sizing: border-box; }
</style>
