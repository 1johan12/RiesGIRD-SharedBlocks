<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

// Data local reactiva protegida
const localData = ref({
  title: props.modelValue?.title || 'Lineamientos',
  titleLink: props.modelValue?.titleLink || '/lineamiento',
  introText: props.modelValue?.introText || 'La RIESGIRD-ACC Perú orienta su accionar bajo los siguientes lineamientos:',
  lineamientos: props.modelValue?.lineamientos || []
});

// Métodos para controlar la lista de tarjetas de forma dinámica
const addLineamiento = () => {
  localData.value.lineamientos.push({
    id: Date.now(),
    color: localData.value.lineamientos.length % 2 === 0 ? 'azul' : 'rojo', // Alterna color por defecto
    texto: 'Enunciado del nuevo lineamiento estratégico de la red.'
  });
};

const removeLineamiento = (index: number) => {
  localData.value.lineamientos.splice(index, 1);
};

// Sincronización limpia basada en Stringify para romper bucles
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
    
    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-cog"></i> Cabecera del Bloque</h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título de la Sección</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm">
        </div>

        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Enlace del Título (Ruta / URL)</label>
          <input type="text" v-model="localData.titleLink" class="form-control form-control-sm" placeholder="Ej: /lineamiento">
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Texto de Introducción</label>
          <textarea v-model="localData.introText" class="form-control form-control-sm" rows="3"></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-danger"><i class="las la-list-ol"></i> Tarjetas de Lineamientos</h6>
          <span class="badge bg-secondary text-white small">{{ localData.lineamientos.length }}</span>
        </div>

        <div v-for="(item, index) in localData.lineamientos" :key="item.id || index" class="border rounded mb-3 p-2 bg-light position-relative">
          
          <button 
            @click="removeLineamiento(Number(index))" 
            class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1 text-white border-0" 
            title="Eliminar"
          >
            <i class="las la-times"></i>
          </button>

          <div class="row g-2 mt-2">
            <div class="col-12">
              <label class="x-small fw-bold text-muted mb-1">Color Corporativo</label>
              <select v-model="item.color" class="form-select form-select-sm fw-medium">
                <option value="azul">🔵 Azul Institucional</option>
                <option value="rojo">🔴 Rojo Carmesí</option>
              </select>
            </div>

            <div class="col-12 mt-1">
              <label class="x-small fw-bold text-muted mb-1">Texto del Lineamiento</label>
              <textarea v-model="item.texto" class="form-control form-control-sm" rows="3" placeholder="Escribe el lineamiento aquí..."></textarea>
            </div>
          </div>

        </div>

        <button @click="addLineamiento" class="btn btn-sm btn-outline-success w-100 mt-2">
          <i class="las la-plus"></i> Agregar Lineamiento
        </button>

      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.7rem; }
</style>