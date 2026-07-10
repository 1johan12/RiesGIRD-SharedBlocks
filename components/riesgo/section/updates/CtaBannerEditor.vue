<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref({
  title: props.modelValue?.title || 'Sube tu investigación',
  buttonText: props.modelValue?.buttonText || 'Aporta al Repositorio',
  actionUrl: props.modelValue?.actionUrl || '',
  targetBlank: props.modelValue?.targetBlank ?? true
});

// Sincronización blindada para romper bucles de reactividad profunda
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
          <label class="small text-muted mb-1 fw-bold">Llamado a la Acción</label>
          <input 
            type="text" 
            v-model="localData.title" 
            class="form-control form-control-sm fw-semibold"
            placeholder="Ej: Sube tu investigación"
          >
        </div>

        <div class="mb-1">
          <label class="small text-muted mb-1 fw-bold">Texto del Botón</label>
          <input 
            type="text" 
            v-model="localData.buttonText" 
            class="form-control form-control-sm"
            placeholder="Ej: Aporta al Repositorio"
          >
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-warning">
          <i class="las la-link"></i> Enlace de Redirección
        </h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">URL de Destino</label>
          <input 
            type="text" 
            v-model="localData.actionUrl" 
            class="form-control form-control-sm code-text" 
            placeholder="Ej: https://forms.gle/... o /repositorio"
          >
        </div>

        <div class="form-check form-switch bg-light border rounded p-2 ps-5 m-0 cursor-pointer">
          <input 
            class="form-check-input cursor-pointer" 
            type="checkbox" 
            id="switchTarget" 
            v-model="localData.targetBlank"
          >
          <label class="form-check-label fw-bold small cursor-pointer" for="switchTarget">
            ↗️ Abrir en pestaña nueva
          </label>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.code-text { font-family: monospace; font-size: 0.75rem; }
.cursor-pointer { cursor: pointer; }
</style>