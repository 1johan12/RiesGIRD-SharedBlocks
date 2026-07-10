<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref({
  title: props.modelValue?.title || 'Nuestro Repositorio',
  introText: props.modelValue?.introText || 'Transferimos la ciencia a la práctica a través de recursos de libre acceso.',
  ejes: props.modelValue?.ejes || []
});

// Métodos reactivos para el control de colecciones dinámicas en la barra lateral
const addEje = () => {
  localData.value.ejes.push({
    id: Date.now(),
    titulo: 'Nueva Sección de Biblioteca',
    descripcion: 'Breve resumen explicativo de los recursos y archivos disponibles en este eje del repositorio.',
    icono: 'las la-folder-open'
  });
};

const removeEje = (index: number) => {
  localData.value.ejes.splice(index, 1);
};

// Sincronizador estricto para evitar loops de actualización profunda
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
        <h6 class="fw-bold mb-3 text-warning"><i class="las la-heading"></i> Copys de Cabecera</h6>
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título de la Sección</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm fw-semibold">
        </div>
        <div class="mb-1">
          <label class="small text-muted mb-1 fw-bold">Reseña de Introducción</label>
          <textarea v-model="localData.introText" class="form-control form-control-sm" rows="3"></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-primary"><i class="las la-archive"></i> Categorías del Repositorio</h6>
          <span class="badge bg-secondary text-white small">{{ localData.ejes.length }}</span>
        </div>

        <div v-for="(item, index) in localData.ejes" :key="item.id || index" class="border rounded mb-3 p-2 bg-light position-relative">
          
          <button 
            @click="removeEje(Number(index))" 
            class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1 text-white" 
            title="Quitar Categoría"
            :disabled="localData.ejes.length <= 1"
          >
            <i class="las la-times"></i>
          </button>

          <div class="row g-2 mt-2">
            <div class="col-12">
              <label class="x-small fw-bold text-muted mb-0.5">Título del Eje</label>
              <input type="text" v-model="item.titulo" class="form-control form-control-sm fw-bold">
            </div>
            <div class="col-12">
              <label class="x-small fw-bold text-muted mb-0.5">Descripción o Alcance</label>
              <textarea v-model="item.descripcion" class="form-control form-control-sm small-text" rows="3"></textarea>
            </div>
            <div class="col-12">
              <label class="x-small fw-bold text-muted mb-0.5">Clase del Ícono (Line/FontAwesome)</label>
              <input type="text" v-model="item.icono" class="form-control form-control-sm icon-text" placeholder="Ej: las la-book-open o fa-solid fa-book">
            </div>
          </div>

        </div>

        <button @click="addEje" class="btn btn-sm btn-outline-success w-100 mt-2">
          <i class="las la-plus"></i> Añadir Nueva Categoría
        </button>

      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
.small-text { font-size: 0.76rem; line-height: 1.4; }
.icon-text { font-family: monospace; font-size: 0.72rem; color: #475569; }
</style>