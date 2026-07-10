<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref({
  title: props.modelValue?.title || 'Estructura de la RiesGIRD-ACC/Perú',
  universidades: props.modelValue?.universidades || [
    'Universidad Nacional Mayor de San Marcos',
    'Pontificia Universidad Católica del Perú',
    'Universidad Nacional de Ingeniería',
    'Universidad Nacional Agraria La Molina'
  ]
});

// Operaciones para el arreglo de Universidades Aliadas
const addUniversidad = () => {
  localData.value.universidades.push('Nueva Universidad Miembro');
};

const removeUniversidad = (index: number) => {
  localData.value.universidades.splice(index, 1);
};

// Sincronizador de romper bucles reactivos infinitos
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
        <h6 class="fw-bold mb-3 text-warning"><i class="las la-heading"></i> Encabezado</h6>
        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Título del Bloque</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm">
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-primary"><i class="las la-university"></i> Instituciones de la Red</h6>
          <span class="badge bg-secondary text-white small">{{ localData.universidades.length }}</span>
        </div>

        <div v-for="(uni, index) in localData.universidades" :key="index" class="border rounded mb-2 p-2 bg-light position-relative">
          
          <button 
            @click="removeUniversidad(Number(index))" 
            class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1 text-white" 
            title="Eliminar Universidad"
            :disabled="localData.universidades.length <= 1"
          >
            <i class="las la-times"></i>
          </button>

          <div class="mt-2">
            <label class="x-small fw-bold text-muted mb-1">Nombre de la Institución</label>
            <input type="text" v-model="localData.universidades[index]" class="form-control form-control-sm fw-semibold">
          </div>

        </div>

        <button @click="addUniversidad" class="btn btn-sm btn-outline-success w-100 mt-2">
          <i class="las la-plus"></i> Añadir Universidad Aliada
        </button>

      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.68rem; }
</style>