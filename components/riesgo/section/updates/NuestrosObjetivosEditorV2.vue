<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

// Data local reactiva
const localData = ref({
  title: props.modelValue?.title || 'Nuestros Objetivos',
  introText: props.modelValue?.introText || '',
  titleOE: props.modelValue?.titleOE || 'Objetivos Especificos',
  introTextOE: props.modelValue?.introTextOE || '',
  generalObjective: props.modelValue?.generalObjective || '',
  objetivosEspecificos: props.modelValue?.objetivosEspecificos || []
});

const addObjetivo = () => {
  const nextNum = localData.value.objetivosEspecificos.length + 1;
  localData.value.objetivosEspecificos.push({
    id: Date.now(),
    tag: `Objetivo ${nextNum}`,
    text: 'Descripción del nuevo objetivo estratégico institucional.',
    color: nextNum > 3 ? 'rojo' : 'azul'
  });
};

const removeObjetivo = (index: number) => {
  localData.value.objetivosEspecificos.splice(index, 1);
};

// Doble-Watch a prueba de bucles infinitos por comparación estricta de Strings
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
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-heading"></i> Textos Principales</h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título de la Sección</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm">
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Texto de Introducción</label>
          <textarea v-model="localData.introText" class="form-control form-control-sm" rows="3"></textarea>
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-dark"><i class="las la-star-of-life"></i> Módulo Objetivo General</h6>
        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Enunciado Principal (Caja Gradiente)</label>
          <textarea v-model="localData.generalObjective" class="form-control form-control-sm font-italic" rows="4"></textarea>
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-heading"></i> Objetivos Especificos</h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título de la Sección</label>
          <input type="text" v-model="localData.titleOE" class="form-control form-control-sm">
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Texto de Introducción</label>
          <textarea v-model="localData.introTextOE" class="form-control form-control-sm" rows="3"></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-danger"><i class="las la-th-large"></i> Objetivos Específicos</h6>
        
        <div v-for="(item, index) in localData.objetivosEspecificos" :key="item.id || index" class="border rounded mb-3 p-2 bg-light position-relative">
          
          <button 
            @click="removeObjetivo(Number(index))" 
            class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1 text-white border-0" 
            title="Eliminar"
          >
            <i class="las la-times"></i>
          </button>

          <div class="row g-2 mt-2">
            <div class="col-6">
              <label class="x-small fw-bold text-muted mb-1">Pestaña (Tag)</label>
              <input type="text" v-model="item.tag" class="form-control form-control-sm fw-bold" placeholder="Ej: Objetivo 1">
            </div>

            <div class="col-6">
              <label class="x-small fw-bold text-muted mb-1">Fila / Color</label>
              <select v-model="item.color" class="form-select form-select-sm fw-medium">
                <option value="azul">🔵 Azul (Superior)</option>
                <option value="rojo">🔴 Rojo (Inferior)</option>
              </select>
            </div>

            <div class="col-12 mt-2">
              <label class="x-small fw-bold text-muted mb-1">Descripción del Objetivo</label>
              <textarea v-model="item.text" class="form-control form-control-sm" rows="3" placeholder="Escribe el objetivo específico aquí..."></textarea>
            </div>
          </div>

        </div>

        <button @click="addObjetivo" class="btn btn-sm btn-outline-success w-100 mt-2">
          <i class="las la-plus"></i> Agregar Objetivo Específico
        </button>

      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.7rem; }
.font-italic { font-style: italic; }
</style>