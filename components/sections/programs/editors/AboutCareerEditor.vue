<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);


const localData = ref({
  tag: props.modelValue?.tag || 'ACERCA DE LA CARRERA',
  title: props.modelValue?.title || '',
  subtitle: props.modelValue?.subtitle || '',
  description: props.modelValue?.description || '',
  image: props.modelValue?.image || '',
  bgColor: props.modelValue?.bgColor || '#ffffff',
  textColor: props.modelValue?.textColor || '#1e1e1e',
  tagColor: props.modelValue?.tagColor || '#8c357f'
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
        <h6 class="fw-bold text-primary mb-3 text-start"><i class="las la-image"></i> Imagen del Bloque</h6>
        <div class="mb-3">
          <img v-if="localData.image" :src="localData.image" class="img-thumbnail mb-2" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover;">
          <div v-else class="bg-white border rounded mb-2 mx-auto" style="width: 120px; height: 120px; display: grid; place-items: center;">
            <i class="las la-photo-video fs-1 text-muted"></i>
          </div>
          <button class="btn btn-sm btn-dark w-100" @click="$emit('select-image', { item: localData, field: 'image' })">
            <i class="las la-file-image"></i> Seleccionar Imagen Circular
          </button>
        </div>
      </div>
    </div>

    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="las la-font"></i> Contenido</h6>
        <div class="mb-2">
          <label class="small text-muted mb-1">Etiqueta (Tag)</label>
          <input type="text" class="form-control form-control-sm" v-model="localData.tag">
        </div>
        <div class="mb-2">
          <label class="small text-muted mb-1">Título Grande</label>
          <textarea class="form-control form-control-sm" v-model="localData.title" rows="2"></textarea>
        </div>
        <div class="mb-2">
          <label class="small text-muted mb-1">Resumen (Negrita)</label>
          <textarea class="form-control form-control-sm" v-model="localData.subtitle" rows="3"></textarea>
        </div>
        <div>
          <label class="small text-muted mb-1">Descripción Detallada</label>
          <textarea class="form-control form-control-sm" v-model="localData.description" rows="4"></textarea>
        </div>
      </div>
    </div>

    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="las la-palette"></i> Colores Personalizados</h6>
        <div class="row g-2">
          <div class="col-4">
            <label class="small text-muted mb-1">Fondo</label>
            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.bgColor">
          </div>
          <div class="col-4">
            <label class="small text-muted mb-1">Texto</label>
            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.textColor">
          </div>
          <div class="col-4">
            <label class="small text-muted mb-1">Etiqueta</label>
            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.tagColor">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>