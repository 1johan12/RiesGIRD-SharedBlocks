<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  title: props.modelValue?.title || 'Caso de Éxito y Alianzas',
  subTitle: props.modelValue?.subTitle || 'Maestría Conjunta en Gestión de Riesgos y Sostenibilidad',
  highlightLabel: props.modelValue?.highlightLabel || 'El Modelo de Éxito:',
  text: props.modelValue?.text || '',
  bannerText: props.modelValue?.bannerText || '',
  imageUrl: props.modelValue?.imageUrl || ''
});

// Sincronización blindada contra bucles de reactividad profunda
watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  const stringifiedNew = JSON.stringify(newVal);
  const stringifiedLocal = JSON.stringify(localData.value);
  if (stringifiedNew !== stringifiedLocal) {
    localData.value = { ...localData.value, ...newVal };
  }
}, { deep: true });

watch(localData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });
</script>

<template>
  <div class="p-3">
    
    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary">
          <i class="las la-align-left"></i> Contenidos Principales
        </h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título de la Sección</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm" placeholder="Ej: Caso de Éxito y Alianzas">
        </div>

        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Subtítulo del Caso</label>
          <input type="text" v-model="localData.subTitle" class="form-control form-control-sm fw-semibold" placeholder="Nombre del caso o logro">
        </div>

        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Etiqueta Resaltada</label>
          <input type="text" v-model="localData.highlightLabel" class="form-control form-control-sm text-danger" placeholder="Ej: El Modelo de Éxito:">
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Cuerpo del Párrafo</label>
          <textarea v-model="localData.text" class="form-control form-control-sm small-text" rows="5" placeholder="Escribe los detalles de la alianza..."></textarea>
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-warning">
          <i class="las la-image"></i> Fotografía Lateral
        </h6>
        
        <div class="mb-2">
          <div 
            @click="$emit('select-image', { item: localData, field: 'imageUrl' })" 
            class="media-placeholder border rounded clickable"
            :style="{ backgroundImage: localData.imageUrl ? `url(${localData.imageUrl})` : 'none' }"
          >
            <i v-if="!localData.imageUrl" class="las la-picture-o fs-3 text-muted"></i>
          </div>
          <span class="x-small text-muted d-block mt-2">Formato horizontal o cuadrado nítido optimizado para web.</span>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-danger">
          <i class="las la-ribbon"></i> Franja de Cierre Bicolor
        </h6>
        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Mensaje de Conclusión</label>
          <textarea v-model="localData.bannerText" class="form-control form-control-sm small-text" rows="4" placeholder="Escribe el mensaje que irá dentro del gradiente inferior..."></textarea>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
.small-text { font-size: 0.76rem; line-height: 1.4; }
.media-placeholder { 
  height: 140px; 
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
  display: grid; 
  place-items: center; 
  cursor: pointer; 
  background-color: #f8f9fa;
  transition: all 0.2s ease;
}
.clickable:hover { 
  opacity: 0.85; 
  border-color: #0d6efd !important; 
  box-shadow: 0 0 0 1px #0d6efd;
}
</style>