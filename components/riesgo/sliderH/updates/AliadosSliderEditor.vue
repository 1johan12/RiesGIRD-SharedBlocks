<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

// Data local reactiva protegida contra bucles infinitos
const localData = ref({
  title: props.modelValue?.title || 'Aliados',
  logos: props.modelValue?.logos || []
});

const addLogo = () => {
  localData.value.logos.push({
    id: Date.now(),
    name: 'Nueva Marca',
    src: ''
  });
};

const removeLogo = (index: number) => {
  localData.value.logos.splice(index, 1);
};

// Sincronizador estricto por JSON stringify para cortar ciclos reactivos
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
    
    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-cog"></i> Título de la Sección</h6>
        <div>
          <input type="text" v-model="localData.title" class="form-control form-control-sm" placeholder="Ej: Aliados o Marcas Co-organizadoras">
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-warning"><i class="las la-images"></i> Directorio de Logos</h6>
          <span class="badge bg-secondary text-white small">{{ localData.logos.length }}</span>
        </div>

        <p class="x-small text-muted mb-3">Se recomienda subir archivos en formato PNG transparente o SVG con dimensiones proporcionales.</p>

        <div v-for="(item, index) in localData.logos" :key="item.id || index" class="border rounded mb-3 p-2 bg-light position-relative">
          
          <button 
            @click="removeLogo(Number(index))" 
            class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1 text-white border-0" 
            title="Eliminar"
          >
            <i class="las la-times"></i>
          </button>

          <div class="row g-2 align-items-center mt-2">
            <div class="col-4 text-center">
              <div 
                @click="$emit('select-image', { item: item, field: 'src' })" 
                class="logo-placeholder border rounded clickable bg-white"
                :style="{ backgroundImage: `url(${item.src})` }"
                title="Cambiar Logo"
              >
                <i v-if="!item.src" class="las la-cloud-upload-alt fs-3 text-muted"></i>
              </div>
            </div>
            
            <div class="col-8">
              <label class="x-small fw-bold text-muted mb-1">Nombre Comercial</label>
              <input type="text" v-model="item.name" class="form-control form-control-sm" placeholder="Ej: Banco Interamericano">
            </div>
          </div>

        </div>

        <button @click="addLogo" class="btn btn-sm btn-outline-success w-100 mt-2">
          <i class="las la-plus"></i> Añadir Nueva Marca
        </button>

      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.7rem; }
.logo-placeholder {
  width: 100%;
  height: 65px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s;
}
.clickable:hover {
  border-color: #0d6efd !important;
  box-shadow: 0 0 0 1px #0d6efd;
  opacity: 0.85;
}
</style>