<script setup lang="ts">
import { ref, watch } from 'vue';
import type { DynamicGridBlockData, GridItemAsset } from '../views/DynamicContentGrid.vue';

const props = defineProps<{ modelValue: DynamicGridBlockData | null }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

// --- ENFORZAMIENTO DE CONTRATO CON CAMPOS PLENOS DE EDICIÓN ---
const localData = ref<Required<DynamicGridBlockData>>({
  title: props.modelValue?.title || 'Últimas Publicaciones de la Red',
  introText: props.modelValue?.introText || 'Mantente al tanto de las actividades de nuestros nodos.',
  contentType: props.modelValue?.contentType || 'news', // 'news' | 'events' | 'assemblies'
  items: Array.isArray(props.modelValue?.items)
    ? props.modelValue.items.map((i: any) => ({
        id: i.id || Date.now() + Math.random(),
        titulo: i.titulo || '',
        resumen: i.resumen || '',
        autor: i.autor || '',
        imagen: i.imagen || '',
        fecha_evento: i.fecha_evento || '',
        ubicacion_evento: i.ubicacion_evento || '',
        url_enlace: i.url_enlace || ''
      }))
    : []
});

const expandedCardIdx = ref<number | null>(0);
const isTextsOpen = ref(false);

// Operador incremental dinámico según la estructura de la interfaz GridItemAsset
const addNewFeedItem = () => {
  const nuevoItem: GridItemAsset = {
    id: Date.now(),
    titulo: 'Nueva publicación o boletín institucional',
    resumen: 'Escribe un resumen ejecutivo breve del entregable científico o evento...',
    autor: 'Comité Redactor RIESGIRD',
    imagen: '',
    fecha_evento: '25 de Agosto, 2026',
    ubicacion_evento: 'Campus Universitario Local',
    url_enlace: '/'
  };
  localData.value.items.push(nuevoItem);
  expandedCardIdx.value = localData.value.items.length - 1;
};

// Sincronizador máster libre de bucles reactivos
watch(localData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });

watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(newVal) !== JSON.stringify(localData.value)) {
    localData.value.title = newVal.title || '';
    localData.value.introText = newVal.introText || '';
    localData.value.contentType = newVal.contentType || 'news';
    if (Array.isArray(newVal.items)) localData.value.items = newVal.items;
  }
}, { deep: true });
</script>

