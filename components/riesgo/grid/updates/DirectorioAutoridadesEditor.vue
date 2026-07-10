<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref({
  title: props.modelValue?.title || 'Directorio',
  limit: props.modelValue?.limit || 6,
  actionText: props.modelValue?.actionText || 'Ver Más',
  actionUrl: props.modelValue?.actionUrl || ''
});

// Sincronizador blindado contra bucles de reactividad infinita en tu panel lateral
watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(newVal) !== JSON.stringify(localData.value)) {
    localData.value = {
      title: newVal.title || 'Directorio',
      limit: newVal.limit || 6,
      actionText: newVal.actionText || 'Ver Más',
      actionUrl: newVal.actionUrl || ''
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

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-success"><i class="las la-link"></i> Acción del Botón</h6>

        <div class="mb-2.5">
          <label class="small text-muted mb-1 fw-bold">Texto del Botón</label>
          <input type="text" v-model="localData.actionText" class="form-control form-control-sm fw-semibold"
            placeholder="Ej: Ver Todos los Miembros">
        </div>

        <div class="mb-1">
          <label class="small text-muted mb-1 fw-bold">Ruta / Enlace Interno (Route)</label>
          <input type="text" v-model="localData.actionUrl"
            class="form-control form-control-sm fw-semibold font-mono text-dark"
            placeholder="Ej: /miembros o /directorio">
          <span class="x-small text-muted d-block mt-1">El botón actuará como router-link / NuxtLink redirigiendo a esta
            vista.</span>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-server"></i> Control de Servidor</h6>
        <div class="mb-1">
          <label class="small text-muted mb-1 fw-bold">Límite Inicial de Autoridades</label>
          <select v-model="localData.limit" class="form-select form-select-sm fw-bold text-secondary">
            <option :value="2">2 Autoridades</option>
            <option :value="4">4 Autoridades</option>
            <option :value="6">6 Autoridades</option>
            <option :value="8">8 Autoridades</option>
            <option :value="12">12 Autoridades</option>
          </select>
          <span class="x-small text-muted d-block mt-1">Determina cuántas fichas de rectores/directores cargará Fastify
            en primera instancia.</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
.mb-2 { margin-bottom: 10px; }
.font-mono { font-family: monospace; }
</style>