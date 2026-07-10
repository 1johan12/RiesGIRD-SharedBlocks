<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import CareerLeadFormEditor from '../formsEdit/CareerLeadFormEditor.vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  name: props.modelValue?.name || '',
  description: props.modelValue?.description || '',
  branding_color: props.modelValue?.branding_color || '#8c357f',
  bg_overlay: props.modelValue?.bg_overlay || 'rgba(30, 10, 40, 0.8)',
  image: props.modelValue?.image || '',
  
  form_config: props.modelValue?.form_config || { campaign_id: null },
  curriculum_json: Array.isArray(props.modelValue?.curriculum_json) 
    ? props.modelValue.curriculum_json 
    : []
});


watch(localData, (newVal) => { 
  emit('update:modelValue', { ...newVal }); 
}, { deep: true });

watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(localData.value) !== JSON.stringify(newVal)) {
    localData.value = { ...localData.value, ...newVal };
  }
}, { deep: true });


const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '30, 10, 40';
};
const rgbaToHex = (rgba: string) => {
  const parts = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!parts) return '#1e0a28';
  return '#' + [parts[1], parts[2], parts[3]].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
};
const getOpacity = (rgba: string) => {
  const parts = rgba.match(/[\d.]+\)$/g);
  return parts ? Math.round(parseFloat(parts[0]) * 100) : 80;
};
const opacityLevel = computed({
  get: () => getOpacity(localData.value.bg_overlay),
  set: (val) => {
    const currentRgb = localData.value.bg_overlay.match(/rgba?\((\d+,\s*\d+,\s*\d+)/);
    const base = currentRgb ? currentRgb[1] : '30, 10, 40';
    localData.value.bg_overlay = `rgba(${base}, ${val / 100})`;
  }
});
const overlayHex = computed({
  get: () => rgbaToHex(localData.value.bg_overlay),
  set: (val) => {
    localData.value.bg_overlay = `rgba(${hexToRgb(val)}, ${opacityLevel.value / 100})`;
  }
});


const addPlan = () => { localData.value.curriculum_json.push({ modality: '', url: '' }); };
const removePlan = (i: number) => { localData.value.curriculum_json.splice(i, 1); };
const openFilePicker = (index: number) => {
  emit('select-image', { item: localData.value.curriculum_json[index], field: 'url' });
};
</script>

<template>
  <div class="p-3">
    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="las la-font"></i> Textos Principales</h6>
        <div class="mb-2">
            <label class="small text-muted mb-1">Nombre Carrera</label>
            <input type="text" class="form-control form-control-sm" v-model="localData.name">
        </div>
        <div>
            <label class="small text-muted mb-1">Descripción</label>
            <textarea class="form-control form-control-sm" v-model="localData.description" rows="3"></textarea>
        </div>
      </div>
    </div>

    <CareerLeadFormEditor v-model="localData.form_config" />

    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="las la-palette"></i> Estilo Visual</h6>
        <label class="small text-muted mb-1">Color de Marca</label>
        <input type="color" class="form-control form-control-color w-100 mb-3 p-1" v-model="localData.branding_color">
        
        <button class="btn btn-sm btn-dark w-100 mb-3" @click="$emit('select-image', { item: localData, field: 'image' })">
          <i class="las la-image"></i> Cambiar Fondo
        </button>

        <div class="row g-2 bg-white p-2 rounded border">
          <div class="col-6">
            <label class="small text-muted mb-1">Color Overlay</label>
            <input type="color" class="form-control form-control-color w-100 p-1" v-model="overlayHex">
          </div>
          <div class="col-6">
            <label class="small text-muted mb-1">Opacidad: {{ opacityLevel }}%</label>
            <input type="range" class="form-range" min="0" max="100" v-model="opacityLevel">
          </div>
        </div>
      </div>
    </div>

    <div class="card bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="las la-file-pdf"></i> Planes de Estudio</h6>
        <div v-for="(item, i) in localData.curriculum_json" :key="i" class="mb-3 p-2 bg-white border rounded position-relative">
          <button @click="removePlan(Number(i))" class="btn btn-sm text-danger position-absolute top-0 end-0 m-1 p-0">
            <i class="las la-times fs-5"></i>
          </button>
          <div class="mb-2 pe-4">
            <label class="small text-muted mb-1">Modalidad</label>
            <input type="text" class="form-control form-control-sm" v-model="item.modality">
          </div>
          <div>
            <label class="small text-muted mb-1">Archivo PDF</label>
            <div class="input-group input-group-sm">
              <input type="text" class="form-control bg-light" v-model="item.url" readonly>
              <button class="btn btn-secondary" type="button" @click="openFilePicker(Number(i))">
                <i class="las la-folder-open"></i>
              </button>
            </div>
          </div>
        </div>
        <button @click="addPlan" class="btn btn-sm btn-outline-primary w-100 mt-2 fw-bold">
          <i class="las la-plus"></i> AGREGAR MODALIDAD
        </button>
      </div>
    </div>
  </div>
</template>