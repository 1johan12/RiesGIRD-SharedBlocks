<script setup lang="ts">
import { ref, watch } from 'vue';
import { formatImageUrl } from '../../../../helpers/url';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const defaultCollage = () => ({
  superior: '',
  izquierda: '',
  centroAbajo: '',
  derecha: ''
});

const localData = ref({
  title: props.modelValue?.title || 'RED PERUANA DE INSTITUCIONES DE EDUCACIÓN SUPERIOR UNIVERSITARIA...',
  logoUrl: props.modelValue?.logoUrl || '',
  collageImagenes: props.modelValue?.collageImagenes
    ? { ...defaultCollage(), ...props.modelValue.collageImagenes }
    : defaultCollage()
});


watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  const normalized = {
    ...localData.value,
    ...newVal,
    collageImagenes: newVal.collageImagenes
      ? { ...defaultCollage(), ...newVal.collageImagenes }
      : defaultCollage()
  };
  if (JSON.stringify(normalized) !== JSON.stringify(localData.value)) {
    localData.value = normalized;
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
        <h6 class="fw-bold mb-3 text-primary">
          <i class="las la-font"></i> Contenido del Contenedor
        </h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título Institucional</label>
          <textarea 
            v-model="localData.title" 
            class="form-control form-control-sm text-uppercase" 
            rows="4"
            placeholder="Escribe el título de la Red..."
          ></textarea>
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold d-block">Logo de la Red (Marca)</label>
          <div 
            @click="$emit('select-image', { item: localData, field: 'logoUrl' })" 
            class="media-placeholder border rounded clickable bg-light"
            :style="{ backgroundImage: localData.logoUrl ? `url(${formatImageUrl(localData.logoUrl, '')})` : 'none' }"
          >
            <i v-if="!localData.logoUrl" class="las la-file-upload fs-3 text-muted"></i>
          </div>
          <div class="d-flex gap-1 mt-1">
            <button type="button" class="btn btn-xs btn-outline-primary flex-grow-1" @click="$emit('select-image', { item: localData, field: 'logoUrl' })">
              <i class="las la-image me-1"></i>{{ localData.logoUrl ? 'Cambiar Logo' : 'Elegir Logo' }}
            </button>
            <button v-if="localData.logoUrl" type="button" class="btn btn-xs btn-outline-danger" @click="localData.logoUrl = ''">
              <i class="las la-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-warning">
          <i class="las la-images"></i> Galería del Collage (Máscaras)
        </h6>
        <p class="x-small text-muted mb-3">Haz clic en la imagen o en Cambiar para asignar la fotografía principal.</p>
        
        <div class="row g-2">
          <div class="col-12">
            <label class="x-small fw-bold text-muted mb-1">1. Imagen Principal del Collage</label>
            <div 
              @click="$emit('select-image', { item: localData.collageImagenes, field: 'superior' })" 
              class="collage-placeholder border rounded clickable"
              :style="{ backgroundImage: localData.collageImagenes.superior ? `url(${formatImageUrl(localData.collageImagenes.superior, '')})` : 'none' }"
            >
              <i v-if="!localData.collageImagenes.superior" class="las la-image text-muted"></i>
            </div>
            <div class="d-flex gap-1 mt-1">
              <button type="button" class="btn btn-xs btn-outline-primary flex-grow-1" @click="$emit('select-image', { item: localData.collageImagenes, field: 'superior' })">
                <i class="las la-image me-1"></i>{{ localData.collageImagenes.superior ? 'Cambiar Foto' : 'Elegir Foto' }}
              </button>
              <button v-if="localData.collageImagenes.superior" type="button" class="btn btn-xs btn-outline-danger" @click="localData.collageImagenes.superior = ''">
                <i class="las la-times"></i>
              </button>
            </div>
          </div>

          
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.7rem; }
.media-placeholder { 
  height: 80px; 
  background-size: contain; 
  background-position: center; 
  background-repeat: no-repeat;
  display: grid; 
  place-items: center; 
  cursor: pointer; 
}
.collage-placeholder { 
  height: 90px; 
  background-size: cover; 
  background-position: center; 
  display: grid; 
  place-items: center; 
  cursor: pointer; 
  background-color: #f8f9fa;
}
.clickable:hover { 
  opacity: 0.85; 
  border-color: #0d6efd !important; 
  box-shadow: 0 0 0 1px #0d6efd;
}
</style>