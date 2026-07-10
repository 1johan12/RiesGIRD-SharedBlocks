<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: {
    title?: string;
    bgColor?: string;      
    textColor?: string;    
    counters?: Array<{
      prefix?: string;
      number: number | string;
      label: string;
      note?: string;
    }>;
  }
}>();

const emit = defineEmits(['update:modelValue']);

const localData = ref({
  title: props.modelValue?.title || 'Por qué elegir ESAN',
  bgColor: props.modelValue?.bgColor || '#d31245',   
  textColor: props.modelValue?.textColor || '#ffffff', 
  counters: props.modelValue?.counters?.length ? [...props.modelValue.counters] : [
    { prefix: 'TOP', number: 1, label: 'Escuela de Posgrado', note: '*' }
  ]
});

watch(localData, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true });

const addCounter = () => {
  localData.value.counters.push({ prefix: '', number: 0, label: 'Nuevo Dato', note: '' });
};

const removeCounter = (index: number) => {
  localData.value.counters.splice(index, 1);
};
</script>

<template>
  <div class="block-editor-counters p-3 border rounded bg-light">
    <h5 class="mb-3 border-bottom pb-2 text-primary">Configuración: Contadores Animados</h5>

    <div class="row g-3 mb-4 p-3 bg-white rounded border">
      <div class="col-md-6">
        <label class="form-label fw-bold small">Color de Fondo</label>
        <div class="d-flex align-items-center gap-2">
          <input type="color" class="form-control form-control-color" v-model="localData.bgColor">
          <input type="text" class="form-control form-control-sm" v-model="localData.bgColor">
        </div>
      </div>
      <div class="col-md-6">
        <label class="form-label fw-bold small">Color de Texto</label>
        <div class="d-flex align-items-center gap-2">
          <input type="color" class="form-control form-control-color" v-model="localData.textColor">
          <input type="text" class="form-control form-control-sm" v-model="localData.textColor">
        </div>
      </div>
    </div>

    <div class="mb-4">
      <label class="form-label fw-bold">Título de la Sección</label>
      <input type="text" class="form-control" v-model="localData.title" placeholder="Ej: Por qué elegir ESAN">
    </div>

    <div class="mb-2 d-flex justify-content-between align-items-center">
      <label class="form-label fw-bold mb-0">Elementos del Contador</label>
      <button @click="addCounter" class="btn btn-sm btn-primary">+ Agregar Contador</button>
    </div>

    <div v-for="(counter, index) in localData.counters" :key="index" class="card mb-3 shadow-sm border-0">
      <div class="card-header bg-white d-flex justify-content-between align-items-center py-2">
        <span class="fw-bold small">Contador #{{ index + 1 }}</span>
        <button @click="removeCounter(index)" class="btn btn-sm btn-outline-danger py-0 px-2">&times;</button>
      </div>
      <div class="card-body py-2">
        <div class="row g-2">
          <div class="col-md-3 col-sm-6">
            <label class="form-label small text-muted mb-1">Prefijo</label>
            <input type="text" class="form-control form-control-sm" v-model="counter.prefix">
          </div>
          <div class="col-md-3 col-sm-6">
            <label class="form-label small text-muted mb-1">Número</label>
            <input type="number" class="form-control form-control-sm" v-model="counter.number">
          </div>
          <div class="col-md-6 col-sm-12">
            <label class="form-label small text-muted mb-1">Etiqueta</label>
            <input type="text" class="form-control form-control-sm" v-model="counter.label">
          </div>
          <div class="col-12">
            <label class="form-label small text-muted mb-1">Nota (*)</label>
            <input type="text" class="form-control form-control-sm" v-model="counter.note">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-control-color {
  width: 45px;
  height: 35px;
  padding: 2px;
}
</style>