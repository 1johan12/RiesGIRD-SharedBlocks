<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref({
  title: props.modelValue?.title || 'Nuestras Líneas Prioritarias de Investigación',
  introText: props.modelValue?.introText || 'Todas las investigaciones respaldadas por la Red se enmarcan en las siguientes áreas clave:',
  lineas: props.modelValue?.lineas || [],
  useContainer: props.modelValue?.useContainer ?? true,
});

// 🎯 BANCO DE ÍCONOS CIENTÍFICOS Y DE RIESGOS PARA LA RED
const iconBank = [
  { class: 'las la-chart-bar', name: 'Modelamiento / Gráficos' },
  { class: 'las la-globe-americas', name: 'Planeta / Cambio Climático' },
  { class: 'las la-map-marked-alt', name: 'Mapas / Ordenamiento Territorial' },
  { class: 'las la-broadcast-tower', name: 'Antena / Alerta Temprana SAT' },
  { class: 'las la-microscope', name: 'Microscopio / Ciencia' },
  { class: 'las la-shield-alt', name: 'Escudo / Gestión de Riesgos' },
  { class: 'las la-leaf', name: 'Hoja / Soluciones de la Naturaleza' },
  { class: 'las la-tint', name: 'Gota / Recursos Hídricos' },
  { class: 'las la-university', name: 'Universidad / Academia' },
  { class: 'las la-cloud-sun-rain', name: 'Clima / Meteorología' },
  { class: 'fa-solid fa-location-dot', name: 'Clima / Meteorología' },
  { class: 'fa-regular fa-handshake', name: 'Clima / Meteorología' },
  { class: 'fa-solid fa-hand-holding-medical', name: 'Clima / Meteorología' },
  { class: 'fa-solid fa-book', name: 'Clima / Meteorología' }
];

// Estados para el control del dropdown del Icon Picker
const activePickerIndex = ref<number | null>(null);
const searchQuery = ref('');

const toggleIconPicker = (index: number) => {
  if (activePickerIndex.value === index) {
    activePickerIndex.value = null;
  } else {
    activePickerIndex.value = index;
    searchQuery.value = '';
  }
};

const selectIconForLine = (index: number, iconClass: string) => {
  localData.value.lineas[index].icon = iconClass;
  activePickerIndex.value = null; // Cierra el selector al elegir
};

// Filtro reactivo para el buscador de la galería
const filteredIcons = (query: string) => {
  if (!query) return iconBank;
  return iconBank.filter(ico => 
    ico.name.toLowerCase().includes(query.toLowerCase()) || 
    ico.class.toLowerCase().includes(query.toLowerCase())
  );
};



// Operaciones reactivas para el control de la lista dinámica
const addLinea = () => {
  localData.value.lineas.push({
    id: Date.now(),
    title: 'Nueva Área de Investigación',
    desc: 'Descripción detallada de la línea científica priorizada.',
    icon: 'las la-microscope' // Ícono base por defecto
  });
};

const removeLinea = (index: number) => {
  localData.value.lineas.splice(index, 1);
  if (activePickerIndex.value === index) activePickerIndex.value = null;
};

// Sincronización blindada contra bucles de reactividad profunda
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
        <h6 class="fw-bold mb-3 text-warning"><i class="las la-heading"></i> Textos Base</h6>
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título de la Sección</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm fw-semibold">
        </div>
        <div class="mb-1">
          <label class="small text-muted mb-1 fw-bold">Descripción de Introducción</label>
          <textarea v-model="localData.introText" class="form-control form-control-sm" rows="3"></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="form-check form-switch mb-3">
          <input id="containerSwitch" v-model="localData.useContainer" class="form-check-input" type="checkbox">

          <label class="form-check-label small fw-bold" for="containerSwitch">
            Usar contenedor institucional
          </label>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-primary"><i class="las la-list"></i> Áreas Científicas</h6>
          <span class="badge bg-secondary text-white small">{{ localData.lineas.length }}</span>
        </div>

        <div v-for="(item, index) in localData.lineas" :key="item.id || index" class="border rounded mb-3 p-2 bg-light position-relative">
          
          <button 
            @click="removeLinea(Number(index))" 
            class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1 text-white" 
            title="Quitar Línea"
            :disabled="localData.lineas.length <= 1"
          >
            <i class="las la-times"></i>
          </button>

          <div class="row g-2 mt-2">
            
            <div class="col-12 mb-2 position-relative">
              <label class="x-small fw-bold text-muted d-block mb-1">Ícono de la Línea</label>
              
              <button 
                type="button"
                @click="toggleIconPicker(Number(index))"
                class="btn btn-sm btn-white border w-100 d-flex align-items-center justify-content-between fw-semibold p-2"
              >
                <span><i :class="[item.icon, 'fs-5 me-2 text-primary']"></i> {{ item.icon }}</span>
                <i class="las la-angle-down text-muted small"></i>
              </button>

              <div v-if="activePickerIndex === index" class="icon-picker-dropdown border rounded shadow-sm p-2 bg-white mt-1">
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  class="form-control form-control-sm mb-2" 
                  placeholder="🔍 Buscar ícono (ej: clima, mapa, sat)..."
                >
                <div class="icon-grid-scroll custom-mini-scrollbar">
                  <button
                    v-for="ico in filteredIcons(searchQuery)"
                    :key="ico.class"
                    type="button"
                    @click="selectIconForLine(index, ico.class)"                    
                    class="icon-grid-btn"
                    :title="ico.name"
                    :class="{ 'active-icon': item.icon === ico.class }"
                  >
                    <i :class="ico.class"></i>
                  </button>
                  <p v-if="filteredIcons(searchQuery).length === 0" class="text-center text-muted x-small my-2">No hay coincidencias</p>
                </div>
              </div>
            </div>

            <div class="col-12">
              <label class="x-small fw-bold text-muted mb-0.5">Título de la Línea</label>
              <input type="text" v-model="item.title" class="form-control form-control-sm fw-bold">
            </div>
            <div class="col-12">
              <label class="x-small fw-bold text-muted mb-0.5">Descripción o Alcance</label>
              <textarea v-model="item.desc" class="form-control form-control-sm small-text" rows="3"></textarea>
            </div>
          </div>

        </div>

        <button @click="addLinea" class="btn btn-sm btn-outline-success w-100 mt-2">
          <i class="las la-plus"></i> Añadir Nueva Línea
        </button>

      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
.small-text { font-size: 0.76rem; line-height: 1.4; }

/* Estilos de la ventana flotante del Selector de Íconos */
.icon-picker-dropdown {
  position: absolute; top: 100%; left: 0; width: 100%; z-index: 999; box-sizing: border-box;
}
.icon-grid-scroll {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; max-height: 130px; overflow-y: auto; padding: 2px;
}
.icon-grid-btn {
  height: 38px; background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 6px; display: grid; place-items: center; font-size: 1.25rem; color: #334155; cursor: pointer; transition: all 0.15s;
}
.icon-grid-btn:hover { background: #e0f2fe; border-color: #0ea5e9; color: #0369a1; }
.icon-grid-btn.active-icon { background: #0ea5e9; border-color: #0284c7; color: #ffffff; }
.custom-mini-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-mini-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>