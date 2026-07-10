<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref({
  title: props.modelValue?.title || 'Asambleas Generales',
  limit: props.modelValue?.limit || 6,
  postType: props.modelValue?.postType || 'assemblies' // Forzado internamente a assemblies
});

// Sincronizador defensivo de estados de la barra de administración
watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(newVal) !== JSON.stringify(localData.value)) {
    localData.value = {
      title: newVal.title || 'Asambleas Generales',
      limit: newVal.limit || 6,
      postType: newVal.postType || 'assemblies'
    };
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
        <h6 class="fw-bold mb-3 text-warning">
          <i class="las la-heading"></i> Textos Base
        </h6>
        <div class="mb-1">
          <label class="small text-muted mb-1 fw-bold">Título de la Sección</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm fw-semibold">
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary">
          <i class="las la-server"></i> Filtros de Base de Datos
        </h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Límite de Registros a Traer</label>
          <select v-model="localData.limit" class="form-select form-select-sm fw-bold text-secondary">
            <option :value="2">2 Actas</option>
            <option :value="4">4 Actas</option>
            <option :value="6">6 Actas</option>
            <option :value="8">8 Actas</option>
            <option :value="12">12 Actas</option>
          </select>
          <span class="x-small text-muted d-block mt-1">Controla la cantidad máxima de asambleas que Fastify traerá en el feed.</span>
        </div>

        <div class="mb-1">
          <label class="small text-muted mb-1 fw-bold">Tipo de Publicación (Locked)</label>
          <input 
            type="text" 
            value="assemblies (Asambleas)" 
            class="form-control form-control-sm bg-light text-muted fw-bold" 
            disabled
          >
          <span class="x-small text-danger d-block mt-1">⚠️ Bloqueado automáticamente para garantizar la integridad de la sección.</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
</style>