<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref({
  text: props.modelValue?.text || 'Únete a la Red',
  url: props.modelValue?.url || 'https://docs.google.com/forms/d/e/1FAIpQLSfXXXXXXXXX/viewform',
  targetBlank: props.modelValue?.targetBlank !== undefined ? props.modelValue.targetBlank : true,
  bgGradient: props.modelValue?.bgGradient || 'linear-gradient(135deg, #db143c 0%, #7e22ce 50%, #25529a 100%)'
});

// Sincronización estricta sin bucles infinitos
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
        <h6 class="fw-bold mb-3 text-danger">
          <i class="las la-bullhorn"></i> Configuración del CTA
        </h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Texto del Botón</label>
          <input 
            type="text" 
            v-model="localData.text" 
            class="form-control form-control-sm"
            placeholder="Ej: Únete a la Red"
          >
        </div>

        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Enlace de Destino (URL / Ruta)</label>
          <input 
            type="text" 
            v-model="localData.url" 
            class="form-control form-control-sm"
            placeholder="Ej: https://docs.google.com/forms/..."
          >
        </div>

        <div class="form-check form-switch mt-2">
          <input 
            class="form-check-input" 
            type="checkbox" 
            id="targetBlankSwitch" 
            v-model="localData.targetBlank"
          >
          <label class="form-check-label small fw-bold text-muted" for="targetBlankSwitch">
            Abrir en pestaña nueva (`_blank`)
          </label>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary">
          <i class="las la-paint-brush"></i> Apariencia Visual
        </h6>
        
        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">CSS del Gradiente de Fondo</label>
          <textarea 
            v-model="localData.bgGradient" 
            class="form-control form-control-sm font-monospace" 
            rows="3"
            placeholder="linear-gradient(...)"
          ></textarea>
          <span class="x-small text-muted d-block mt-1">Soporta estructuras completas `linear-gradient` o colores hexadecimales simples.</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
.font-monospace { font-family: monospace; font-size: 0.75rem; }
</style>