<template>
  <div class="p-3 custom-polymorphic-sidebar">
    
    <h6 class="fw-bold mb-3 sidebar-title-main border-bottom pb-2">
      <i class="bi bi-grid-3x3-gap-fill text-danger me-2"></i> Alimentador Dinámico
    </h6>

    <div class="card mb-3 border-danger shadow-sm">
      <div class="card-body bg-light-danger rounded-3">
        <label class="x-small fw-bold text-danger d-block mb-1.5"><i class="bi bi-shield-lock-fill"></i> Clasificación del Feed</label>
        <select v-model="localData.contentType" class="form-select form-select-sm fw-bold text-dark">
          <option value="news">📰 Modo: Noticias Editoriales</option>
          <option value="events">📅 Modo: Eventos / Agenda</option>
          <option value="assemblies">🏛️ Modo: Asambleas Rectores</option>
        </select>
        <span class="super-small text-muted d-block mt-1">Regula de forma masiva qué metadatos e íconos pintará la plantilla en la landing pública.</span>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-header bg-white p-2 border-0 clickable d-flex justify-content-between align-items-center" @click="isTextsOpen = !isTextsOpen">
        <span class="fw-bold small text-warning"><i class="bi bi-heading"></i> 1. Encabezado Bloque</span>
        <i class="bi" :class="isTextsOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </div>
      <div class="card-body pt-0 mt-2" v-show="isTextsOpen">
        <div class="mb-2">
          <label class="x-small fw-bold text-muted mb-0.5">Título Rejilla</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm fw-semibold">
        </div>
        <div class="mb-0">
          <label class="x-small fw-bold text-muted mb-0.5">Descripción</label>
          <textarea v-model="localData.introText" class="form-control form-control-sm small-text" rows="2"></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-primary small-title"><i class="bi bi-list-stars"></i> 2. Tarjetas de Contenido</h6>
          <button type="button" class="btn btn-xs btn-outline-success px-2 py-0.5" @click="addNewFeedItem">+ Ficha</button>
        </div>

        <div class="scroll-stack-wrapper custom-mini-scrollbar">
          <div v-for="(item, idx) in localData.items" :key="item.id || idx" class="accordion-item-box mb-2">
            
            <div class="accordion-item-bar" @click="expandedCardIdx = expandedCardIdx === idx ? null : idx" :class="{ 'bar-active': expandedCardIdx === idx }">
              <span class="x-small fw-bold text-secondary text-truncate" style="max-width: 220px;">
                N° {{ idx + 1 }} - {{ item.titulo || 'Sin título...' }}
              </span>
              <i class="bi" :class="expandedCardIdx === idx ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>

            <div class="accordion-item-content" v-show="expandedCardIdx === idx">
              <div class="p-3 bg-white border border-top-0 rounded-bottom-3 position-relative">
                
                <button type="button" class="btn btn-xs btn-link text-danger position-absolute top-0 end-0 p-1 m-0.5" @click="localData.items.splice(idx,1)" :disabled="localData.items.length <= 1">
                  <i class="bi bi-trash3-fill"></i>
                </button>

                <div class="row g-2 mt-1">
                  <div class="col-12">
                    <label class="super-small fw-bold text-muted mb-0.5">Título Publicación</label>
                    <input type="text" v-model="item.titulo" class="form-control form-control-xs fw-bold">
                  </div>
                  <div class="col-12">
                    <label class="super-small fw-bold text-muted mb-0.5">Resumen Corto</label>
                    <textarea v-model="item.resumen" class="form-control form-control-xs small-text" rows="2"></textarea>
                  </div>

                  <div class="col-12 mb-1">
                    <label class="super-small fw-bold text-danger d-block mb-0.5">Imagen de Portada (16:9)</label>
                    <div class="input-group input-group-xs">
                      <input type="text" v-model="item.imagen" class="form-control font-mono super-small-text bg-white" placeholder="Ruta de la imagen...">
                      <button type="button" class="btn btn-outline-danger py-0 px-1.5" @click="$emit('select-image', { item: item, field: 'imagen' })">
                        <i class="bi bi-image"></i>
                      </button>
                    </div>
                  </div>

                  <div class="col-12" v-if="localData.contentType === 'news'">
                    <label class="super-small fw-bold text-muted mb-0.5">Autor de la Nota</label>
                    <input type="text" v-model="item.autor" class="form-control form-control-xs fw-semibold">
                  </div>

                  <div class="col-12 row g-1 m-0 p-0 border-top pt-2" v-else>
                    <div class="col-6">
                      <label class="super-small fw-bold text-muted mb-0.5">Fecha Evento</label>
                      <input type="text" v-model="item.fecha_evento" class="form-control form-control-xs small-text" placeholder="Ej: 25 de Agosto">
                    </div>
                    <div class="col-6">
                      <label class="super-small fw-bold text-muted mb-0.5">Ubicación / Sede</label>
                      <input type="text" v-model="item.ubicacion_evento" class="form-control form-control-xs small-text" placeholder="Ej: Campus Virtual">
                    </div>
                  </div>

                  <div class="col-12 border-top pt-1 mt-2">
                    <label class="super-small fw-bold text-primary mb-0.5">Link de Redirección Interna</label>
                    <input type="text" v-model="item.url_enlace" class="form-control form-control-xs font-mono" placeholder="Ej: /noticias/articulo-1">
                  </div>
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
.x-small { font-size: 0.65rem; }
.small-text { font-size: 0.75rem; }
.super-small { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.2px; }
.super-small-text { font-size: 0.68rem; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-mono { font-family: monospace; }
.small-title { font-size: 0.82rem; }
.mb-1 { margin-bottom: 6px; }
.shadow-xs { box-shadow: 0 1px 4px rgba(0,0,0,0.02); }
.clickable { cursor: pointer; }

/* Alert Danger Token look */
.border-danger { border-color: #fca5a5 !important; }
.bg-light-danger { background-color: #fef2f2; }

.form-control-xs { height: 28px; font-size: 0.72rem; padding: 2px 6px; }

/* Acordeón */
.accordion-item-box { width: 100%; box-sizing: border-box; }
.accordion-item-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; background-color: #ffffff; border: 1px solid #e2e8f0;
  border-radius: 8px; cursor: pointer; transition: all 0.2s ease;
}
.accordion-item-bar:hover, .bar-active { background-color: #f8fafc; border-color: #cbd5e1; }
.bar-active { border-radius: 8px 8px 0 0; border-bottom-color: transparent !important; }

.scroll-stack-wrapper { max-height: 48vh; overflow-y: auto; padding-right: 4px; }
.scroll-stack-wrapper::-webkit-scrollbar { width: 4px; }
.scroll-stack-wrapper::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.custom-polymorphic-sidebar { box-sizing: border-box; }
</style>