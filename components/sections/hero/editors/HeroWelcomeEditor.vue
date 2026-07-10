<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);


const localData = ref({
  title: props.modelValue?.title || 'BIENVENIDOS AL DPA',
  subtitle: props.modelValue?.subtitle || 'Formación profesional...',
  bgImage: props.modelValue?.bgImage || '',
  mainImage: props.modelValue?.mainImage || '',
  overlayOpacity: props.modelValue?.overlayOpacity ?? 0.8,
  textColor: props.modelValue?.textColor || '#ffffff',
  btnColor: props.modelValue?.btnColor || '#e93433',
  primaryBtnText: props.modelValue?.primaryBtnText || 'INSCRÍBETE',
  primaryBtnUrl: props.modelValue?.primaryBtnUrl || '#',
  secondaryBtnText: props.modelValue?.secondaryBtnText || 'SOLICITA INFO',
  secondaryBtnUrl: props.modelValue?.secondaryBtnUrl || '#',
  items: props.modelValue?.items ? [...props.modelValue.items] : []
});


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

const addItem = () => localData.value.items.push('Nuevo beneficio');
const removeItem = (index: number) => localData.value.items.splice(index, 1);
</script>

<template>
  <div class="p-3">
    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold text-primary mb-3"><i class="las la-image"></i> Multimedia</h6>
        <div class="row g-3">
          <div class="col-6 text-center">
            <label class="x-small d-block mb-2">Imagen Fondo</label>
            <div @click="$emit('select-image', { item: localData, field: 'bgImage' })" 
                 class="media-placeholder border rounded mb-2 clickable"
                 :style="{ backgroundImage: `url(${localData.bgImage})` }">
              <i v-if="!localData.bgImage" class="las la-plus fs-2 text-muted"></i>
            </div>
          </div>
          <div class="col-6 text-center">
            <label class="x-small d-block mb-2">Imagen Lateral</label>
            <div @click="$emit('select-image', { item: localData, field: 'mainImage' })" 
                 class="media-placeholder border rounded mb-2 clickable"
                 :style="{ backgroundImage: `url(${localData.mainImage})` }">
              <i v-if="!localData.mainImage" class="las la-plus fs-2 text-muted"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary">Contenido Escrito</h6>
        <div class="mb-3">
          <label class="small text-muted">Título</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm">
        </div>
        <div class="mb-3">
          <label class="small text-muted">Subtítulo</label>
          <textarea v-model="localData.subtitle" class="form-control form-control-sm" rows="2"></textarea>
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary">Botones (Stack)</h6>
        <div class="row g-2 mb-2">
          <div class="col-6"><input type="text" v-model="localData.primaryBtnText" class="form-control form-control-sm" placeholder="Texto 1"></div>
          <div class="col-6"><input type="text" v-model="localData.primaryBtnUrl" class="form-control form-control-sm" placeholder="URL 1"></div>
        </div>
        <div class="row g-2">
          <div class="col-6"><input type="text" v-model="localData.secondaryBtnText" class="form-control form-control-sm" placeholder="Texto 2"></div>
          <div class="col-6"><input type="text" v-model="localData.secondaryBtnUrl" class="form-control form-control-sm" placeholder="URL 2"></div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm bg-light text-white">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-warning">Ajustes Visuales</h6>
        <div class="row align-items-center">
          <div class="col-4">
            <label class="x-small d-block">Color</label>
            <input type="color" v-model="localData.btnColor" class="form-control form-control-color w-100 p-1">
          </div>
          <div class="col-8">
            <label class="x-small d-block">Opacidad Fondo: {{ Math.round(localData.overlayOpacity * 100) }}%</label>
            <input type="range" v-model="localData.overlayOpacity" min="0" max="1" step="0.1" class="form-range">
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.media-placeholder {
  height: 90px;
  background-color: #eee;
  background-size: cover;
  background-position: center;
  display: grid;
  place-items: center;
  cursor: pointer;
  border: 2px dashed #ccc;
}
.x-small { font-size: 0.65rem; text-transform: uppercase; font-weight: bold; }
.clickable { cursor: pointer; }
</style>