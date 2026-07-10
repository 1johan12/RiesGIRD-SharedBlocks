<script setup lang="ts">
import { ref, watch } from 'vue';


interface SectionData {
  bgType: 'color' | 'image' | 'gradient';
  bgColor: string;
  bgImage: string;
  bgGradient: string;
  padding: { top: number; bottom: number; };
  imageLeft: string;
  buttonText: string;
  buttonUrl: string;
  buttonTarget: '_self' | '_blank';
  spaceHeight: number;
  imageRight: string;
}

const props = defineProps<{
  modelValue: SectionData
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);


const localData = ref<SectionData>({ ...props.modelValue });


const removeImage = (field: keyof SectionData | 'sectionBg') => {
  if (field === 'sectionBg') {
    localData.value.bgImage = '';
  } else if (typeof field === 'string' && (field === 'imageLeft' || field === 'imageRight')) {
    (localData.value[field] as string) = '';
  }
};


watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  const stringifiedNew = JSON.stringify(newVal);
  const stringifiedLocal = JSON.stringify(localData.value);
  if (stringifiedNew !== stringifiedLocal) {
    localData.value = { ...newVal };
  }
}, { deep: true });


watch(localData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });
</script>

<template>
  <div class="p-3 multimodalidad-editor">
    
    <div class="card mb-3 border-0 shadow-sm bg-light">
      <div class="card-body p-3">
        <h6 class="fw-bold mb-3 text-warning"><i class="las la-paint-roller"></i> Diseño General</h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Tipo de Fondo de Sección</label>
          <select v-model="localData.bgType" class="form-select form-select-sm">
            <option value="color">Color Sólido</option>
            <option value="gradient">Degradado (CSS)</option>
            <option value="image">Imagen</option>
          </select>
        </div>

        <div v-if="localData.bgType === 'color'" class="mb-3">
          <label class="small text-muted mb-1">Color de Fondo Sólido</label>
          <input type="color" v-model="localData.bgColor" class="form-control form-control-color w-100 p-1 border-0">
        </div>
        <div v-if="localData.bgType === 'gradient'" class="mb-3">
          <label class="small text-muted mb-1">CSS del Degradado</label>
          <input type="text" v-model="localData.bgGradient" class="form-control form-control-sm" placeholder="Ej: linear-gradient(90deg, #ff2b2b 0%, #000 100%)">
        </div>
        <div v-if="localData.bgType === 'image'" class="mb-3">
          <label class="small text-muted d-block mb-1">Imagen de Fondo</label>
          <div class="media-placeholder border rounded clickable mb-2" 
               :style="{ backgroundImage: `url(${localData.bgImage})` }"
               @click="$emit('select-image', { item: localData, field: 'bgImage' })">
            <i v-if="!localData.bgImage" class="las la-image fs-3 text-muted"></i>
          </div>
          <button v-if="localData.bgImage" @click="removeImage('sectionBg')" class="btn btn-sm btn-outline-danger w-100 py-1">Quitar Fondo</button>
        </div>

        <hr class="my-3">

        <div class="row g-2">
          <div class="col-6">
            <label class="small text-muted mb-1">Padding Superior (px)</label>
            <input type="number" v-model="localData.padding.top" class="form-control form-control-sm">
          </div>
          <div class="col-6">
            <label class="small text-muted mb-1">Padding Inferior (px)</label>
            <input type="number" v-model="localData.padding.bottom" class="form-control form-control-sm">
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm bg-light">
      <div class="card-body p-3">
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-id-card"></i> Columna Izquierda (Texto + Botón)</h6>
        
        <div class="mb-3">
          <label class="small text-muted d-block mb-1">Imagen ("¡Con 3 modalidades!")</label>
          <div class="media-placeholder border rounded clickable mb-2" 
               :style="{ backgroundImage: `url(${localData.imageLeft})`, backgroundSize: 'contain' }"
               @click="$emit('select-image', { item: localData, field: 'imageLeft' })">
            <i v-if="!localData.imageLeft" class="las la-image fs-3 text-muted"></i>
          </div>
          <button v-if="localData.imageLeft" @click="removeImage('imageLeft')" class="btn btn-sm btn-outline-danger w-100 py-1">Quitar Imagen</button>
        </div>

        <div class="mb-3">
          <label class="small text-muted mb-1">Altura del Espacio Vacío (px)</label>
          <input type="number" v-model="localData.spaceHeight" class="form-control form-control-sm">
        </div>

        <div class="row g-2">
          <div class="col-12 mb-2">
            <label class="small text-muted mb-1">Texto del Botón</label>
            <input type="text" v-model="localData.buttonText" class="form-control form-control-sm text-uppercase">
          </div>
          <div class="col-8">
            <label class="small text-muted mb-1">URL / Link del Botón</label>
            <input type="text" v-model="localData.buttonUrl" class="form-control form-control-sm">
          </div>
          <div class="col-4">
            <label class="small text-muted mb-1">Destino</label>
            <select v-model="localData.buttonTarget" class="form-select form-select-sm">
              <option value="_self">Mismo</option>
              <option value="_blank">Nueva</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm bg-light">
      <div class="card-body p-3">
        <h6 class="fw-bold mb-3 text-success"><i class="las la-desktop"></i> Columna Derecha (Modalidades)</h6>
        
        <div class="mb-3">
          <label class="small text-muted d-block mb-1">Imagen (Lista de Modalidades)</label>
          <div class="media-placeholder border rounded clickable mb-2" 
               :style="{ backgroundImage: `url(${localData.imageRight})`, backgroundSize: 'contain' }"
               @click="$emit('select-image', { item: localData, field: 'imageRight' })">
            <i v-if="!localData.imageRight" class="las la-image fs-3 text-muted"></i>
          </div>
          <button v-if="localData.imageRight" @click="removeImage('imageRight')" class="btn btn-sm btn-outline-danger w-100 py-1">Quitar Imagen</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.multimodalidad-editor {
  font-family: Arial, sans-serif;
}

.media-placeholder {
  height: 80px;
  background-color: #ffffff;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.media-placeholder:hover {
  opacity: 0.8;
  border-color: #ff2b2b !important; /* Rojo ESAN */
}

.clickable {
  cursor: pointer;
}
</style>