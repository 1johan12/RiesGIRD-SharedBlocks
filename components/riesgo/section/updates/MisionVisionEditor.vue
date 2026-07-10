<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

// Estado local aislado e inicializado de manera segura
const localData = ref({
  visionTitle: props.modelValue?.visionTitle || 'Nuestra Visión',
  visionText: props.modelValue?.visionText || '',
  visionImageUrl: props.modelValue?.visionImageUrl || '',
  
  misionTitle: props.modelValue?.misionTitle || 'Nuestra Misión',
  misionText: props.modelValue?.misionText || '',
  misionImageUrl: props.modelValue?.misionImageUrl || ''
});

// Control activo para seccionar los formularios en el inspector lateral
const activeTab = ref<'vision' | 'mision'>('vision');

// Sincronización bidireccional limpia sin bucles infinitos
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
  <div class="p-2">
    
    <div class="btn-group w-100 mb-3 shadow-sm rounded-3 overflow-hidden">
      <button 
        class="btn btn-sm" 
        :class="activeTab === 'vision' ? 'btn-primary' : 'btn-light border'"
        @click="activeTab = 'vision'"
      >
        <i class="las la-eye"></i> Visión
      </button>
      <button 
        class="btn btn-sm" 
        :class="activeTab === 'mision' ? 'btn-danger' : 'btn-light border'"
        @click="activeTab = 'mision'"
      >
        <i class="las la-flag"></i> Misión
      </button>
    </div>

    <div v-if="activeTab === 'vision'" class="card border-0 shadow-sm animate-fade-in">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-eye"></i> Contenido de la Visión</h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título</label>
          <input type="text" v-model="localData.visionTitle" class="form-control form-control-sm">
        </div>

        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Texto Descriptivo</label>
          <textarea v-model="localData.visionText" class="form-control form-control-sm" rows="5"></textarea>
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold d-block">Imagen Corporativa (Visión)</label>
          <div 
            @click="$emit('select-image', { item: localData, field: 'visionImageUrl' })" 
            class="media-placeholder border rounded clickable bg-light"
            :style="{ backgroundImage: `url(${localData.visionImageUrl})` }"
          >
            <i v-if="!localData.visionImageUrl" class="las la-image fs-3 text-muted"></i>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'mision'" class="card border-0 shadow-sm animate-fade-in">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-danger"><i class="las la-flag"></i> Contenido de la Misión</h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título</label>
          <input type="text" v-model="localData.misionTitle" class="form-control form-control-sm">
        </div>

        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Texto Descriptivo</label>
          <textarea v-model="localData.misionText" class="form-control form-control-sm" rows="5"></textarea>
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold d-block">Imagen Corporativa (Misión)</label>
          <div 
            @click="$emit('select-image', { item: localData, field: 'misionImageUrl' })" 
            class="media-placeholder border rounded clickable bg-light"
            :style="{ backgroundImage: `url(${localData.misionImageUrl})` }"
          >
            <i v-if="!localData.misionImageUrl" class="las la-image fs-3 text-muted"></i>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.media-placeholder { 
  height: 120px; 
  background-size: cover; 
  background-position: center; 
  display: grid; 
  place-items: center; 
  cursor: pointer; 
  transition: all 0.2s;
}
.clickable:hover { 
  opacity: 0.85; 
  border-color: #0d6efd !important; 
  box-shadow: 0 0 0 1px #0d6efd;
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>