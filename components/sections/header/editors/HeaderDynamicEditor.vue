<script setup lang="ts">
import { ref, watch } from 'vue';


const props = defineProps<{ 
  modelValue: any,
  availableSections?: Array<{ id: string, title: string }> 
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  
  logoDesktop: props.modelValue?.logoDesktop || '',
  logoMobile: props.modelValue?.logoMobile || '',
  textColor: props.modelValue?.textColor || '#ffffff',
  bgColor: props.modelValue?.bgColor || '#000000',
  bgOpacity: props.modelValue?.bgOpacity ?? 0,
  
  
  logoDesktopScrolled: props.modelValue?.logoDesktopScrolled || '',
  logoMobileScrolled: props.modelValue?.logoMobileScrolled || '',
  textColorScrolled: props.modelValue?.textColorScrolled || '#000000',
  bgColorScrolled: props.modelValue?.bgColorScrolled || '#ffffff',
  bgOpacityScrolled: props.modelValue?.bgOpacityScrolled ?? 1,

  logoUrl: props.modelValue?.logoUrl || '#',
  menuItems: props.modelValue?.menuItems ? [...props.modelValue.menuItems] : []
});


const showSectionPicker = ref(false);


watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(newVal) !== JSON.stringify(localData.value)) {
    localData.value = { ...localData.value, ...newVal };
  }
}, { deep: true });


watch(localData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });



const addMenuItem = () => {
  localData.value.menuItems.push({ label: 'NUEVA SECCIÓN', url: '#nueva-seccion' });
};

const removeMenuItem = (index: number) => {
  localData.value.menuItems.splice(index, 1);
};

/**
 * Importa una sección del canvas con nombre genérico y anclaje técnico
 */
const importSection = (section: { id: string, title: string }) => {
  localData.value.menuItems.push({ 
    label: `SECCIÓN ${localData.value.menuItems.length + 1}`, 
    url: `#sec-${section.id}` 
  });
};
</script>

