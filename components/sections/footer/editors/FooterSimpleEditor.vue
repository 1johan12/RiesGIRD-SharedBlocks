<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);


const localData = ref({
  bgColor: props.modelValue?.bgColor || '#151515', 
  textColor: props.modelValue?.textColor || '#a3a3a3', 
  leftText: props.modelValue?.leftText || '© Copyright 2024 - Universidad ESAN | Todos los derechos reservados.',
  rightText: props.modelValue?.rightText || 'Razón Social: Universidad ESAN | RUC: 20136507720'
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
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-align-left"></i> Textos del Footer</h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1">Texto Izquierda (Copyright)</label>
          <input type="text" v-model="localData.leftText" class="form-control form-control-sm">
        </div>
        
        <div class="mb-2">
          <label class="small text-muted mb-1">Texto Derecha (Razón Social)</label>
          <input type="text" v-model="localData.rightText" class="form-control form-control-sm">
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm bg-dark text-white">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-warning"><i class="las la-palette"></i> Colores</h6>
        
        <div class="row g-2">
          <div class="col-6">
            <label class="x-small d-block mb-1">Color de Fondo</label>
            <input type="color" v-model="localData.bgColor" class="form-control form-control-color w-100 p-1">
          </div>
          <div class="col-6">
            <label class="x-small d-block mb-1">Color de Texto</label>
            <input type="color" v-model="localData.textColor" class="form-control form-control-color w-100 p-1">
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { 
  font-size: 0.65rem; 
  text-transform: uppercase; 
  font-weight: bold; 
  color: #adb5bd;
}
.form-control-color { 
  height: 38px; 
}
</style>