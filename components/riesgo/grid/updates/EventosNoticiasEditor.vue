<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

// Data local reactiva protegida por referencias unificadas
const localData = ref({
  title: props.modelValue?.title || 'Eventos y Noticias Destacados',
  limit: props.modelValue?.limit || 4,
  postType: props.modelValue?.postType || 'all'
});

// Sincronización estricta por Stringify para romper bucles reactivos con el canvas
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
  <div class="p-2">
    
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary">
          <i class="las la-server"></i> Consulta Dinámica (Fastify Feed)
        </h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título del Bloque</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm">
        </div>

        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Filtrar por Tipo</label>
          <select v-model="localData.postType" class="form-select form-select-sm fw-medium">
            <option value="all">📁 Todo (Eventos y Noticias)</option>
            <option value="event">📅 Solo Eventos / Foros</option>
            <option value="news">📰 Solo Noticias / Artículos</option>
          </select>
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Cantidad Máxima de Tarjetas</label>
          <select v-model.number="localData.limit" class="form-select form-select-sm fw-medium">
            <option :value="4">4 Columnas (Recomendado)</option>
            <option :value="8">8 Columnas (2 Filas)</option>
            <option :value="12">12 Columnas (3 Filas)</option>
          </select>
          <span class="x-small text-muted d-block mt-2">
            💡 <strong>Nota Senior:</strong> Este bloque se alimenta en vivo de tus endpoints públicos de Fastify filtrando por la unidad académica actual de manera automatizada.
          </span>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
</style>