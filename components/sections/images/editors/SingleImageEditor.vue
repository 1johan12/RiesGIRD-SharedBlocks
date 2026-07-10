<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);


const localData = ref({
  imageUrl: props.modelValue?.imageUrl || '',
  alignment: props.modelValue?.alignment || 'center',
  maxWidth: props.modelValue?.maxWidth || '100%',
  padding: props.modelValue?.padding || 'py-5'
});


const removeImage = () => {
  localData.value.imageUrl = '';
};


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
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-image"></i> Imagen Única</h6>

        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <label class="small text-muted mb-0 fw-bold">Imagen a mostrar</label>
            <button v-if="localData.imageUrl" @click="removeImage" class="btn btn-sm btn-outline-danger py-0 px-2">
              <i class="las la-times"></i> Quitar
            </button>
          </div>
          
          <div @click="$emit('select-image', { item: localData, field: 'imageUrl' })" 
               class="media-placeholder border rounded clickable position-relative"
               :style="{ backgroundImage: `url(${localData.imageUrl})` }">
            <i v-if="!localData.imageUrl" class="las la-image fs-1 text-muted"></i>
          </div>
        </div>

        <hr class="text-muted">

        <div class="row g-3 mb-3">
          <div class="col-6">
            <label class="x-small d-block mb-1">Alineación</label>
            <select v-model="localData.alignment" class="form-select form-select-sm">
              <option value="start">Izquierda</option>
              <option value="center">Centro</option>
              <option value="end">Derecha</option>
            </select>
          </div>
          
          <div class="col-6">
            <label class="x-small d-block mb-1">Ancho máximo</label>
            <select v-model="localData.maxWidth" class="form-select form-select-sm">
              <option value="100%">100% (Completo)</option>
              <option value="75%">75%</option>
              <option value="50%">50%</option>
              <option value="25%">25%</option>
            </select>
          </div>
        </div>

        <div>
          <label class="x-small d-block mb-1">Espaciado vertical (Padding)</label>
          <select v-model="localData.padding" class="form-select form-select-sm">
            <option value="py-0">Sin espaciado</option>
            <option value="py-3">Pequeño</option>
            <option value="py-5">Normal</option>
            <option value="py-lg-5 py-xl-6">Grande</option>
          </select>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.media-placeholder {
  height: 120px;
  background-color: #f8f9fa;
  background-size: contain; /* Para que se vea completa en el preview */
  background-repeat: no-repeat;
  background-position: center;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: opacity 0.2s;
}
.media-placeholder:hover {
  opacity: 0.8;
  border-color: #0d6efd !important;
}

.x-small { font-size: 0.65rem; text-transform: uppercase; font-weight: bold; }
.clickable { cursor: pointer; }
</style>