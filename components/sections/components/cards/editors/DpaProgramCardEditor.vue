<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);


const localData = ref({
  color: props.modelValue?.color || '#00A89E', 
  image: props.modelValue?.image || 'https://ue.edu.pe/pregrado/images/dpa/carreras/administracion.png', 
  link: props.modelValue?.link || 'https://www.ue.edu.pe/pregrado/dpa/carreras/administracion-con-mencion-en-direccion-de-empresas',
  name: props.modelValue?.name || 'Administración con Mención en Dirección de Empresas (DPA)',
  icon: props.modelValue?.icon || 'https://ue.edu.pe/pregrado/templates/shaper_floox/images/administracionDPA-icono.png'
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
    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-building"></i> Tarjeta de Carrera DPA</h6>

        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Nombre del Programa</label>
          <textarea v-model="localData.name" class="form-control form-control-sm" rows="2"></textarea>
        </div>

        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Color de Acento</label>
          <input type="color" v-model="localData.color" class="form-control form-control-color w-100 p-1">
        </div>

        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Link de la Carrera</label>
          <input type="text" v-model="localData.link" class="form-control form-control-sm">
        </div>

        <div class="row g-2 mb-3">
          <div class="col-8">
            <label class="small text-muted d-block mb-1 fw-bold">Imagen (Graduado)</label>
            <div @click="$emit('select-image', { item: localData, field: 'image' })" 
                 class="media-placeholder border rounded mb-2 clickable"
                 :style="{ backgroundImage: `url(${localData.image})` }">
              <i v-if="!localData.image" class="las la-image fs-1 text-muted"></i>
            </div>
          </div>
          <div class="col-4">
            <label class="small text-muted d-block mb-1 fw-bold">Icono</label>
            <div @click="$emit('select-image', { item: localData, field: 'icon' })" 
                 class="media-placeholder border rounded mb-2 clickable bg-dark position-relative"
                 :style="{ backgroundImage: `url(${localData.icon})` }">
              <i v-if="!localData.icon" class="las la-image fs-1 text-white-50"></i>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.media-placeholder {
  height: 80px;
  background-color: #f8f9fa;
  background-size: contain; /* Contain to show full image in preview */
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

.clickable { cursor: pointer; }
</style>