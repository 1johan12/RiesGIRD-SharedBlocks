<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const normalizeLimit = (val: unknown, fallback = 8): number => {
  if (val === 0 || val === '0' || val === 'all' || val === null) return 0;
  const n = Number(val);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};

const normalizeState = (src: any) => ({
  title: src?.title || 'Directorio de Miembros',
  limit: src?.limit !== undefined && src?.limit !== '' ? normalizeLimit(src.limit, 8) : 8,
  forcedType: src?.forcedType || 'all',
  actionText: src?.actionText || 'Ver Más',
  actionUrl: src?.actionUrl || '',
});

const localData = ref(normalizeState(props.modelValue));

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;
    const incoming = normalizeState(newVal);
    if (JSON.stringify(incoming) !== JSON.stringify(localData.value)) {
      localData.value = incoming;
    }
  },
  { deep: true }
);

watch(
  localData,
  (newVal) => {
    emit('update:modelValue', { ...newVal });
  },
  { deep: true }
);
</script>

<template>
  <div class="p-3">
    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-warning"><i class="las la-heading"></i> Encabezado</h6>
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título de la Sección</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm fw-semibold">
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-success"><i class="las la-link"></i> Acción del Botón</h6>

        <div class="mb-2.5">
          <label class="small text-muted mb-1 fw-bold">Texto del Botón</label>
          <input
            type="text"
            v-model="localData.actionText"
            class="form-control form-control-sm fw-semibold"
            placeholder="Ej: Ver Más"
          >
        </div>

        <div class="mb-1">
          <label class="small text-muted mb-1 fw-bold">Ruta / Enlace Opcional (Route)</label>
          <input
            type="text"
            v-model="localData.actionUrl"
            class="form-control form-control-sm fw-semibold font-mono text-dark"
            placeholder="Vacío = carga de 4 en 4 en esta vista"
          >
          <span class="x-small text-muted d-block mt-1">
            Si lo dejas vacío, el botón cargará más miembros de 4 en 4 hasta mostrarlos todos y luego se ocultará.
          </span>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-server"></i> Filtro y Paginación</h6>
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Tipo de Institución</label>
          <select v-model="localData.forcedType" class="form-select form-select-sm fw-bold text-secondary">
            <option value="all">Todas</option>
            <option value="public">Universidades Públicas</option>
            <option value="private">Universidades Privadas</option>
            <option value="institute">Institutos</option>
            <option value="foreign">Extranjeras</option>
          </select>
        </div>
        <div class="mb-1">
          <label class="small text-muted mb-1 fw-bold">Cantidad Inicial a Mostrar</label>
          <select v-model.number="localData.limit" class="form-select form-select-sm fw-bold text-secondary">
            <option :value="0">Sin límite (Mostrar todas)</option>
            <option :value="4">4 Miembros</option>
            <option :value="8">8 Miembros</option>
            <option :value="12">12 Miembros</option>
            <option :value="16">16 Miembros</option>
            <option :value="24">24 Miembros</option>
            <option :value="32">32 Miembros</option>
          </select>
          <span class="x-small text-muted d-block mt-1">
            Con límite numérico, el botón "Ver Más" agrega de 4 en 4 sin tope máximo. Con "Sin límite", se pintan todas directamente.
          </span>
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
