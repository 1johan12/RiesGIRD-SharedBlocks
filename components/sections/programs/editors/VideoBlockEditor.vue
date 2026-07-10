<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);


const localData = ref({
  title: props.modelValue?.title || 'CAFÉ DPA con Joseph Ballón',
  description: props.modelValue?.description || 'Cómo la carrera de Ingeniería de Sistemas integra conocimientos y habilidades para abordar las diversas áreas del mercado laboral actual.',
  videoUrl: props.modelValue?.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  bgImage: props.modelValue?.bgImage || '',
  textColor: props.modelValue?.textColor || '#ffffff',
  overlayColor: props.modelValue?.overlayColor || '#000000',
  overlayOpacity: props.modelValue?.overlayOpacity ?? 0.7 
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
</script>

<template>
  <div class="p-3">
    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3 text-center">
        <h6 class="fw-bold text-primary mb-3 text-start"><i class="bi bi-image"></i> Fondo del Bloque</h6>
        <div class="mb-3">
          <img v-if="localData.bgImage" :src="localData.bgImage" class="img-thumbnail mb-2" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px;">
          <div v-else class="bg-white border rounded mb-2 mx-auto" style="width: 100%; height: 120px; display: grid; place-items: center;">
            <i class="bi bi-camera-video fs-1 text-muted"></i>
          </div>
          <button class="btn btn-sm btn-dark w-100 fw-bold" @click="$emit('select-image', { item: localData, field: 'bgImage' })">
            <i class="bi bi-file-image"></i> Seleccionar Imagen de Fondo
          </button>
        </div>
      </div>
    </div>

    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="bi bi-fonts"></i> Textos y Video</h6>
        <div class="mb-2">
          <label class="small text-muted mb-1">Título</label>
          <input type="text" class="form-control form-control-sm" v-model="localData.title">
        </div>
        <div class="mb-2">
          <label class="small text-muted mb-1">Descripción</label>
          <textarea class="form-control form-control-sm" v-model="localData.description" rows="2"></textarea>
        </div>
        <div class="mb-2 mt-3 p-2 bg-white border rounded">
          <label class="small text-muted fw-bold mb-1"><i class="bi bi-youtube text-danger"></i> Link de YouTube</label>
          <input type="text" class="form-control form-control-sm" v-model="localData.videoUrl" placeholder="Ej: https://www.youtube.com/watch?v=...">
          <small class="text-muted" style="font-size: 0.7rem;">Pega el enlace normal del video, el sistema lo adaptará automáticamente.</small>
        </div>
      </div>
    </div>

    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="bi bi-palette"></i> Diseño y Capa Oscura</h6>
        <div class="row g-2 align-items-center">
          <div class="col-6">
            <label class="small text-muted mb-1">Color del Texto</label>
            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.textColor">
          </div>
          <div class="col-6">
            <label class="small text-muted mb-1">Color de Capa (Overlay)</label>
            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.overlayColor">
          </div>
          <div class="col-12 mt-2">
            <label class="small text-muted mb-1 d-flex justify-content-between">
              <span>Opacidad de la Capa:</span>
              <span>{{ Math.round(localData.overlayOpacity * 100) }}%</span>
            </label>
            <input type="range" class="form-range" min="0" max="1" step="0.1" v-model="localData.overlayOpacity">
            <small class="text-muted d-block" style="font-size: 0.7rem;">(Aumenta la opacidad si el texto no se lee bien con el fondo)</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>