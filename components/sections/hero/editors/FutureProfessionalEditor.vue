<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  introText: props.modelValue?.introText || '',
  mainQuote: props.modelValue?.mainQuote || '',
  featuredImage: props.modelValue?.featuredImage || '',
  bgPattern: props.modelValue?.bgPattern || '',
  bgGradient1: props.modelValue?.bgGradient1 || '#311b92',
  bgGradient2: props.modelValue?.bgGradient2 || '#1a237e',
  bgGradient3: props.modelValue?.bgGradient3 || '#0d1246',
  bgPatternOpacity: props.modelValue?.bgPatternOpacity ?? 0.3,
  textColor: props.modelValue?.textColor || '#ffffff'
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
</script>

<template>
  <div class="p-3">
    
    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold text-primary mb-3"><i class="las la-image"></i> Multimedia</h6>
        <div class="row g-3">
          <div class="col-6 text-center">
            <label class="x-small d-block mb-2">Pantallas (Frente)</label>
            <div @click="$emit('select-image', { item: localData, field: 'featuredImage' })" 
                 class="media-placeholder border rounded mb-2 clickable"
                 :style="{ backgroundImage: `url(${localData.featuredImage})` }">
              <i v-if="!localData.featuredImage" class="las la-plus fs-2 text-muted"></i>
            </div>
          </div>
          <div class="col-6 text-center">
            <label class="x-small d-block mb-2">Textura (Fondo)</label>
            <div @click="$emit('select-image', { item: localData, field: 'bgPattern' })" 
                 class="media-placeholder border rounded mb-2 clickable"
                 :style="{ backgroundImage: `url(${localData.bgPattern})`, backgroundColor: '#444' }">
              <i v-if="!localData.bgPattern" class="las la-plus fs-2 text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary">Contenido Escrito</h6>
        <div class="mb-3">
          <label class="small text-muted">Texto Introductorio</label>
          <textarea v-model="localData.introText" class="form-control form-control-sm" rows="2"></textarea>
        </div>
        <div class="mb-3">
          <label class="small text-muted">Mensaje Principal (Comillas)</label>
          <textarea v-model="localData.mainQuote" class="form-control form-control-sm" rows="3"></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm bg-light text-white">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-warning">Ajustes Visuales</h6>
        
        <label class="x-small d-block mb-1">Colores del Degradado (Centro > Medio > Afuera)</label>
        <div class="row g-2 mb-3">
          <div class="col-4">
            <input type="color" v-model="localData.bgGradient1" class="form-control form-control-color w-100 p-1">
          </div>
          <div class="col-4">
            <input type="color" v-model="localData.bgGradient2" class="form-control form-control-color w-100 p-1">
          </div>
          <div class="col-4">
            <input type="color" v-model="localData.bgGradient3" class="form-control form-control-color w-100 p-1">
          </div>
        </div>

        <div class="row align-items-center">
          <div class="col-12">
            <label class="x-small d-block">Opacidad de la Textura: {{ Math.round(localData.bgPatternOpacity * 100) }}%</label>
            <input type="range" v-model="localData.bgPatternOpacity" min="0" max="1" step="0.1" class="form-range">
          </div>
        </div>
        
        <div class="row align-items-center mt-3">
          <div class="col-12">
             <label class="x-small d-block">Color del Texto</label>
             <input type="color" v-model="localData.textColor" class="form-control form-control-color w-100 p-1">
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* --- ESTILOS DEL EDITOR --- */
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