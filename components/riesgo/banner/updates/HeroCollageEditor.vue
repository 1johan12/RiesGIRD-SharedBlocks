<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  title: props.modelValue?.title || 'RED PERUANA DE INSTITUCIONES DE EDUCACIÓN SUPERIOR UNIVERSITARIA...',
  logoUrl: props.modelValue?.logoUrl || '',
  collageImagenes: props.modelValue?.collageImagenes || {
    superior: '',
    izquierda: '',
    centroAbajo: '',
    derecha: ''
  }
});


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
          <i class="las la-font"></i> Contenido del Contenedor
        </h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título Institucional</label>
          <textarea 
            v-model="localData.title" 
            class="form-control form-control-sm text-uppercase" 
            rows="4"
            placeholder="Escribe el título de la Red..."
          ></textarea>
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold d-block">Logo de la Red (Marca)</label>
          <div 
            @click="$emit('select-image', { item: localData, field: 'logoUrl' })" 
            class="media-placeholder border rounded clickable bg-light"
            :style="{ backgroundImage: `url(${localData.logoUrl})` }"
          >
            <i v-if="!localData.logoUrl" class="las la-file-upload fs-3 text-muted"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-warning">
          <i class="las la-images"></i> Galería del Collage (Máscaras)
        </h6>
        <p class="x-small text-muted mb-3">Haz clic en cada cuadrante para asignar la fotografía correspondiente.</p>
        
        <div class="row g-2">
          <div class="col-6">
            <label class="x-small fw-bold text-muted mb-1">1. Región Posterior</label>
            <div 
              @click="$emit('select-image', { item: localData.collageImagenes, field: 'superior' })" 
              class="collage-placeholder border rounded clickable"
              :style="{ backgroundImage: `url(${localData.collageImagenes.superior})` }"
            >
              <i v-if="!localData.collageImagenes.superior" class="las la-image text-muted"></i>
            </div>
          </div>

          
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.7rem; }
.media-placeholder { 
  height: 80px; 
  background-size: contain; 
  background-position: center; 
  background-repeat: no-repeat;
  display: grid; 
  place-items: center; 
  cursor: pointer; 
}
.collage-placeholder { 
  height: 90px; 
  background-size: cover; 
  background-position: center; 
  display: grid; 
  place-items: center; 
  cursor: pointer; 
  background-color: #f8f9fa;
}
.clickable:hover { 
  opacity: 0.85; 
  border-color: #0d6efd !important; 
  box-shadow: 0 0 0 1px #0d6efd;
}
</style>