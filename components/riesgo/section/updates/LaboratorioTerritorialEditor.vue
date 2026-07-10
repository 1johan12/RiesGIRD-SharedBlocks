<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref({
  title: props.modelValue?.title || '¿Qué es un Laboratorio Territorial?',
  text: props.modelValue?.text || ''
});

// Sincronización blindada contra bucles de reactividad profunda en el Admin SPA
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
    
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary">
          <i class="las la-align-left"></i> Contenidos del Bloque
        </h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título de la Sección</label>
          <input 
            type="text" 
            v-model="localData.title" 
            class="form-control form-control-sm"
            placeholder="Ej: ¿Qué es un Laboratorio Territorial?"
          >
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Cuerpo Explicativo</label>
          <textarea 
            v-model="localData.text" 
            class="form-control form-control-sm" 
            rows="6"
            placeholder="Escribe la descripción conceptual del Living Lab territorial..."
          ></textarea>
          <span class="x-small text-muted d-block mt-1">Soporta etiquetas HTML básicas como `<strong>texto</strong>` para resaltar conceptos.</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
</style>