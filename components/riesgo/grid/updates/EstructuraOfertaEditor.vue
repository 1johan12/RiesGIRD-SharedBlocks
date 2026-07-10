<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref({
  title: props.modelValue?.title || '¿Cómo estructuramos la oferta?',
  introText: props.modelValue?.introText || 'El camino hacia una oferta consolidada ha sido progresivo...',
  ofertas: props.modelValue?.ofertas || []
});

// 🎯 BANCO DE ÍCONOS SUGERIDOS PARA LA RED (LineAwesome o Bootstrap Icons)
const iconBank = [
  { class: 'las la-graduation-cap', name: 'Graduación / Educación' },
  { class: 'las la-university', name: 'Universidad / Campus' },
  { class: 'las la-book', name: 'Libro / Cursos' },
  { class: 'las la-users', name: 'Comunidad / Alumnos' },
  { class: 'las la-microscope', name: 'Investigación / Ciencia' },
  { class: 'las la-shield-alt', name: 'Riesgos / Protección' },
  { class: 'las la-chart-bar', name: 'Modelamiento / Datos' },
  { class: 'las la-globe-americas', name: 'Clima / Planeta' },
  { class: 'las la-folder-open', name: 'Repositorio / Archivo' },
  { class: 'las la-certificate', name: 'Acreditación / Logro' }
];

// Estados para controlar cuál tarjeta está abriendo su selector de íconos
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

const selectIconForCard = (index: number, iconClass: string) => {
  localData.value.ofertas[index].icon = iconClass;
  activePickerIndex.value = null; // Cierra el selector automáticamente
};

// Filtro en tiempo real para el buscador de la rejilla
const filteredIcons = (query: string) => {
  if (!query) return iconBank;
  return iconBank.filter(ico => 
    ico.name.toLowerCase().includes(query.toLowerCase()) || 
    ico.class.toLowerCase().includes(query.toLowerCase())
  );
};

// Operaciones reactivas de la colección
const addOferta = () => {
  localData.value.ofertas.push({
    id: Date.now(),
    nivelTag: 'Nuevo Nivel',
    subtitle: 'Título del Programa',
    description: 'Descripción de las competencias del bloque.',
    icon: 'las la-graduation-cap' // Ícono por defecto
  });
};

const removeOferta = (index: number) => {
  localData.value.ofertas.splice(index, 1);
  if (activePickerIndex.value === index) activePickerIndex.value = null;
};

// Sincronizador blindado contra bucles de reactividad profunda
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
        <h6 class="fw-bold mb-3 text-warning"><i class="las la-heading"></i> Encabezado</h6>
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título de la Sección</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm fw-semibold">
        </div>
        <div class="mb-1">
          <label class="small text-muted mb-1 fw-bold">Texto de Introducción</label>
          <textarea v-model="localData.introText" class="form-control form-control-sm" rows="3"></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-primary"><i class="las la-graduation-cap"></i> Oferta Académica</h6>
          <span class="badge bg-secondary text-white small">{{ localData.ofertas.length }}</span>
        </div>

        <div v-for="(item, index) in localData.ofertas" :key="item.id || index" class="border rounded mb-3 p-2 bg-light position-relative">
          
          <button 
            @click="removeOferta(Number(index))" 
            class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1 text-white" 
            :disabled="localData.ofertas.length <= 1"
          >
            <i class="las la-times"></i>
          </button>

          <div class="row g-2 mt-2">
            
            <div class="col-12 mb-2 position-relative">
              <label class="x-small fw-bold text-muted d-block mb-1">Ícono Representativo</label>
              
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
                  placeholder="🔍 Buscar ícono (ej: libro, universidad)..."
                >
                <div class="icon-grid-scroll custom-mini-scrollbar">
                  <button
                    v-for="ico in filteredIcons(searchQuery)"
                    :key="ico.class"
                    type="button"
                    @click="selectIconForCard(index, ico.class)"
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
              <label class="x-small fw-bold text-muted mb-0.5">Etiqueta de Nivel</label>
              <input type="text" v-model="item.nivelTag" class="form-control form-control-sm fw-bold text-danger">
            </div>
            <div class="col-12">
              <label class="x-small fw-bold text-muted mb-0.5">Subtítulo de la Card</label>
              <input type="text" v-model="item.subtitle" class="form-control form-control-sm fw-bold">
            </div>
            <div class="col-12">
              <label class="x-small fw-bold text-muted mb-0.5">Descripción Académica</label>
              <textarea v-model="item.description" class="form-control form-control-sm small-text" rows="3"></textarea>
            </div>
          </div>

        </div>

        <button @click="addOferta" class="btn btn-sm btn-outline-success w-100 mt-2" :disabled="localData.ofertas.length >= 2">
          <i class="las la-plus"></i> Añadir Nivel Académico (Máx 2)
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
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 999;
  box-sizing: border-box;
}
.icon-grid-scroll {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  max-height: 130px;
  overflow-y: auto;
  padding: 2px;
}
.icon-grid-btn {
  height: 38px;
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  display: grid;
  place-items: center;
  font-size: 1.25rem;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s;
}
.icon-grid-btn:hover {
  background: #e0f2fe;
  border-color: #0ea5e9;
  color: #0369a1;
}
.icon-grid-btn.active-icon {
  background: #0ea5e9;
  border-color: #0284c7;
  color: #ffffff;
}
.custom-mini-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-mini-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>