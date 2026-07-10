<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  
  bgColor: props.modelValue?.bgColor || '#ffffff',
  buttonColor: props.modelValue?.buttonColor || '#8c357f', 
  buttonTextColor: props.modelValue?.buttonTextColor || '#ffffff',
  
  
  logoImage: props.modelValue?.logoImage || '',
  showButton: props.modelValue?.showButton ?? true, 
  buttonText: props.modelValue?.buttonText || 'COMUNÍCATE',
  buttonLink: props.modelValue?.buttonLink || '#comunicate',
  
  
  isSticky: props.modelValue?.isSticky ?? true
});

watch(localData, (newVal) => { 
  emit('update:modelValue', { ...newVal }); 
}, { deep: true });

watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(localData.value) !== JSON.stringify(newVal)) {
    localData.value = { ...localData.value, ...newVal };
  }
}, { deep: true });
</script>

<template>
  <div class="p-3">
    
    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="bi bi-layout-three-columns"></i> General</h6>
        
        <div class="mb-3 text-center">
          <label class="small text-muted d-block mb-1 text-start">Logo del Menú</label>
          <div class="bg-white border rounded p-2 mb-2 d-flex justify-content-center align-items-center" style="height: 60px;">
            <img v-if="localData.logoImage" :src="localData.logoImage" style="max-height: 40px; object-fit: contain;">
            <span v-else class="text-muted small">Sin logo</span>
          </div>
          <button class="btn btn-sm btn-dark w-100" @click="$emit('select-image', { item: localData, field: 'logoImage' })">
            Seleccionar Logo
          </button>
        </div>

        <div class="row g-2 mb-3">
          <div class="col-12">
            <label class="small text-muted mb-1">Color de Fondo Navbar</label>
            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.bgColor">
          </div>
        </div>

        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="stickySwitch" v-model="localData.isSticky">
          <label class="form-check-label small" for="stickySwitch">Mantener pegado arriba (Sticky)</label>
        </div>
      </div>
    </div>

    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold text-primary m-0"><i class="bi bi-hand-index-thumb"></i> Botón de Acción</h6>
          <div class="form-check form-switch m-0">
            <input class="form-check-input" type="checkbox" role="switch" v-model="localData.showButton">
          </div>
        </div>
        
        <div v-if="localData.showButton">
          <div class="row g-2 mb-2">
            <div class="col-6">
              <label class="small text-muted mb-1">Texto</label>
              <input type="text" class="form-control form-control-sm" v-model="localData.buttonText">
            </div>
            <div class="col-6">
              <label class="small text-muted mb-1">Enlace (Ej: #comunicate)</label>
              <input type="text" class="form-control form-control-sm" v-model="localData.buttonLink">
            </div>
          </div>
          <div class="row g-2">
            <div class="col-6">
              <label class="small text-muted mb-1">Fondo Botón</label>
              <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.buttonColor">
            </div>
            <div class="col-6">
              <label class="small text-muted mb-1">Texto Botón</label>
              <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.buttonTextColor">
            </div>
          </div>
        </div>
        <div v-else class="text-muted small text-center py-2">
          El botón está oculto.
        </div>
      </div>
    </div>

  </div>
</template>