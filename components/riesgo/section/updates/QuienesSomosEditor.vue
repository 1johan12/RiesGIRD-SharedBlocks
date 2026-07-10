<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  title: props.modelValue?.title || '¿Quiénes somos?',
  text: props.modelValue?.text || '',
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
          <i class="las la-align-left"></i> Textos Informativos
        </h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título de la Sección</label>
          <input 
            type="text" 
            v-model="localData.title" 
            class="form-control form-control-sm"
            placeholder="Ej: ¿Quiénes somos?"
          >
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Descripción Reseña</label>
          <textarea 
            v-model="localData.text" 
            class="form-control form-control-sm" 
            rows="6"
            placeholder="Escribe el cuerpo de texto principal de la sección..."
          ></textarea>
          <span class="x-small text-muted d-block mt-1">Soporta etiquetas HTML básicas como `<strong>texto</strong>` para resaltar palabras clave.</span>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-warning">
          <i class="las la-image"></i> Imagen Descriptiva
        </h6>
        
        <div class="mb-2">
          <label class="small text-muted mb-1 d-block fw-bold">Fotografía Destacada</label>
          <div 
            @click="$emit('select-image', { item: localData, field: 'imageUrl' })" 
            class="media-placeholder border rounded clickable"
            :style="{ backgroundImage: `url(${localData.imageUrl})` }"
          >
            <i v-if="!localData.imageUrl" class="las la-picture-o fs-3 text-muted"></i>
          </div>
          <span class="x-small text-muted d-block mt-2">Se recomienda un formato horizontal limpio (ej: 1200x800px) con buena compresión para web.</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
.media-placeholder { 
  height: 140px; 
  background-size: cover; 
  background-position: center; 
  display: grid; 
  place-items: center; 
  cursor: pointer; 
  background-color: #f8f9fa;
  transition: all 0.2s;
}
.clickable:hover { 
  opacity: 0.85; 
  border-color: #0d6efd !important; 
  box-shadow: 0 0 0 1px #0d6efd;
}
</style>