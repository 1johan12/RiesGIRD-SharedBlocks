<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref({
  title: props.modelValue?.title || 'Busca su Aliado',
  limit: props.modelValue?.limit || 12
});

// Sincronizador defensivo contra bucles infinitos en el panel lateral de administración
watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(newVal) !== JSON.stringify(localData.value)) {
    localData.value = {
      title: newVal.title || 'Busca su Aliado',
      limit: newVal.limit || 12
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
        <h6 class="fw-bold mb-3 text-warning"><i class="las la-heading"></i> Encabezado</h6>
        <div class="mb-1">
          <label class="small text-muted mb-1 fw-bold">Título del Bloque</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm fw-semibold">
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-server"></i> Control de la API</h6>
        <div class="mb-1">
          <label class="small text-muted mb-1 fw-bold">Máximo de Aliados a Mostrar</label>
          <select v-model="localData.limit" class="form-select form-select-sm fw-bold text-secondary">
            <option :value="4">4 Aliados</option>
            <option :value="8">8 Aliados</option>
            <option :value="12">12 Aliados</option>
            <option :value="24">24 Aliados</option>
            <option :value="50">50 Aliados</option>
          </select>
          <span class="x-small text-muted d-block mt-1">Regula cuántas marcas de aliados cargará la consulta de Fastify antes de realizar los filtros point-and-click.</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
</style>