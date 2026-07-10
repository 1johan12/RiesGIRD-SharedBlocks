<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref({
  title: props.modelValue?.title || 'Directorio',
  introText: props.modelValue?.introText || 'Sección destinada al registro y archivo oficial de las autoridades.',
  limit: props.modelValue?.limit || 4
});

// Sincronizador estricto por strings para romper bucles
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
    
    <div class="card border-0 shadow-sm mb-3">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary">
          <i class="las la-heading"></i> Textos Informativos
        </h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título del Bloque</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm">
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Descripción Reseña</label>
          <textarea v-model="localData.introText" class="form-control form-control-sm" rows="4"></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-danger">
          <i class="las la-filter"></i> Criterios del Directorio
        </h6>
        
        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Cantidad de Rectores a Pintar</label>
          <select v-model.number="localData.limit" class="form-select form-select-sm fw-medium">
            <option :value="2">2 Autoridades (1 Fila)</option>
            <option :value="4">4 Autoridades (2 Filas)</option>
            <option :value="6">6 Autoridades (3 Filas)</option>
            <option :value="8">8 Autoridades (4 Filas)</option>
          </select>
          <span class="x-small text-muted d-block mt-2">
            💡 <strong>Nota Técnica:</strong> Este bloque extrae automáticamente los registros de la tabla <code>university_teams</code> que tengan un nivel jerárquico alto (Nivel 1 / Rectores).
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
</style>