<template>
  <div class="p-3 editor-header-container">
    
    <ul class="nav nav-tabs mb-3" id="headerTabs" role="tablist">
      <li class="nav-item">
        <button class="nav-link active py-1 px-2 small" data-bs-toggle="tab" data-bs-target="#initial" type="button">
          1. Arriba (Inicial)
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link py-1 px-2 small text-warning" data-bs-toggle="tab" data-bs-target="#sticky" type="button">
          2. Al Scrollear (Sticky)
        </button>
      </li>
    </ul>

    <div class="tab-content" id="headerTabsContent">
      
      <div class="tab-pane fade show active" id="initial" role="tabpanel">
        <div class="card mb-3 bg-light border-0 shadow-sm">
          <div class="card-body">
            <h6 class="fw-bold text-primary mb-3 small"><i class="las la-image"></i> LOGOS INICIALES</h6>
            <div class="row g-3">
              <div class="col-6 text-center">
                <label class="x-small d-block mb-2">Desktop</label>
                <div @click="$emit('select-image', { item: localData, field: 'logoDesktop' })" 
                     class="media-placeholder border rounded mb-2 clickable"
                     :style="{ backgroundImage: `url(${localData.logoDesktop})` }">
                  <i v-if="!localData.logoDesktop" class="las la-image fs-2 text-muted"></i>
                </div>
              </div>
              <div class="col-6 text-center">
                <label class="x-small d-block mb-2">Móvil</label>
                <div @click="$emit('select-image', { item: localData, field: 'logoMobile' })" 
                     class="media-placeholder border rounded mb-2 clickable"
                     :style="{ backgroundImage: `url(${localData.logoMobile})` }">
                  <i v-if="!localData.logoMobile" class="las la-image fs-2 text-muted"></i>
                </div>
              </div>
            </div>
            
            <hr>
            <h6 class="fw-bold text-primary mb-3 mt-2 small"><i class="las la-palette"></i> COLORES INICIALES</h6>
            <div class="row g-2 mb-2">
              <div class="col-6">
                <label class="x-small d-block mb-1">Texto/Menú</label>
                <input type="color" v-model="localData.textColor" class="form-control form-control-color w-100 p-1">
              </div>
              <div class="col-6">
                <label class="x-small d-block mb-1">Fondo</label>
                <input type="color" v-model="localData.bgColor" class="form-control form-control-color w-100 p-1">
              </div>
            </div>
            <div>
              <label class="x-small d-block">Opacidad Fondo: {{ Math.round(localData.bgOpacity * 100) }}%</label>
              <input type="range" v-model="localData.bgOpacity" min="0" max="1" step="0.05" class="form-range">
            </div>
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="sticky" role="tabpanel">
        <div class="card mb-3 bg-dark text-white border-0 shadow-sm">
          <div class="card-body">
            <p class="x-small text-muted mb-3 italic">Ajustes para cuando la cabecera se queda fija al bajar.</p>
            
            <h6 class="fw-bold text-warning mb-3 small"><i class="las la-image"></i> LOGOS STICKY (ALT)</h6>
            <div class="row g-3">
              <div class="col-6 text-center">
                <label class="x-small d-block mb-2">Desktop Alt</label>
                <div @click="$emit('select-image', { item: localData, field: 'logoDesktopScrolled' })" 
                     class="media-placeholder border border-secondary rounded mb-2 clickable bg-secondary"
                     :style="{ backgroundImage: `url(${localData.logoDesktopScrolled})` }">
                  <i v-if="!localData.logoDesktopScrolled" class="las la-image fs-2 text-white-50"></i>
                </div>
              </div>
              <div class="col-6 text-center">
                <label class="x-small d-block mb-2">Móvil Alt</label>
                <div @click="$emit('select-image', { item: localData, field: 'logoMobileScrolled' })" 
                     class="media-placeholder border border-secondary rounded mb-2 clickable bg-secondary"
                     :style="{ backgroundImage: `url(${localData.logoMobileScrolled})` }">
                  <i v-if="!localData.logoMobileScrolled" class="las la-image fs-2 text-white-50"></i>
                </div>
              </div>
            </div>

            <hr class="border-secondary">
            <h6 class="fw-bold text-warning mb-3 mt-2 small"><i class="las la-palette"></i> COLORES STICKY</h6>
            <div class="row g-2 mb-2">
              <div class="col-6">
                <label class="x-small d-block mb-1">Texto/Menú</label>
                <input type="color" v-model="localData.textColorScrolled" class="form-control form-control-color w-100 p-1">
              </div>
              <div class="col-6">
                <label class="x-small d-block mb-1">Fondo</label>
                <input type="color" v-model="localData.bgColorScrolled" class="form-control form-control-color w-100 p-1">
              </div>
            </div>
            <div>
              <label class="x-small d-block">Opacidad Fondo: {{ Math.round(localData.bgOpacityScrolled * 100) }}%</label>
              <input type="range" v-model="localData.bgOpacityScrolled" min="0" max="1" step="0.05" class="form-range">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold m-0 text-success small"><i class="las la-link"></i> CONFIGURACIÓN DE MENÚ</h6>
          
          <button 
            v-if="availableSections && availableSections.length"
            class="btn btn-xs btn-outline-primary shadow-sm" 
            @click="showSectionPicker = !showSectionPicker"
          >
            <i class="las la-list"></i> Listar Secciones
          </button>
        </div>

        <div v-if="showSectionPicker" class="section-picker-panel mb-3 p-2 border rounded bg-light shadow-inner">
          <p class="x-small text-muted mb-2 fw-bold">Añadir desde la página:</p>
          <div class="d-flex flex-wrap gap-1">
            <button 
              v-for="sec in availableSections" 
              :key="sec.id"
              @click="importSection(sec)"
              class="btn btn-xs btn-white border bg-white"
            >
              + {{ sec.title || 'Bloque' }}
            </button>
          </div>
        </div>
        
        <div class="mb-3">
          <label class="small text-muted mb-1">Enlace Principal del Logo</label>
          <input type="text" v-model="localData.logoUrl" class="form-control form-control-sm" placeholder="https://...">
        </div>

        <hr>

        <div v-for="(item, index) in localData.menuItems" :key="index" class="mb-3 p-2 border rounded bg-white shadow-sm item-menu">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary-subtle text-primary x-small">ENLACE {{ index + 1 }}</span>
            <button class="btn btn-sm btn-outline-danger py-0 px-2 border-0" @click="removeMenuItem(index)">
              <i class="las la-trash"></i>
            </button>
          </div>
          <div class="row g-2">
            <div class="col-6">
              <label class="x-small text-muted">Etiqueta</label>
              <input type="text" v-model="item.label" class="form-control form-control-sm" placeholder="Ej: INICIO">
            </div>
            <div class="col-6">
              <label class="x-small text-muted">Destino (ID/URL)</label>
              <input type="text" v-model="item.url" class="form-control form-control-sm" placeholder="Ej: #contacto">
            </div>
          </div>
        </div>
        
        <button class="btn btn-sm btn-outline-success w-100 fw-bold" @click="addMenuItem">
          <i class="las la-plus"></i> AGREGAR ENLACE MANUAL
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.media-placeholder {
  height: 70px;
  background-color: #f1f3f5;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: 0.2s;
}
.media-placeholder:hover {
  background-color: #e9ecef;
  border-color: #0d6efd !important;
}

.x-small { font-size: 0.65rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
.btn-xs { padding: 0.25rem 0.5rem; font-size: 0.7rem; font-weight: bold; }

.section-picker-panel { 
  max-height: 150px; 
  overflow-y: auto; 
  border-style: dashed !important;
}

.item-menu { 
  border-left: 4px solid #0d6efd !important; 
}

.form-control-color { height: 35px; border: none; cursor: pointer; }

/* Estilos de Tabs */
.nav-tabs .nav-link { 
  color: #6c757d; 
  border: none; 
  border-bottom: 2px solid transparent;
}
.nav-tabs .nav-link.active { 
  background: transparent; 
  border-bottom: 2px solid #0d6efd; 
  font-weight: bold; 
}

.shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
.clickable { cursor: pointer; }
</style>