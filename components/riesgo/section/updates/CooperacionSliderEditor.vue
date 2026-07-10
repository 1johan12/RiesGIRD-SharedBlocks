<script setup lang="ts">
import { ref, watch } from 'vue';
import type { SliderBlockData, SlideNode } from '../views/CooperacionSlider.vue';

const props = defineProps<{ modelValue: SliderBlockData | null }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

// --- ENFORZAMIENTO DE TIPADO ESTRICTO LOCAL ---
const localData = ref<Required<SliderBlockData>>({
  items: Array.isArray(props.modelValue?.items)
    ? props.modelValue.items.map((s: any) => ({
        id: s.id || Date.now() + Math.random(),
        title: s.title || '',
        description: s.description || '',
        author: s.author || '',
        image: s.image || ''
      }))
    : []
});

const expandedSlideIdx = ref<number | null>(0); 

const toggleSlideAccordion = (index: number) => {
  expandedSlideIdx.value = expandedSlideIdx.value === index ? null : index;
};

// ── 🎯 ACCIÓN CON TIPADO ESTRICTO PARA EL PUSH INCREMENTAL DEL ACUMULADOR ──
const addNewSlideNode = () => {
  const nuevaLámina: SlideNode = {
    id: Date.now(),
    title: 'Nueva Iniciativa de Alianza Estratégica',
    description: 'Escribe un párrafo resumiendo los alcances del encuentro interinstitucional llevado a cabo por la Red.',
    author: 'Universidad Miembro',
    image: '' // Listo para ser inyectado desde el Media Selector
  };
  
  localData.value.items.push(nuevaLámina);
  expandedSlideIdx.value = localData.value.items.length - 1; // Expande el nuevo elemento de inmediato
};

const removeSlideNode = (index: number) => {
  localData.value.items.splice(index, 1);
};

// Sincronizador de reactividad profunda libre de loops reactivos infinitos
watch(localData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });

watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(newVal) !== JSON.stringify(localData.value)) {
    if (Array.isArray(newVal.items)) {
      localData.value.items = newVal.items;
    }
  }
}, { deep: true });
</script>

<template>
  <div class="p-3 custom-slider-sidebar">
    
    <h6 class="fw-bold mb-3 sidebar-title border-bottom pb-2">
      <i class="bi bi-sliders text-primary me-2"></i> Carrusel de Alianzas
    </h6>

    <div class="mb-2">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <label class="section-title text-muted mb-0">Listado de Diapositivas</label>
        <button type="button" class="btn btn-xs btn-outline-success px-2 py-0.5 fw-bold" @click="addNewSlideNode">
          + Lámina
        </button>
      </div>

      <div class="scroll-stack-wrapper custom-mini-scrollbar">
        <div 
          v-for="(slide, idx) in localData.items" 
          :key="slide.id || idx"
          class="accordion-block-card mb-2"
        >
          <div 
            class="accordion-block-trigger" 
            @click="toggleSlideAccordion(idx)"
            :class="{ 'accordion-trigger-active': expandedSlideIdx === idx }"
          >
            <div class="d-flex align-items-center gap-2 overflow-hidden">
              <span class="badge bg-primary font-mono py-0.5 px-1.5">N° {{ idx + 1 }}</span>
              <span class="x-small fw-bold text-slate-title text-truncate" style="max-width: 170px;">
                {{ slide.title || 'Lámina sin título' }}
              </span>
            </div>
            <i class="bi" :class="expandedSlideIdx === idx ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
          </div>

          <div class="accordion-block-body" v-show="expandedSlideIdx === idx">
            <div class="p-3 bg-white border border-top-0 rounded-bottom-3 position-relative">
              
              <button 
                type="button" 
                class="btn btn-xs btn-link text-danger position-absolute top-0 end-0 m-1 p-1"
                @click="removeSlideNode(idx)"
                :disabled="localData.items.length <= 1"
                title="Eliminar esta lámina"
              >
                <i class="bi bi-trash3-fill"></i>
              </button>

              <div class="row g-2 mt-1">
                <div class="col-12">
                  <label class="super-small fw-bold text-muted mb-0.5">Título de la Diapositiva</label>
                  <input type="text" v-model="slide.title" class="form-control form-control-xs fw-bold" placeholder="Ej: Impulsando la cooperación">
                </div>

                <div class="col-12">
                  <label class="super-small fw-bold text-muted mb-0.5">Autor / Universidad Ejecutora</label>
                  <input type="text" v-model="slide.author" class="form-control form-control-xs fw-semibold" placeholder="Ej: Universidad Nacional Mayor">
                </div>

                <div class="col-12">
                  <label class="super-small fw-bold text-muted mb-0.5">Párrafo Descriptivo</label>
                  <textarea v-model="slide.description" class="form-control form-control-xs small-text" rows="3" placeholder="Escribe el cuerpo de la reseña..."></textarea>
                </div>

                <div class="col-12 border-top pt-2 mt-2">
                  <label class="super-small fw-bold text-danger d-block mb-1">Imagen de Portada (16:8)</label>
                  <div class="input-group input-group-xs">
                    <input type="text" v-model="slide.image" class="form-control font-mono super-small-text bg-white" placeholder="Ninguna imagen seleccionada...">
                    <button type="button" class="btn btn-outline-danger py-0 px-1.5" @click="$emit('select-image', { item: slide, field: 'image' })">
                      <i class="las la-image"></i>
                    </button>
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
.sidebar-title { font-size: 0.95rem; letter-spacing: -0.1px; }
.section-title { font-size: 0.65rem; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; }
.x-small { font-size: 0.65rem; }
.small-text { font-size: 0.75rem; }
.super-small { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.2px; }
.super-small-text { font-size: 0.68rem; }
.font-bold { font-weight: 700; }
.font-mono { font-family: monospace; }
.small-title { font-size: 0.82rem; }
.text-slate-title { color: #334155; }
.mb-1 { margin-bottom: 6px; }
.shadow-xs { box-shadow: 0 1px 4px rgba(0,0,0,0.02); }

.form-control-xs { height: 28px; font-size: 0.72rem; padding: 2px 6px; }

/* Acordeón */
.accordion-block-card { width: 100%; box-sizing: border-box; }
.accordion-block-trigger {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; background-color: #ffffff; border: 1px solid #e2e8f0;
  border-radius: 8px; cursor: pointer; transition: all 0.2s ease;
}
.accordion-block-trigger:hover, .accordion-trigger-active {
  background-color: #f8fafc; border-color: #cbd5e1;
}
.accordion-trigger-active { border-radius: 8px 8px 0 0; border-bottom-color: transparent !important; }

.scroll-stack-wrapper { max-height: 72vh; overflow-y: auto; padding-right: 4px; }
.custom-mini-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-mini-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.custom-slider-sidebar { box-sizing: border-box; }
</style>